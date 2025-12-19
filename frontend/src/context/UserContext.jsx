// // // import React, { createContext, useContext, useReducer } from "react";

// // // const UserContext = createContext();
// // // export const useUser = () => useContext(UserContext);

// // // /* ------------------ INITIAL STATE ------------------ */
// // // const initialState = {
// // //   user: {
// // //     id: "USER001",
// // //     name: "Ramesh Kumar",
// // //     mobile: "9876543210",
// // //     address: "Gram Panchayat Village",
// // //     role: "Citizen",
// // //   },

// // //   services: [
// // //     {
// // //       id: "S001",
// // //       name: "Birth Certificate",
// // //       description: "Apply for birth certificate",
// // //       category: "Certificates",
// // //       requiredDocuments: ["Hospital Certificate", "Aadhaar"],
// // //       status: "Active",
// // //     },
// // //     {
// // //       id: "S002",
// // //       name: "Income Certificate",
// // //       description: "Apply for income certificate",
// // //       category: "Certificates",
// // //       requiredDocuments: ["Aadhaar", "Ration Card"],
// // //       status: "Active",
// // //     },
// // //   ],

// // //   applications: [],

// // //   selectedServiceForApply: null,
// // // };

// // // /* ------------------ REDUCER ------------------ */
// // // const reducer = (state, action) => {
// // //   switch (action.type) {
// // //     case "SET_SELECTED_SERVICE":
// // //       return { ...state, selectedServiceForApply: action.payload };

// // //     case "CLEAR_SELECTED_SERVICE":
// // //       return { ...state, selectedServiceForApply: null };

// // //     case "APPLY_SERVICE":
// // //       return {
// // //         ...state,
// // //         applications: [
// // //           {
// // //             id: `APP${state.applications.length + 1}`,
// // //             status: "Submitted",
// // //             submittedAt: new Date().toLocaleDateString(),
// // //             statusHistory: [
// // //               {
// // //                 status: "Submitted",
// // //                 date: new Date().toLocaleDateString(),
// // //                 remarks: "Application submitted by user",
// // //               },
// // //             ],
// // //             ...action.payload,
// // //           },
// // //           ...state.applications,
// // //         ],
// // //       };

// // //     default:
// // //       return state;
// // //   }
// // // };

// // // /* ------------------ PROVIDER ------------------ */
// // // const UserProvider = ({ children }) => {
// // //   const [state, dispatch] = useReducer(reducer, initialState);

// // //   const setSelectedServiceForApply = (service) =>
// // //     dispatch({ type: "SET_SELECTED_SERVICE", payload: service });

// // //   const clearSelectedServiceForApply = () =>
// // //     dispatch({ type: "CLEAR_SELECTED_SERVICE" });

// // //   const applyForService = (data) =>
// // //     dispatch({ type: "APPLY_SERVICE", payload: data });

// // //   const getDashboardStats = () => ({
// // //     total: state.applications.length,
// // //     submitted: state.applications.filter((a) => a.status === "Submitted")
// // //       .length,
// // //     underReview: state.applications.filter((a) => a.status === "Under Review")
// // //       .length,
// // //     approved: state.applications.filter((a) => a.status === "Approved").length,
// // //     rejected: state.applications.filter((a) => a.status === "Rejected").length,
// // //   });

// // //   return (
// // //     <UserContext.Provider
// // //       value={{
// // //         user: state.user,
// // //         services: state.services,
// // //         applications: state.applications,

// // //         selectedServiceForApply: state.selectedServiceForApply,
// // //         setSelectedServiceForApply,
// // //         clearSelectedServiceForApply,

// // //         applyForService,
// // //         getDashboardStats,
// // //       }}
// // //     >
// // //       {children}
// // //     </UserContext.Provider>
// // //   );
// // // };

// // // export default UserProvider;

// // // UserContext.js
// // // import React, { createContext, useContext } from "react";

// // // const UserContext = createContext();
// // // export const useUser = () => useContext(UserContext);

// // // export const UserProvider = ({ children }) => {
// // //   const applyForService = (payload) => {
// // //     const apps = JSON.parse(localStorage.getItem("applications")) || [];
// // //     apps.push({
// // //       id: `APP${Date.now()}`,
// // //       status: "submitted",
// // //       submittedDate: new Date().toLocaleDateString(),
// // //       ...payload,
// // //     });
// // //     localStorage.setItem("applications", JSON.stringify(apps));
// // //   };

// // //   return (
// // //     <UserContext.Provider value={{ applyForService }}>
// // //       {children}
// // //     </UserContext.Provider>
// // //   );
// // // };

// // // UserContext.jsx
// // import React, { createContext, useContext } from "react";

// // const UserContext = createContext();
// // export const useUser = () => useContext(UserContext);

// // const UserProvider = ({ children }) => {
// //   const applyForService = (payload) => {
// //     const applications = JSON.parse(localStorage.getItem("applications")) || [];

// //     applications.push({
// //       id: `APP${Date.now()}`,
// //       status: "submitted",
// //       submittedDate: new Date().toLocaleDateString(),
// //       disableView: false,
// //       remarks: "",
// //       ...payload,
// //     });

// //     localStorage.setItem("applications", JSON.stringify(applications));
// //   };

// //   return (
// //     <UserContext.Provider
// //       value={{
// //         applyForService,
// //       }}
// //     >
// //       {children}
// //     </UserContext.Provider>
// //   );
// // };

// // export default UserProvider;

// import React, { createContext, useContext, useState, useMemo } from "react";
// import { useAdmin } from "./AdminContext";

// const UserContext = createContext();
// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const { applications: adminApplications, services } = useAdmin();
//   const [userApplications, setUserApplications] = useState(
//     adminApplications || []
//   );
//   const [selectedServiceForApply, setSelectedServiceForApply] = useState(null);

//   const applyForService = (data) => {
//     const newApp = {
//       id: `APP${userApplications.length + 1}`,
//       status: "submitted",
//       submittedAt: new Date().toLocaleString(),
//       ...data,
//     };
//     const updatedApps = [newApp, ...userApplications];
//     setUserApplications(updatedApps);
//     localStorage.setItem("applications", JSON.stringify(updatedApps));
//   };

//   const clearSelectedServiceForApply = () => setSelectedServiceForApply(null);

//   // const getDashboardStats = useMemo(
//   //   () => ({
//   //     total: userApplications.length,
//   //     submitted: userApplications.filter((a) => a.status === "submitted")
//   //       .length,
//   //     underReview: userApplications.filter((a) => a.status === "under_review")
//   //       .length,
//   //     approved: userApplications.filter((a) => a.status === "approved").length,
//   //     rejected: userApplications.filter((a) => a.status === "rejected").length,
//   //   }),
//   //   [userApplications]
//   // );
//   const getDashboardStats = () => ({
//     total: userApplications.length,
//     submitted: userApplications.filter((a) => a.status === "submitted").length,
//     underReview: userApplications.filter((a) => a.status === "under_review")
//       .length,
//     approved: userApplications.filter((a) => a.status === "approved").length,
//     rejected: userApplications.filter((a) => a.status === "rejected").length,
//   });

//   return (
//     <UserContext.Provider
//       value={{
//         services,
//         applications: userApplications,
//         selectedServiceForApply,
//         setSelectedServiceForApply,
//         clearSelectedServiceForApply, // ✅ FIXED

//         applyForService,
//         getDashboardStats,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useAdmin } from "./AdminContext";

// const UserContext = createContext();
// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   // const { applications: adminApplications = [], services } = useAdmin();
//   const { applications: adminApplications = [], services } = useAdmin();
//   const activeServices = services.filter((s) => s.service_status === "Active");
//   const [userApplications, setUserApplications] = useState([]);

//   const [selectedServiceForApply, setSelectedServiceForApply] = useState(null);

//   // Sync userApplications with Admin applications whenever they change
//   useEffect(() => {
//     setUserApplications(adminApplications);
//   }, [adminApplications]);

//   const applyForService = (data) => {
//     const newApp = {
//       id: `APP${userApplications.length + 1}`,
//       status: "submitted",
//       submittedAt: new Date().toLocaleString(),
//       ...data,
//     };
//     const updatedApps = [newApp, ...userApplications];
//     setUserApplications(updatedApps);
//     localStorage.setItem("applications", JSON.stringify(updatedApps));
//   };

//   const clearSelectedServiceForApply = () => setSelectedServiceForApply(null);

//   const getDashboardStats = () => ({
//     total: userApplications.length,
//     submitted: userApplications.filter((a) => a.status === "submitted").length,
//     underReview: userApplications.filter((a) => a.status === "under_review")
//       .length,
//     approved: userApplications.filter((a) => a.status === "approved").length,
//     rejected: userApplications.filter((a) => a.status === "rejected").length,
//   });

//   return (
//     <UserContext.Provider
//       value={{
//         // services, // now always up-to-date with Admin
//         // applications: userApplications,
//         services: activeServices,
//         applications: userApplications,
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

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAdmin } from "./AdminContext";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { applications: adminApplications = [], services: adminServices = [] } =
    useAdmin();

  // Only show active services
  const [services, setServices] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [selectedServiceForApply, setSelectedServiceForApply] = useState(null);

  // Sync services and applications with AdminContext
  useEffect(() => {
    setServices(adminServices.filter((s) => s.service_status === true));
  }, [adminServices]);

  useEffect(() => {
    setUserApplications(adminApplications);
  }, [adminApplications]);

  const applyForService = (data) => {
    const newApp = {
      id: `APP${userApplications.length + 1}`,
      status: "submitted",
      submittedAt: new Date().toLocaleString(),
      ...data,
    };
    const updatedApps = [newApp, ...userApplications];
    setUserApplications(updatedApps);
    localStorage.setItem("applications", JSON.stringify(updatedApps));
  };

  const clearSelectedServiceForApply = () => setSelectedServiceForApply(null);

  const getDashboardStats = () => ({
    total: userApplications.length,
    submitted: userApplications.filter((a) => a.status === "submitted").length,
    underReview: userApplications.filter((a) => a.status === "under_review")
      .length,
    approved: userApplications.filter((a) => a.status === "approved").length,
    rejected: userApplications.filter((a) => a.status === "rejected").length,
  });

  return (
    <UserContext.Provider
      value={{
        services,
        applications: userApplications,
        selectedServiceForApply,
        setSelectedServiceForApply,
        clearSelectedServiceForApply,
        applyForService,
        getDashboardStats,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
