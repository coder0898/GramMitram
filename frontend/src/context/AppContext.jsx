// AppContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "./AuthContext";

/* ================= CONTEXT ================= */

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

/* ================= PROVIDER ================= */

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();

  /* ================= COMMON STATE ================= */

  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = currentUser?.role === "admin";
  const isStaff = currentUser?.role === "staff";

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchServices = async () => {
      const snap = await getDocs(collection(db, "services"));
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    const fetchApplications = async () => {
      const snap = await getDocs(collection(db, "applications"));
      setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    const fetchStaff = async () => {
      const snap = await getDocs(collection(db, "users"));
      const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStaffList(users.filter((u) => u.role === "staff"));
    };

    const loadData = async () => {
      setLoading(true);
      await fetchServices();
      await fetchApplications();
      if (isAdmin) await fetchStaff();
      setLoading(false);
    };

    loadData();
  }, [isAdmin]);

  /* ================= APPLICATION ACTIONS ================= */

  const updateApplication = async (id, data) => {
    await updateDoc(doc(db, "applications", id), data);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  };

  const assignStaff = async (appId, staffEmail) => {
    await updateApplication(appId, {
      staff: staffEmail,
      status: "under_review",
    });
  };

  /* ================= ADMIN: STAFF ================= */

  const signupStaff = async ({ username, email, role, password }) => {
    const ref = await addDoc(collection(db, "users"), {
      username,
      email,
      role,
      password,
      createdAt: new Date(),
    });
    setStaffList((prev) => [...prev, { id: ref.id, username, email, role }]);
  };

  const deleteStaff = async (staffId) => {
    await deleteDoc(doc(db, "users", staffId));
    setStaffList((prev) => prev.filter((s) => s.id !== staffId));
  };

  /* ================= ADMIN: SERVICES ================= */

  const createService = async (service) => {
    const ref = await addDoc(collection(db, "services"), service);
    setServices((prev) => [...prev, { id: ref.id, ...service }]);
  };

  const updateService = async (service) => {
    await updateDoc(doc(db, "services", service.id), service);
    setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)));
  };

  const deleteService = async (id) => {
    await deleteDoc(doc(db, "services", id));
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  /* ================= USER ================= */
  const myApplications = useMemo(() => {
    if (!currentUser) return [];
    return applications
      .filter((a) => a.userEmail === currentUser.email)
      .map((a) => ({
        id: a.id,
        userEmail: a.userEmail || "-", // fallback if missing
        service: a.service || "-",
        status: a.status || "submitted",
        createdAt: a.createdAt || null,
        staff: a.staff || null,
        remark: a.remark || "",
      }));
  }, [applications, currentUser]);
  const applyForService = async (data) => {
    await addDoc(collection(db, "applications"), {
      ...data,
      userEmail: currentUser.email,
      status: "submitted",
      staff: null,
      createdAt: new Date(),
    });
  };

  /* ================= STAFF ================= */
  const staffApplications = useMemo(() => {
    if (!currentUser || !isStaff) return [];
    return applications.map((a) => ({
      id: a.id,
      userEmail: a.userEmail || "-",
      service: a.service || "-",
      status: a.status || "under_review",
      createdAt: a.createdAt || null,
      staff: a.staff || null,
      remark: a.remark || "",
    })); // include all applications for staff, filtering can happen in table
  }, [applications, currentUser, isStaff]);
  /* ================= DASHBOARD STATS ================= */

  const adminStats = useMemo(
    () => ({
      totalServices: services.length,
      activeServices: services.filter((s) => s.service_status).length,
      inactiveServices:
        services.length - services.filter((s) => s.service_status).length,
      totalApplications: applications.length,
      approvedApplications: applications.filter((a) => a.status === "approved")
        .length,
      rejectedApplications: applications.filter((a) => a.status === "rejected")
        .length,
    }),
    [services, applications]
  );

  const userStats = useMemo(() => {
    const total = myApplications.length;
    return {
      total,
      submitted: myApplications.filter((a) => a.status === "submitted").length,
      underReview: myApplications.filter((a) => a.status === "under_review")
        .length,
      approved: myApplications.filter((a) => a.status === "approved").length,
      rejected: myApplications.filter((a) => a.status === "rejected").length,
    };
  }, [myApplications]);

  const staffStats = useMemo(() => {
    return {
      totalAssigned: staffApplications.length,
      underReview: staffApplications.filter((a) => a.status === "under_review")
        .length,
      forwarded: staffApplications.filter((a) => a.status === "forwarded")
        .length,
      rejected: staffApplications.filter((a) => a.status === "rejected").length,
    };
  }, [staffApplications]);

  /* ================= PROVIDER ================= */

  return (
    <AppContext.Provider
      value={{
        loading,

        // common
        applications,
        services,

        // admin
        staffList,
        assignStaff,
        signupStaff,
        deleteStaff,
        createService,
        updateService,
        deleteService,
        adminStats,

        // user
        myApplications,
        applyForService,
        userStats,
        activeServices: services.filter((s) => s.service_status),

        // staff
        staffApplications,
        updateApplication,
        staffStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
