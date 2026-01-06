import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "./AuthContext";

const API_BASE = import.meta.env.VITE_PUBLIC_API;

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { currentUser, getToken } = useAuth();

  const isAdmin = currentUser?.role === "admin";
  const isStaff = currentUser?.role === "staff";

  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---- Async logging (non-blocking) ----
  const logAction = useCallback(
    async (action, details = {}) => {
      try {
        fetch(`${API_BASE}/api/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser?.uid || "unknown",
            role: currentUser?.role || "unknown",
            action,
            details,
          }),
        });
      } catch (err) {
        console.error("Failed to log action:", err);
      }
    },
    [currentUser]
  );

  // ---- REALTIME LISTENERS ----
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "applications"), (snap) => {
      const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setApplications(apps);
      setLoading(false);
      logAction("view_applications", { count: apps.length });
    });
    return () => unsub();
  }, [logAction]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "services"), (snap) => {
      const svcs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setServices(svcs);
      logAction("view_services", { count: svcs.length });
    });
    return () => unsub();
  }, [logAction]);

  useEffect(() => {
    if (!isAdmin) return;
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStaffList(users.filter((u) => u.role === "staff"));
      logAction("view_staff_list", {
        count: users.filter((u) => u.role === "staff").length,
      });
    });
    return () => unsub();
  }, [isAdmin, logAction]);

  // ---- APPLICATION ACTIONS ----
  const updateApplication = useCallback(
    async (id, data) => {
      await updateDoc(doc(db, "applications", id), data);
      logAction("update_application", { applicationId: id, data });
    },
    [logAction]
  );

  const assignStaff = useCallback(
    async (appId, staffEmail) => {
      await updateDoc(doc(db, "applications", appId), {
        staff: staffEmail,
        status: "under_review",
      });
      logAction("assign_staff", { applicationId: appId, staffEmail });
    },
    [logAction]
  );

  const applyForService = useCallback(
    async (data, files) => {
      if (!files || files.length === 0)
        throw new Error("At least one document is required");
      if (!currentUser) throw new Error("User not logged in");

      const docRef = await addDoc(collection(db, "applications"), {
        ...data,
        userEmail: currentUser.email,
        status: "submitted",
        staff: null,
        createdAt: new Date(),
        documents: [],
      });

      try {
        const uploadedDocs = [];
        for (const file of files) {
          const uploadedDoc = await uploadFile(docRef.id, file);
          uploadedDocs.push({
            documentName: uploadedDoc.documentName || file.name,
            fileName: uploadedDoc.fileName || file.name,
            fileUrl: uploadedDoc.fileUrl || "",
          });
        }

        await updateDoc(doc(db, "applications", docRef.id), {
          documents: uploadedDocs,
        });
        logAction("apply_for_service", {
          applicationId: docRef.id,
          uploadedDocs,
        });

        return docRef;
      } catch (err) {
        await deleteDoc(doc(db, "applications", docRef.id));
        throw err;
      }
    },
    [currentUser, logAction, getToken]
  );

  // ---- SERVICE ACTIONS ----
  const createService = useCallback(
    async (service) => {
      const docRef = await addDoc(collection(db, "services"), {
        ...service,
        createdAt: new Date(),
      });
      logAction("create_service", { serviceId: docRef.id, service });
    },
    [logAction]
  );

  const updateService = useCallback(
    async (service) => {
      await updateDoc(doc(db, "services", service.id), service);
      logAction("update_service", { serviceId: service.id, service });
    },
    [logAction]
  );

  const deleteService = useCallback(
    async (id) => {
      await deleteDoc(doc(db, "services", id));
      logAction("delete_service", { serviceId: id });
    },
    [logAction]
  );

  // ---- STAFF MANAGEMENT ----
  const signupStaff = useCallback(
    async ({ username, email, role }) => {
      const docRef = await addDoc(collection(db, "users"), {
        username,
        email,
        role,
        createdAt: new Date(),
      });
      logAction("signup_staff", { staffId: docRef.id, username, email, role });
    },
    [logAction]
  );

  const deleteStaff = useCallback(
    async (staffId) => {
      await deleteDoc(doc(db, "users", staffId));
      logAction("delete_staff", { staffId });
    },
    [logAction]
  );

  // ---- DERIVED DATA ----
  const activeServices = useMemo(
    () => services.filter((s) => s.service_status === true),
    [services]
  );
  const myApplications = useMemo(
    () =>
      currentUser
        ? applications.filter((a) => a.userEmail === currentUser.email)
        : [],
    [applications, currentUser]
  );
  const visibleServices = useMemo(() => {
    const base = isAdmin ? services : activeServices;
    return base.map((service) => ({
      ...service,
      applied:
        !isAdmin &&
        myApplications.some((a) => a.service === service.service_name),
    }));
  }, [services, activeServices, isAdmin, myApplications]);
  const staffApplications = useMemo(
    () =>
      currentUser && isStaff
        ? applications.filter((a) => a.staff === currentUser.email)
        : [],
    [applications, currentUser, isStaff]
  );

  const adminStats = useMemo(
    () => ({
      totalServices: services.length,
      activeServices: activeServices.length,
      inactiveServices: services.length - activeServices.length,
      totalApplications: applications.length,
      approvedApplications: applications.filter((a) => a.status === "approved")
        .length,
      rejectedApplications: applications.filter((a) => a.status === "rejected")
        .length,
    }),
    [services, applications, activeServices]
  );

  const userStats = useMemo(
    () => ({
      total: myApplications.length,
      submitted: myApplications.filter((a) => a.status === "submitted").length,
      underReview: myApplications.filter((a) => a.status === "under_review")
        .length,
      approved: myApplications.filter((a) => a.status === "approved").length,
      rejected: myApplications.filter((a) => a.status === "rejected").length,
    }),
    [myApplications]
  );

  const staffStats = useMemo(
    () => ({
      totalAssigned: staffApplications.length,
      underReview: staffApplications.filter((a) => a.status === "under_review")
        .length,
      approved: staffApplications.filter((a) => a.status === "approved").length,
      rejected: staffApplications.filter((a) => a.status === "rejected").length,
    }),
    [staffApplications]
  );

  // ---- FILE UPLOAD/DOWNLOAD ----
  const uploadFile = useCallback(
    async (applicationId, file) => {
      if (!file) throw new Error("No file provided");
      if (!currentUser?.firebaseUser) throw new Error("User not logged in");

      const token = await getToken();
      if (!token) throw new Error("Failed to get auth token");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${API_BASE}/api/applications/${applicationId}/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      logAction("upload_document", { applicationId, fileName: file.name });

      const uploadedFile = data.uploadedFiles?.[0];
      if (!uploadedFile)
        throw new Error("No uploaded file info returned from backend");

      return {
        documentName: uploadedFile.documentName,
        fileName: uploadedFile.fileName,
        fileUrl: uploadedFile.fileUrl,
      };
    },
    [currentUser, getToken, logAction]
  );

  const downloadFile = useCallback(
    async (applicationId, fileName) => {
      if (!currentUser?.firebaseUser) throw new Error("User not logged in");

      const token = await getToken();
      if (!token) throw new Error("Failed to get auth token");

      const res = await fetch(`${API_BASE}/api/files/${fileName}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      logAction("download_document", { applicationId, fileName });
    },
    [currentUser, getToken, logAction]
  );

  return (
    <AppContext.Provider
      value={{
        loading,
        services: visibleServices,
        allServices: services,
        activeServices,
        createService,
        updateService,
        deleteService,
        applications,
        myApplications,
        staffApplications,
        applyForService,
        updateApplication,
        assignStaff,
        staffList,
        signupStaff,
        deleteStaff,
        adminStats,
        userStats,
        staffStats,
        uploadFile,
        downloadFile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
