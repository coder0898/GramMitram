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

const AdminPanelContext = createContext();
export const useAdmin = () => useContext(AdminPanelContext);

export const AdminPanelProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= ADMIN GUARD ================= */
  const isAdmin = currentUser?.role === "admin";

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        const [appsSnap, servicesSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, "applications")),
          getDocs(collection(db, "services")),
          getDocs(collection(db, "users")),
        ]);

        setApplications(appsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        setServices(servicesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        const users = usersSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setStaffList(users.filter((u) => u.role === "staff"));
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  /* ================= APPLICATION ACTIONS ================= */
  const updateApplication = async (id, data) => {
    await updateDoc(doc(db, "applications", id), data);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  };

  const assignStaff = (appId, staffName) =>
    updateApplication(appId, {
      staff: staffName,
      status: "under_review",
    });

  const filterApplications = (category, status) =>
    applications.filter(
      (app) =>
        (!category || app.service === category) &&
        (!status || app.status === status)
    );

  /* ================= STAFF ================= */
  const signupStaff = async ({ username, email, role, password }) => {
    try {
      const newStaffRef = await addDoc(collection(db, "users"), {
        username,
        email,
        role,
        password, // consider hashing in production
        createdAt: new Date(),
      });

      const newStaff = { id: newStaffRef.id, username, email, role };
      setStaffList((prev) => [...prev, newStaff]);

      return { success: true, message: "Staff signed up successfully!" };
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, message: "Failed to signup staff." };
    }
  };
  // const deleteStaff = async (uid) => {
  //   await deleteDoc(doc(db, "users", uid));
  //   setStaffList((prev) => prev.filter((s) => s.id !== uid));
  // };

  const deleteStaff = async (staffId) => {
    try {
      await deleteDoc(doc(db, "users", staffId)); // use Firestore doc ID
      setStaffList((prev) => prev.filter((s) => s.id !== staffId));

      return { success: true, message: "Staff deleted successfully" };
    } catch (err) {
      console.error("Delete staff error:", err);
      return { success: false, message: "Failed to delete staff" };
    }
  };

  /* ================= SERVICES ================= */
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

  /* ================= DASHBOARD ================= */
  const dashboardStats = useMemo(
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

  if (!isAdmin || loading) return null;

  return (
    <AdminPanelContext.Provider
      value={{
        applications,
        services,
        staffList,
        selectedApplication,
        setSelectedApplication,
        assignStaff,
        signupStaff,
        filterApplications,
        createService,
        updateService,
        deleteService,
        deleteStaff,
        dashboardStats,
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  );
};
