// // import React, { createContext, useContext, useState, useEffect } from "react";
// // import { useAdmin } from "./AdminContext";

// // const UserContext = createContext();
// // export const useUser = () => useContext(UserContext);

// // export const UserProvider = ({ children }) => {
// //   const { services: adminServices = [] } = useAdmin();

// //   const [services, setServices] = useState([]);
// //   const [applications, setApplications] = useState([]);
// //   const [selectedServiceForApply, setSelectedServiceForApply] = useState(null);

// //   /* -------- Load applications ONCE from localStorage -------- */
// //   useEffect(() => {
// //     const stored = JSON.parse(localStorage.getItem("applications")) || [];
// //     setApplications(stored);
// //   }, []);

// //   /* -------- Sync only SERVICES from Admin -------- */
// //   useEffect(() => {
// //     setServices(adminServices.filter((s) => s.service_status === true));
// //   }, [adminServices]);

// //   /* -------- Apply for Service -------- */
// //   const applyForService = (data) => {
// //     const formattedDocuments = Object.entries(data.documents || {}).map(
// //       ([docName, file]) => ({
// //         documentName: docName,
// //         fileName: file.name,
// //         fileType: file.type,
// //         fileSize: file.size,
// //       })
// //     );

// //     const newApplication = {
// //       id: `APP${Date.now()}`,
// //       serviceId: data.serviceId,
// //       serviceName: data.serviceName, // ✅ SINGLE SOURCE OF TRUTH
// //       applicant: data.applicant,
// //       documents: formattedDocuments,
// //       status: "Submitted",
// //       submittedAt: new Date().toLocaleString(),
// //     };

// //     const updated = [newApplication, ...applications];
// //     setApplications(updated);
// //     localStorage.setItem("applications", JSON.stringify(updated));
// //   };

// //   const clearSelectedServiceForApply = () => setSelectedServiceForApply(null);

// //   const getDashboardStats = () => ({
// //     total: applications.length,
// //     submitted: applications.filter((a) => a.status === "Submitted").length,
// //     approved: applications.filter((a) => a.status === "Approved").length,
// //     rejected: applications.filter((a) => a.status === "Rejected").length,
// //   });

// //   return (
// //     <UserContext.Provider
// //       value={{
// //         services,
// //         applications,
// //         selectedServiceForApply,
// //         setSelectedServiceForApply,
// //         clearSelectedServiceForApply,
// //         applyForService,
// //         getDashboardStats,
// //       }}
// //     >
// //       {children}
// //     </UserContext.Provider>
// //   );
// // };

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useMemo,
// } from "react";
// import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// import { db } from "../firebase/firebase";
// import { useAdmin } from "./AdminContext";
// import { useAuth } from "./AuthContext";

// const UserContext = createContext();
// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const { services: adminServices = [] } = useAdmin();
//   const { currentUser } = useAuth();

//   const [services, setServices] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [selectedServiceForApply, setSelectedServiceForApply] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= ACTIVE SERVICES ================= */
//   useEffect(() => {
//     setServices(adminServices.filter((s) => s.service_status === true));
//   }, [adminServices]);

//   /* ================= LOAD USER APPLICATIONS ================= */
//   useEffect(() => {
//     if (!currentUser?.uid) return;

//     const loadApplications = async () => {
//       try {
//         const q = query(
//           collection(db, "applications"),
//           where("userId", "==", currentUser.uid)
//         );

//         const snap = await getDocs(q);
//         setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//       } catch (err) {
//         console.error("Failed to load user applications:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadApplications();
//   }, [currentUser]);

//   /* ================= APPLY FOR SERVICE ================= */
//   const applyForService = async (data) => {
//     if (!currentUser) return;

//     const formattedDocuments = Object.entries(data.documents || {}).map(
//       ([docName, file]) => ({
//         documentName: docName,
//         fileName: file.name,
//         fileType: file.type,
//         fileSize: file.size,
//       })
//     );

//     const newApplication = {
//       userId: currentUser.uid,
//       applicant: data.applicant,
//       serviceId: data.serviceId,
//       serviceName: data.serviceName,
//       documents: formattedDocuments,
//       status: "submitted",
//       submittedAt: new Date().toISOString(),
//       staff: null,
//       remarksHistory: [],
//     };

//     try {
//       const ref = await addDoc(collection(db, "applications"), newApplication);

//       setApplications((prev) => [{ id: ref.id, ...newApplication }, ...prev]);
//     } catch (error) {
//       console.error("Application failed:", error);
//     }
//   };

//   const clearSelectedServiceForApply = () => setSelectedServiceForApply(null);

//   /* ================= DASHBOARD STATS ================= */
//   const getDashboardStats = useMemo(
//     () => ({
//       total: applications.length,
//       submitted: applications.filter((a) => a.status === "submitted").length,
//       underReview: applications.filter((a) => a.status === "under_review")
//         .length,
//       approved: applications.filter((a) => a.status === "approved").length,
//       rejected: applications.filter((a) => a.status === "rejected").length,
//     }),
//     [applications]
//   );

//   if (!currentUser || loading) return null;

//   return (
//     <UserContext.Provider
//       value={{
//         services,
//         applications,
//         selectedServiceForApply,
//         setSelectedServiceForApply,
//         clearSelectedServiceForApply,
//         applyForService,
//         getDashboardStats,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAdmin } from "./AdminContext";

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { services: adminServices } = useAdmin();
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(stored);
  }, []);

  useEffect(() => {
    setServices(adminServices.filter((s) => s.service_status));
  }, [adminServices]);

  const applyForService = (data) => {
    const newApp = {
      ...data,
      id: `APP${Date.now()}`,
      status: "submitted",
      submittedAt: new Date().toLocaleString(),
    };
    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem("applications", JSON.stringify(updated));
  };

  return (
    <UserContext.Provider value={{ services, applications, applyForService }}>
      {children}
    </UserContext.Provider>
  );
};
