// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useMemo,
// } from "react";
// import { useAdmin } from "./AdminContext";

// export const UserContext = createContext();
// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const { services: adminServices } = useAdmin();
//   const [applications, setApplications] = useState([]);
//   const [services, setServices] = useState([]);
//   const [selectedServiceForApply, setSelectedServiceForApply] = useState(null);

//   const clearSelectedServiceForApply = () => {
//     setSelectedServiceForApply(null);
//   };

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("applications")) || [];
//     setApplications(stored);
//   }, []);

//   useEffect(() => {
//     setServices(adminServices.filter((s) => s.service_status));
//   }, [adminServices]);

//   const applyForService = (data) => {
//     const newApp = {
//       ...data,
//       id: `APP${Date.now()}`,
//       status: "submitted",
//       submittedAt: new Date().toLocaleString(),
//     };
//     const updated = [newApp, ...applications];
//     setApplications(updated);
//     localStorage.setItem("applications", JSON.stringify(updated));
//   };

//   const getDashboardStats = useMemo(() => {
//     const total = applications.length;
//     const submitted = applications.filter(
//       (a) => a.status === "submitted"
//     ).length;
//     const underReview = applications.filter(
//       (a) => a.status === "under_review"
//     ).length;
//     const approved = applications.filter((a) => a.status === "approved").length;
//     const rejected = applications.filter((a) => a.status === "rejected").length;

//     return { total, submitted, underReview, approved, rejected };
//   }, [applications]);

//   return (
//     <UserContext.Provider
//       value={{
//         services,
//         applications,
//         applyForService,
//         getDashboardStats,
//         selectedServiceForApply,
//         setSelectedServiceForApply,
//         clearSelectedServiceForApply,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

import React, { createContext, useContext, useMemo, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAdmin } from "./AdminContext";
import { useAuth } from "./AuthContext";

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { services, applications } = useAdmin();

  const [selectedServiceForApply, setSelectedServiceForApply] = useState(null);

  const clearSelectedServiceForApply = () => {
    setSelectedServiceForApply(null);
  };

  /* ================= USER APPLICATIONS ================= */

  const myApplications = useMemo(() => {
    if (!currentUser) return [];
    return applications.filter((app) => app.userEmail === currentUser.email);
  }, [applications, currentUser]);

  /* ================= APPLY FOR SERVICE ================= */

  const applyForService = async (data) => {
    if (!data.serviceName) {
      console.error("Missing serviceName", data);
      throw new Error("Service name is missing");
    }

    try {
      await addDoc(collection(db, "applications"), {
        ...data,
        userEmail: currentUser.email,
        status: "submitted",
        staff: null,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Failed to apply for service:", err);
      throw err;
    }
  };

  /* ================= DASHBOARD STATS ================= */

  const getDashboardStats = useMemo(() => {
    const total = myApplications.length;
    const submitted = myApplications.filter(
      (a) => a.status === "submitted"
    ).length;
    const underReview = myApplications.filter(
      (a) => a.status === "under_review"
    ).length;
    const approved = myApplications.filter(
      (a) => a.status === "approved"
    ).length;
    const rejected = myApplications.filter(
      (a) => a.status === "rejected"
    ).length;

    return { total, submitted, underReview, approved, rejected };
  }, [myApplications]);

  return (
    <UserContext.Provider
      value={{
        services: services.filter((s) => s.service_status),
        applications: myApplications,
        applyForService,
        getDashboardStats,
        selectedServiceForApply,
        setSelectedServiceForApply,
        clearSelectedServiceForApply,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
