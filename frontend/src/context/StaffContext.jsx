// // import React, { createContext, useContext, useMemo, useState } from "react";
// // import { useAdmin } from "./AdminContext";

// // const StaffContext = createContext();
// // export const useStaff = () => useContext(StaffContext);

// // export const StaffProvider = ({ children }) => {
// //   const { applications = [], services = [] } = useAdmin();
// //   const loggedInStaff = JSON.parse(localStorage.getItem("loggedInUser"));
// //   const staffName = loggedInStaff?.username;

// //   const [selectedApplication, setSelectedApplication] = useState(null);
// //   const [serviceFilter, setServiceFilter] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("");
// //   const [selectedService, setSelectedService] = useState(null);
// //   const [viewOpen, setViewOpen] = useState(false);
// //   const [order, setOrder] = useState("asc");
// //   const [orderBy, setOrderBy] = useState("service_name");
// //   const [alert, setAlert] = useState({
// //     open: false,
// //     message: "",
// //     severity: "success",
// //   });

// //   const staffApplications = useMemo(
// //     () => applications.filter((app) => app.staff === staffName),
// //     [applications, staffName]
// //   );
// //   const filteredApplications = useMemo(
// //     () =>
// //       staffApplications.filter(
// //         (app) =>
// //           (!serviceFilter || app.service === serviceFilter) &&
// //           (!statusFilter || app.status === statusFilter)
// //       ),
// //     [staffApplications, serviceFilter, statusFilter]
// //   );

// //   const updateApplicationStatus = (nextStatus, remark) => {
// //     if (!selectedApplication) return;
// //     const updated = applications.map((app) =>
// //       app.id === selectedApplication.id
// //         ? {
// //             ...app,
// //             status: nextStatus,
// //             remarksHistory: [
// //               ...(app.remarksHistory || []),
// //               { remark, status: nextStatus, date: new Date().toLocaleString() },
// //             ],
// //           }
// //         : app
// //     );
// //     localStorage.setItem("applications", JSON.stringify(updated));
// //     setSelectedApplication(null);
// //     setAlert({
// //       open: true,
// //       message: "Application status updated",
// //       severity: "success",
// //     });
// //   };

// //   const stats = useMemo(
// //     () => ({
// //       totalAssigned: staffApplications.length,
// //       underReview: staffApplications.filter((a) => a.status === "under_review")
// //         .length,
// //       forwardedToOfficer: staffApplications.filter(
// //         (a) => a.status === "forwarded"
// //       ).length,
// //       rejected: staffApplications.filter((a) => a.status === "rejected").length,
// //     }),
// //     [staffApplications]
// //   );

// //   const chartData = useMemo(
// //     () => [
// //       { name: "Under Review", value: stats.underReview },
// //       { name: "Forwarded", value: stats.forwardedToOfficer },
// //       { name: "Rejected", value: stats.rejected },
// //     ],
// //     [stats]
// //   );

// //   const sortedServices = useMemo(() => {
// //     if (!Array.isArray(services)) return [];
// //     return [...services].sort((a, b) => {
// //       if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
// //       if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
// //       return 0;
// //     });
// //   }, [services, order, orderBy]);

// //   const handleServiceSort = (column) => {
// //     const isAsc = orderBy === column && order === "asc";
// //     setOrder(isAsc ? "desc" : "asc");
// //     setOrderBy(column);
// //   };

// //   const handleViewService = (service) => {
// //     setSelectedService(service);
// //     setViewOpen(true);
// //   };

// //   return (
// //     <StaffContext.Provider
// //       value={{
// //         filteredApplications,
// //         selectedApplication,
// //         setSelectedApplication,
// //         serviceFilter,
// //         setServiceFilter,
// //         statusFilter,
// //         setStatusFilter,
// //         updateApplicationStatus,
// //         stats,
// //         chartData,
// //         sortedServices,
// //         order,
// //         orderBy,
// //         handleServiceSort,
// //         selectedService,
// //         setSelectedService,
// //         viewOpen,
// //         setViewOpen,
// //         handleViewService,
// //         alert,
// //         setAlert,
// //       }}
// //     >
// //       {children}
// //     </StaffContext.Provider>
// //   );
// // };

// import React, { createContext, useContext, useMemo, useState } from "react";
// import { doc, updateDoc } from "firebase/firestore";

// import { useAdmin } from "./AdminContext";
// import { useAuth } from "./AuthContext";
// import { db } from "../firebase/firebase";

// const StaffContext = createContext();
// export const useStaff = () => useContext(StaffContext);

// export const StaffProvider = ({ children }) => {
//   const { applications = [], services = [] } = useAdmin();
//   const { currentUser } = useAuth();

//   /* ================= STAFF INFO ================= */
//   const staffName = currentUser?.email; // or username if you store it
//   const staffRole = currentUser?.role;

//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [serviceFilter, setServiceFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedService, setSelectedService] = useState(null);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [order, setOrder] = useState("asc");
//   const [orderBy, setOrderBy] = useState("service_name");
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   /* ================= STAFF APPLICATIONS ================= */
//   const staffApplications = useMemo(
//     () =>
//       applications.filter(
//         (app) => app.staff === staffName && staffRole === "staff"
//       ),
//     [applications, staffName, staffRole]
//   );

//   const filteredApplications = useMemo(
//     () =>
//       staffApplications.filter(
//         (app) =>
//           (!serviceFilter || app.service === serviceFilter) &&
//           (!statusFilter || app.status === statusFilter)
//       ),
//     [staffApplications, serviceFilter, statusFilter]
//   );

//   /* ================= UPDATE STATUS ================= */
//   const updateApplicationStatus = async (nextStatus, remark) => {
//     if (!selectedApplication || staffRole !== "staff") return;

//     try {
//       const appRef = doc(db, "applications", selectedApplication.id);

//       const newRemark = {
//         remark,
//         status: nextStatus,
//         date: new Date().toISOString(),
//         by: staffName,
//       };

//       await updateDoc(appRef, {
//         status: nextStatus,
//         remarksHistory: [
//           ...(selectedApplication.remarksHistory || []),
//           newRemark,
//         ],
//       });

//       setSelectedApplication(null);
//       setAlert({
//         open: true,
//         message: "Application status updated successfully",
//         severity: "success",
//       });
//     } catch (error) {
//       console.error("Status update failed:", error);
//       setAlert({
//         open: true,
//         message: "Failed to update application",
//         severity: "error",
//       });
//     }
//   };

//   /* ================= STATS ================= */
//   const stats = useMemo(
//     () => ({
//       totalAssigned: staffApplications.length,
//       underReview: staffApplications.filter((a) => a.status === "under_review")
//         .length,
//       forwardedToOfficer: staffApplications.filter(
//         (a) => a.status === "forwarded"
//       ).length,
//       rejected: staffApplications.filter((a) => a.status === "rejected").length,
//     }),
//     [staffApplications]
//   );

//   const chartData = useMemo(
//     () => [
//       { name: "Under Review", value: stats.underReview },
//       { name: "Forwarded", value: stats.forwardedToOfficer },
//       { name: "Rejected", value: stats.rejected },
//     ],
//     [stats]
//   );

//   /* ================= SERVICES ================= */
//   const sortedServices = useMemo(() => {
//     if (!Array.isArray(services)) return [];
//     return [...services].sort((a, b) => {
//       if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
//       if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [services, order, orderBy]);

//   const handleServiceSort = (column) => {
//     const isAsc = orderBy === column && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(column);
//   };

//   const handleViewService = (service) => {
//     setSelectedService(service);
//     setViewOpen(true);
//   };

//   /* ================= GUARD ================= */
//   if (staffRole !== "staff") return null;

//   return (
//     <StaffContext.Provider
//       value={{
//         filteredApplications,
//         selectedApplication,
//         setSelectedApplication,
//         serviceFilter,
//         setServiceFilter,
//         statusFilter,
//         setStatusFilter,
//         updateApplicationStatus,
//         stats,
//         chartData,
//         sortedServices,
//         order,
//         orderBy,
//         handleServiceSort,
//         selectedService,
//         setSelectedService,
//         viewOpen,
//         setViewOpen,
//         handleViewService,
//         alert,
//         setAlert,
//       }}
//     >
//       {children}
//     </StaffContext.Provider>
//   );
// };

import React, { createContext, useContext, useMemo, useState } from "react";
import { useAdmin } from "./AdminContext";
import { useAuth } from "./AuthContext";

export const StaffContext = createContext();
export const useStaff = () => useContext(StaffContext);

export const StaffProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { applications } = useAdmin();

  const [selectedApplication, setSelectedApplication] = useState(null);

  const staffApplications = useMemo(
    () => applications.filter((app) => app.staff === currentUser?.email),
    [applications, currentUser]
  );

  const updateApplicationStatus = (id, status) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status } : app
    );
    localStorage.setItem("applications", JSON.stringify(updated));
  };

  return (
    <StaffContext.Provider
      value={{
        staffApplications,
        selectedApplication,
        setSelectedApplication,
        updateApplicationStatus,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};
