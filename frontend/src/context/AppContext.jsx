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

/* ================= CONTEXT ================= */

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

/* ================= PROVIDER ================= */

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const isAdmin = currentUser?.role === "admin";
  const isStaff = currentUser?.role === "staff";

  /* ================= STATE ================= */

  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= REALTIME LISTENERS ================= */

  // Applications (ALL ROLES)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "applications"), (snap) => {
      setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Services (ALL ROLES)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "services"), (snap) => {
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Staff list (ADMIN ONLY)
  useEffect(() => {
    if (!isAdmin) return;

    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStaffList(users.filter((u) => u.role === "staff"));
    });

    return () => unsub();
  }, [isAdmin]);

  /* ================= APPLICATION ACTIONS ================= */

  const updateApplication = async (id, data) => {
    await updateDoc(doc(db, "applications", id), data);
  };

  const assignStaff = async (appId, staffEmail) => {
    await updateDoc(doc(db, "applications", appId), {
      staff: staffEmail,
      status: "under_review",
    });
  };

  const applyForService = async (data) => {
    await addDoc(collection(db, "applications"), {
      ...data,
      userEmail: currentUser.email,
      status: "submitted",
      staff: null,
      createdAt: new Date(),
    });
  };

  /* ================= SERVICE ACTIONS (ADMIN ONLY) ================= */

  const createService = async (service) => {
    await addDoc(collection(db, "services"), {
      ...service,
      createdAt: new Date(),
    });
  };

  const updateService = async (service) => {
    await updateDoc(doc(db, "services", service.id), service);
  };

  const deleteService = async (id) => {
    await deleteDoc(doc(db, "services", id));
  };

  /* ================= STAFF MANAGEMENT (ADMIN ONLY) ================= */

  const signupStaff = async ({ username, email, role }) => {
    await addDoc(collection(db, "users"), {
      username,
      email,
      role,
      createdAt: new Date(),
    });
  };

  const deleteStaff = async (staffId) => {
    await deleteDoc(doc(db, "users", staffId));
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
      forwarded: staffApplications.filter((a) => a.status === "forwarded")
        .length,
      rejected: staffApplications.filter((a) => a.status === "rejected").length,
    }),
    [staffApplications]
  );

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
