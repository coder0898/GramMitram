// AppContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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

const API_BASE = process.env.VITE_PUBLIC_API_BASE;

/* ================= CONTEXT ================= */

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

/* ================= PROVIDER ================= */

export const AppProvider = ({ children }) => {
  const { currentUser, getToken } = useAuth();

  const isAdmin = currentUser?.role === "admin";
  const isStaff = currentUser?.role === "staff";

  /* ================= STATE ================= */

  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to log actions
  const logAction = async (action, details = {}) => {
    try {
      await fetch(`${API_BASE}/api/log`, {
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
  };

  /* ================= REALTIME LISTENERS ================= */

  // Applications (ALL ROLES)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "applications"), (snap) => {
      setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    logAction("view_applications", { count: applications.length });
    return () => unsub();
  }, []);

  // Services (ALL ROLES)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "services"), (snap) => {
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    logAction("view_services", { count: services.length });

    return () => unsub();
  }, []);

  // Staff list (ADMIN ONLY)
  useEffect(() => {
    if (!isAdmin) return;

    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStaffList(users.filter((u) => u.role === "staff"));
    });

    logAction("view_staff_list", { count: staffList.length });

    return () => unsub();
  }, [isAdmin]);

  /* ================= APPLICATION ACTIONS ================= */

  const updateApplication = async (id, data) => {
    await updateDoc(doc(db, "applications", id), data);
    await logAction("update_application", { applicationId: id, data });
  };

  const assignStaff = async (appId, staffEmail) => {
    await updateDoc(doc(db, "applications", appId), {
      staff: staffEmail,
      status: "under_review",
    });
    await logAction("assign_staff", { applicationId: appId, staffEmail });
  };

  const applyForService = async (data, files) => {
    if (!files || files.length === 0)
      throw new Error("At least one document is required");

    if (!currentUser) throw new Error("User not logged in");

    // 1️⃣ Create application first
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

        // validate and provide defaults
        uploadedDocs.push({
          documentName: uploadedDoc.documentName || file.name,
          fileName: uploadedDoc.fileName || file.name, // fallback to file.name
          fileUrl: uploadedDoc.fileUrl || "", // empty string instead of null/undefined
        });
      }

      await updateDoc(doc(db, "applications", docRef.id), {
        documents: uploadedDocs,
      });

      await logAction("apply_for_service", {
        applicationId: docRef.id,
        uploadedDocs,
      });

      return docRef;
    } catch (err) {
      await deleteDoc(doc(db, "applications", docRef.id));
      throw err;
    }
  };

  /* ================= SERVICE ACTIONS (ADMIN ONLY) ================= */

  const createService = async (service) => {
    const docRef = await addDoc(collection(db, "services"), {
      ...service,
      createdAt: new Date(),
    });

    await logAction("create_service", { serviceId: docRef.id, service });
  };

  const updateService = async (service) => {
    await updateDoc(doc(db, "services", service.id), service);
    await logAction("update_service", { serviceId: service.id, service });
  };

  const deleteService = async (id) => {
    await deleteDoc(doc(db, "services", id));
    await logAction("delete_service", { serviceId: id });
  };

  /* ================= STAFF MANAGEMENT (ADMIN ONLY) ================= */

  const signupStaff = async ({ username, email, role }) => {
    await addDoc(collection(db, "users"), {
      username,
      email,
      role,
      createdAt: new Date(),
    });
    await logAction("signup_staff", {
      staffId: docRef.id,
      username,
      email,
      role,
    });
  };

  const deleteStaff = async (staffId) => {
    await deleteDoc(doc(db, "users", staffId));
    await logAction("delete_staff", { staffId });
  };

  /* ================= DERIVED DATA ================= */

  // ACTIVE SERVICES
  const activeServices = useMemo(
    () => services.filter((s) => s.service_status === true),
    [services]
  );

  // USER APPLICATIONS
  const myApplications = useMemo(() => {
    if (!currentUser) return [];
    return applications.filter((a) => a.userEmail === currentUser.email);
  }, [applications, currentUser]);

  // SERVICES VISIBLE BY ROLE
  const visibleServices = useMemo(() => {
    const base = isAdmin ? services : activeServices;

    return base.map((service) => ({
      ...service,
      applied:
        !isAdmin &&
        myApplications?.some((a) => a.service === service.service_name),
    }));
  }, [services, activeServices, isAdmin, myApplications]);

  // STAFF APPLICATIONS
  const staffApplications = useMemo(() => {
    if (!currentUser || !isStaff) return [];
    return applications.filter((a) => a.staff === currentUser.email);
  }, [applications, currentUser, isStaff]);

  /* ================= DASHBOARD STATS ================= */

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

  /* ================= FILE UPLOAD & DOWNLOAD ================= */

  const uploadFile = async (applicationId, file) => {
    if (!file) throw new Error("No file provided");
    if (!currentUser?.firebaseUser) throw new Error("User not logged in");

    // 🔑 Get a fresh Firebase ID token
    const token = await getToken();
    if (!token) throw new Error("Failed to get auth token", token);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${API_BASE}/api/applications/${applicationId}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    await logAction("upload_document", {
      applicationId,
      fileName: file.name,
    });

    // Use fileUrl returned from backend
    const uploadedFile = data.uploadedFiles?.[0];
    if (!uploadedFile)
      throw new Error("No uploaded file info returned from backend");

    return {
      documentName: uploadedFile.documentName, // original name
      fileName: uploadedFile.fileName, // same as original name if you changed backend
      fileUrl: uploadedFile.fileUrl, // now this is defined
    };
  };

  const downloadFile = async (applicationId, fileName) => {
    if (!currentUser?.firebaseUser) throw new Error("User not logged in");

    // 🔑 Get a fresh Firebase ID token
    const token = await getToken();
    if (!token) throw new Error("Failed to get auth token", token);

    const res = await fetch(`${API_BASE}/api/files/${fileName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Download failed");
    }

    // Convert response to blob
    const blob = await res.blob();

    // Create a link and trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // suggested filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url); // clean up

    // Optional: log download action
    await logAction("download_document", {
      applicationId,
      fileName,
    });
  };

  /* ================= PROVIDER ================= */

  return (
    <AppContext.Provider
      value={{
        loading,

        // services
        services: visibleServices,
        allServices: services, // admin only
        activeServices,
        createService,
        updateService,
        deleteService,

        // applications
        applications,
        myApplications,
        staffApplications,
        applyForService,
        updateApplication,
        assignStaff,

        // staff (admin)
        staffList,
        signupStaff,
        deleteStaff,

        // stats
        adminStats,
        userStats,
        staffStats,

        // file actions
        uploadFile,
        downloadFile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
