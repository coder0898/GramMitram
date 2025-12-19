// // // // import React, {
// // // //   createContext,
// // // //   useContext,
// // // //   useEffect,
// // // //   useMemo,
// // // //   useState,
// // // // } from "react";

// // // // const StaffContext = createContext();
// // // // export const useStaff = () => useContext(StaffContext);

// // // // export const StaffProvider = ({ children }) => {
// // // //   const loggedInStaff = JSON.parse(localStorage.getItem("loggedInUser"));
// // // //   const staffName = loggedInStaff?.username;

// // // //   /* ================= APPLICATIONS ================= */
// // // //   const [applications, setApplications] = useState([]);
// // // //   const [selectedApplication, setSelectedApplication] = useState(null);

// // // //   const [serviceFilter, setServiceFilter] = useState("");
// // // //   const [statusFilter, setStatusFilter] = useState("");

// // // //   /* ================= LOAD FROM ADMIN DATA ================= */
// // // //   useEffect(() => {
// // // //     const stored = JSON.parse(localStorage.getItem("applications")) || [];
// // // //     setApplications(stored);
// // // //   }, []);

// // // //   /* ================= STAFF-SPECIFIC APPS ================= */
// // // //   const staffApplications = useMemo(() => {
// // // //     return applications.filter((app) => app.staff === staffName);
// // // //   }, [applications, staffName]);

// // // //   const filteredApplications = useMemo(() => {
// // // //     return staffApplications.filter(
// // // //       (app) =>
// // // //         (serviceFilter ? app.service === serviceFilter : true) &&
// // // //         (statusFilter ? app.status === statusFilter : true)
// // // //     );
// // // //   }, [staffApplications, serviceFilter, statusFilter]);

// // // //   /* ================= STATUS UPDATE ================= */
// // // //   const updateApplicationStatus = (nextStatus, remark) => {
// // // //     const updated = applications.map((app) =>
// // // //       app.id === selectedApplication.id
// // // //         ? {
// // // //             ...app,
// // // //             status: nextStatus,
// // // //             remarksHistory: [
// // // //               ...(app.remarksHistory || []),
// // // //               {
// // // //                 remark,
// // // //                 status: nextStatus,
// // // //                 date: new Date().toLocaleString(),
// // // //               },
// // // //             ],
// // // //           }
// // // //         : app
// // // //     );

// // // //     setApplications(updated);
// // // //     localStorage.setItem("applications", JSON.stringify(updated));
// // // //     setSelectedApplication(null);
// // // //   };

// // // //   /* ================= DASHBOARD ================= */
// // // //   const stats = useMemo(() => {
// // // //     return {
// // // //       totalAssigned: staffApplications.length,
// // // //       underReview: staffApplications.filter((a) => a.status === "under_review")
// // // //         .length,
// // // //       forwardedToOfficer: staffApplications.filter(
// // // //         (a) => a.status === "forwarded"
// // // //       ).length,
// // // //       rejected: staffApplications.filter((a) => a.status === "rejected").length,
// // // //     };
// // // //   }, [staffApplications]);

// // // //   const chartData = useMemo(
// // // //     () => [
// // // //       { name: "Under Review", value: stats.underReview },
// // // //       { name: "Forwarded", value: stats.forwardedToOfficer },
// // // //       { name: "Rejected", value: stats.rejected },
// // // //     ],
// // // //     [stats]
// // // //   );

// // // //   /* ================= SERVICES ================= */
// // // //   const [servicesList, setServicesList] = useState([]);
// // // //   const [selectedService, setSelectedService] = useState(null);
// // // //   const [order, setOrder] = useState("asc");
// // // //   const [orderBy, setOrderBy] = useState("service_name");

// // // //   useEffect(() => {
// // // //     const stored = JSON.parse(localStorage.getItem("Services")) || [];
// // // //     setServicesList(stored);
// // // //   }, []);

// // // //   const sortedServices = useMemo(() => {
// // // //     return [...servicesList].sort((a, b) => {
// // // //       if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
// // // //       if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
// // // //       return 0;
// // // //     });
// // // //   }, [servicesList, order, orderBy]);

// // // //   const handleServiceSort = (column) => {
// // // //     const isAsc = orderBy === column && order === "asc";
// // // //     setOrder(isAsc ? "desc" : "asc");
// // // //     setOrderBy(column);
// // // //   };

// // // //   /* ================= SERVICE UI STATE ================= */
// // // //   const [viewOpen, setViewOpen] = useState(false);
// // // //   const [alert, setAlert] = useState({
// // // //     open: false,
// // // //     message: "",
// // // //     severity: "success",
// // // //   });

// // // //   const handleViewService = (service) => {
// // // //     setSelectedService(service);
// // // //     setViewOpen(true);
// // // //   };

// // // //   return (
// // // //     <StaffContext.Provider
// // // //       value={{
// // // //         /* Applications */
// // // //         filteredApplications,
// // // //         selectedApplication,
// // // //         setSelectedApplication,
// // // //         serviceFilter,
// // // //         setServiceFilter,
// // // //         statusFilter,
// // // //         setStatusFilter,
// // // //         updateApplicationStatus,

// // // //         /* Dashboard */
// // // //         stats,
// // // //         chartData,

// // // //         /* Services */
// // // //         sortedServices,
// // // //         selectedService,
// // // //         setSelectedService,
// // // //         handleServiceSort,
// // // //         order,
// // // //         orderBy,
// // // //         /* Service UI */
// // // //         viewOpen,
// // // //         setViewOpen,
// // // //         alert,
// // // //         setAlert,
// // // //         handleViewService,
// // // //       }}
// // // //     >
// // // //       {children}
// // // //     </StaffContext.Provider>
// // // //   );
// // // // };

// // // // StaffContext.js
// // // // import React, {
// // // //   createContext,
// // // //   useContext,
// // // //   useEffect,
// // // //   useMemo,
// // // //   useState,
// // // // } from "react";

// // // // const StaffContext = createContext();
// // // // export const useStaff = () => useContext(StaffContext);

// // // // export const StaffProvider = ({ children }) => {
// // // //   const staff = JSON.parse(localStorage.getItem("loggedInUser"));
// // // //   const staffName = staff?.username;

// // // //   const [applications, setApplications] = useState([]);

// // // //   useEffect(() => {
// // // //     setApplications(JSON.parse(localStorage.getItem("applications")) || []);
// // // //   }, []);

// // // //   const staffApplications = useMemo(
// // // //     () => applications.filter((a) => a.staff === staffName),
// // // //     [applications, staffName]
// // // //   );

// // // //   const updateApplicationStatus = (id, status, remark) => {
// // // //     const updated = applications.map((a) =>
// // // //       a.id === id ? { ...a, status, remarks: remark } : a
// // // //     );
// // // //     setApplications(updated);
// // // //     localStorage.setItem("applications", JSON.stringify(updated));
// // // //   };

// // // //   return (
// // // //     <StaffContext.Provider
// // // //       value={{
// // // //         staffApplications,
// // // //         updateApplicationStatus,
// // // //       }}
// // // //     >
// // // //       {children}
// // // //     </StaffContext.Provider>
// // // //   );
// // // // };

// // // import React, { createContext, useContext, useMemo, useState } from "react";
// // // import { useAdmin } from "./AdminContext";

// // // const StaffContext = createContext();
// // // export const useStaff = () => useContext(StaffContext);

// // // export const StaffProvider = ({ children }) => {
// // //   const {
// // //     applications,
// // //     updateApplication,
// // //     services,
// // //     dashboardStats: adminDashboardStats,
// // //   } = useAdmin();

// // //   const loggedInStaff = JSON.parse(localStorage.getItem("loggedInUser"));
// // //   const staffName = loggedInStaff?.username;

// // //   /* ================= APPLICATION FILTERS ================= */
// // //   const [selectedApplication, setSelectedApplication] = useState(null);
// // //   const [serviceFilter, setServiceFilter] = useState("");
// // //   const [statusFilter, setStatusFilter] = useState("");

// // //   /* ================= STAFF-SPECIFIC APPLICATIONS ================= */
// // //   const staffApplications = useMemo(
// // //     () => applications.filter((app) => app.staff === staffName),
// // //     [applications, staffName]
// // //   );

// // //   const filteredApplications = useMemo(
// // //     () =>
// // //       staffApplications.filter(
// // //         (app) =>
// // //           (!serviceFilter || app.service === serviceFilter) &&
// // //           (!statusFilter || app.status === statusFilter)
// // //       ),
// // //     [staffApplications, serviceFilter, statusFilter]
// // //   );

// // //   /* ================= STATUS UPDATE ================= */
// // //   const updateApplicationStatus = (nextStatus, remark) => {
// // //     if (!selectedApplication) return;

// // //     const updatedApp = {
// // //       ...selectedApplication,
// // //       status: nextStatus,
// // //       remarksHistory: [
// // //         ...(selectedApplication.remarksHistory || []),
// // //         {
// // //           remark,
// // //           status: nextStatus,
// // //           date: new Date().toLocaleString(),
// // //         },
// // //       ],
// // //     };

// // //     updateApplication(selectedApplication.id, updatedApp);
// // //     setSelectedApplication(null);
// // //   };

// // //   /* ================= DASHBOARD ================= */
// // //   const stats = useMemo(() => {
// // //     return {
// // //       totalAssigned: staffApplications.length,
// // //       underReview: staffApplications.filter((a) => a.status === "under_review")
// // //         .length,
// // //       forwardedToOfficer: staffApplications.filter(
// // //         (a) => a.status === "forwarded"
// // //       ).length,
// // //       rejected: staffApplications.filter((a) => a.status === "rejected").length,
// // //     };
// // //   }, [staffApplications]);

// // //   const chartData = useMemo(
// // //     () => [
// // //       { name: "Under Review", value: stats.underReview },
// // //       { name: "Forwarded", value: stats.forwardedToOfficer },
// // //       { name: "Rejected", value: stats.rejected },
// // //     ],
// // //     [stats]
// // //   );

// // //   /* ================= SERVICES ================= */
// // //   const sortedServices = useMemo(() => {
// // //     return [...services]; // Services directly from AdminContext
// // //   }, [services]);

// // //   /* ================= SERVICE UI STATE ================= */
// // //   const [selectedService, setSelectedService] = useState(null);
// // //   const [viewOpen, setViewOpen] = useState(false);
// // //   const [alert, setAlert] = useState({
// // //     open: false,
// // //     message: "",
// // //     severity: "success",
// // //   });

// // //   const handleViewService = (service) => {
// // //     setSelectedService(service);
// // //     setViewOpen(true);
// // //   };

// // //   return (
// // //     <StaffContext.Provider
// // //       value={{
// // //         /* Applications */
// // //         filteredApplications,
// // //         selectedApplication,
// // //         setSelectedApplication,
// // //         serviceFilter,
// // //         setServiceFilter,
// // //         statusFilter,
// // //         setStatusFilter,
// // //         updateApplicationStatus,

// // //         /* Dashboard */
// // //         stats,
// // //         chartData,
// // //         adminDashboardStats, // optional for staff to see full stats

// // //         /* Services */
// // //         sortedServices,
// // //         selectedService,
// // //         setSelectedService,
// // //         viewOpen,
// // //         setViewOpen,
// // //         alert,
// // //         setAlert,
// // //         handleViewService,
// // //       }}
// // //     >
// // //       {children}
// // //     </StaffContext.Provider>
// // //   );
// // // };

// // // import React, { createContext, useContext, useMemo, useState } from "react";
// // // import { useAdmin } from "./AdminContext";

// // // const StaffContext = createContext();
// // // export const useStaff = () => useContext(StaffContext);

// // // export const StaffProvider = ({ children }) => {
// // //   const { applications, services, staffList } = useAdmin();
// // //   const loggedInStaff = JSON.parse(localStorage.getItem("loggedInUser"));
// // //   const staffName = loggedInStaff?.username;

// // //   const [selectedApplication, setSelectedApplication] = useState(null);
// // //   const [serviceFilter, setServiceFilter] = useState("");
// // //   const [statusFilter, setStatusFilter] = useState("");

// // //   // Staff-specific applications
// // //   const staffApplications = useMemo(
// // //     () => applications.filter((app) => app.staff === staffName),
// // //     [applications, staffName]
// // //   );

// // //   const filteredApplications = useMemo(() => {
// // //     return staffApplications.filter(
// // //       (app) =>
// // //         (!serviceFilter || app.service === serviceFilter) &&
// // //         (!statusFilter || app.status === statusFilter)
// // //     );
// // //   }, [staffApplications, serviceFilter, statusFilter]);

// // //   // Update application status
// // //   const updateApplicationStatus = (nextStatus, remark) => {
// // //     const updated = applications.map((app) =>
// // //       app.id === selectedApplication.id
// // //         ? {
// // //             ...app,
// // //             status: nextStatus,
// // //             remarksHistory: [
// // //               ...(app.remarksHistory || []),
// // //               { remark, status: nextStatus, date: new Date().toLocaleString() },
// // //             ],
// // //           }
// // //         : app
// // //     );
// // //     localStorage.setItem("applications", JSON.stringify(updated));
// // //     setSelectedApplication(null);
// // //   };

// // //   // Dashboard stats
// // //   const stats = useMemo(
// // //     () => ({
// // //       totalAssigned: staffApplications.length,
// // //       underReview: staffApplications.filter((a) => a.status === "under_review")
// // //         .length,
// // //       forwardedToOfficer: staffApplications.filter(
// // //         (a) => a.status === "forwarded"
// // //       ).length,
// // //       rejected: staffApplications.filter((a) => a.status === "rejected").length,
// // //     }),
// // //     [staffApplications]
// // //   );

// // //   const chartData = useMemo(
// // //     () => [
// // //       { name: "Under Review", value: stats.underReview },
// // //       { name: "Forwarded", value: stats.forwardedToOfficer },
// // //       { name: "Rejected", value: stats.rejected },
// // //     ],
// // //     [stats]
// // //   );

// // //   return (
// // //     <StaffContext.Provider
// // //       value={{
// // //         filteredApplications,
// // //         selectedApplication,
// // //         setSelectedApplication,
// // //         serviceFilter,
// // //         setServiceFilter,
// // //         statusFilter,
// // //         setStatusFilter,
// // //         updateApplicationStatus,
// // //         stats,
// // //         chartData,
// // //         services,
// // //         staffList,
// // //       }}
// // //     >
// // //       {children}
// // //     </StaffContext.Provider>
// // //   );
// // // };

// // import React, { createContext, useContext, useMemo, useState } from "react";
// // import { useAdmin } from "./AdminContext";

// // const StaffContext = createContext();
// // export const useStaff = () => useContext(StaffContext);

// // export const StaffProvider = ({ children }) => {
// //   const { applications, services, staffList } = useAdmin();
// //   const loggedInStaff = JSON.parse(localStorage.getItem("loggedInUser"));
// //   const staffName = loggedInStaff?.username;

// //   /* ================= APPLICATION SELECTION ================= */
// //   const [selectedApplication, setSelectedApplication] = useState(null);

// //   /* ================= FILTERS ================= */
// //   const [serviceFilter, setServiceFilter] = useState("");
// //   const [statusFilter, setStatusFilter] = useState("");

// //   /* ================= SERVICES VIEW ================= */
// //   const [selectedService, setSelectedService] = useState(null);
// //   const [viewOpen, setViewOpen] = useState(false);

// //   /* ================= ALERT / SNACKBAR ================= */
// //   const [alert, setAlert] = useState({
// //     open: false,
// //     message: "",
// //     severity: "success",
// //   });

// //   /* ================= STAFF-SPECIFIC APPLICATIONS ================= */
// //   const staffApplications = useMemo(
// //     () => applications.filter((app) => app.staff === staffName),
// //     [applications, staffName]
// //   );

// //   const filteredApplications = useMemo(() => {
// //     return staffApplications.filter(
// //       (app) =>
// //         (!serviceFilter || app.service === serviceFilter) &&
// //         (!statusFilter || app.status === statusFilter)
// //     );
// //   }, [staffApplications, serviceFilter, statusFilter]);

// //   /* ================= UPDATE APPLICATION STATUS ================= */
// //   const updateApplicationStatus = (nextStatus, remark) => {
// //     const updated = applications.map((app) =>
// //       app.id === selectedApplication.id
// //         ? {
// //             ...app,
// //             status: nextStatus,
// //             remarksHistory: [
// //               ...(app.remarksHistory || []),
// //               {
// //                 remark,
// //                 status: nextStatus,
// //                 date: new Date().toLocaleString(),
// //               },
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

// //   /* ================= DASHBOARD STATS ================= */
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

// //   /* ================= SERVICE HANDLERS ================= */
// //   const handleViewService = (service) => {
// //     setSelectedService(service);
// //     setViewOpen(true);
// //   };

// //   return (
// //     <StaffContext.Provider
// //       value={{
// //         /* Applications */
// //         filteredApplications,
// //         selectedApplication,
// //         setSelectedApplication,
// //         serviceFilter,
// //         setServiceFilter,
// //         statusFilter,
// //         setStatusFilter,
// //         updateApplicationStatus,

// //         /* Dashboard */
// //         stats,
// //         chartData,

// //         /* Services */
// //         services,
// //         staffList,
// //         selectedService,
// //         setSelectedService,
// //         viewOpen,
// //         setViewOpen,
// //         handleViewService,

// //         /* Alerts */
// //         alert,
// //         setAlert,
// //       }}
// //     >
// //       {children}
// //     </StaffContext.Provider>
// //   );
// // };

// import React, { createContext, useContext, useMemo, useState } from "react";
// import { useAdmin } from "./AdminContext";

// const StaffContext = createContext();
// export const useStaff = () => useContext(StaffContext);

// export const StaffProvider = ({ children }) => {
//   const { applications = [], services = [] } = useAdmin();

//   const loggedInStaff = JSON.parse(localStorage.getItem("loggedInUser"));
//   const staffName = loggedInStaff?.username;

//   /* ================= APPLICATION SELECTION ================= */
//   const [selectedApplication, setSelectedApplication] = useState(null);

//   /* ================= FILTERS ================= */
//   const [serviceFilter, setServiceFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   /* ================= SERVICES VIEW ================= */
//   const [selectedService, setSelectedService] = useState(null);
//   const [viewOpen, setViewOpen] = useState(false);

//   /* ================= SORTING ================= */
//   const [order, setOrder] = useState("asc");
//   const [orderBy, setOrderBy] = useState("service_name");

//   /* ================= ALERT ================= */
//   const [alert, setAlert] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   /* ================= STAFF APPLICATIONS ================= */
//   const staffApplications = useMemo(() => {
//     return applications.filter((app) => app.staff === staffName);
//   }, [applications, staffName]);

//   const filteredApplications = useMemo(() => {
//     return staffApplications.filter(
//       (app) =>
//         (!serviceFilter || app.service === serviceFilter) &&
//         (!statusFilter || app.status === statusFilter)
//     );
//   }, [staffApplications, serviceFilter, statusFilter]);

//   /* ================= APPLICATION STATUS UPDATE ================= */
//   const updateApplicationStatus = (nextStatus, remark) => {
//     if (!selectedApplication) return;

//     const updated = applications.map((app) =>
//       app.id === selectedApplication.id
//         ? {
//             ...app,
//             status: nextStatus,
//             remarksHistory: [
//               ...(app.remarksHistory || []),
//               {
//                 remark,
//                 status: nextStatus,
//                 date: new Date().toLocaleString(),
//               },
//             ],
//           }
//         : app
//     );

//     localStorage.setItem("applications", JSON.stringify(updated));
//     setSelectedApplication(null);

//     setAlert({
//       open: true,
//       message: "Application status updated",
//       severity: "success",
//     });
//   };

//   /* ================= DASHBOARD ================= */
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

//   /* ================= SERVICES SORTING ================= */
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

//   /* ================= SERVICE VIEW ================= */
//   const handleViewService = (service) => {
//     setSelectedService(service);
//     setViewOpen(true);
//   };

//   return (
//     <StaffContext.Provider
//       value={{
//         /* Applications */
//         filteredApplications,
//         selectedApplication,
//         setSelectedApplication,
//         serviceFilter,
//         setServiceFilter,
//         statusFilter,
//         setStatusFilter,
//         updateApplicationStatus,

//         /* Dashboard */
//         stats,
//         chartData,

//         /* Services */
//         sortedServices,
//         order,
//         orderBy,
//         handleServiceSort,
//         selectedService,
//         setSelectedService,
//         viewOpen,
//         setViewOpen,
//         handleViewService,

//         /* Alerts */
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

const StaffContext = createContext();
export const useStaff = () => useContext(StaffContext);

export const StaffProvider = ({ children }) => {
  const { applications = [], services = [] } = useAdmin();
  const loggedInStaff = JSON.parse(localStorage.getItem("loggedInUser"));
  const staffName = loggedInStaff?.username;

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("service_name");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const staffApplications = useMemo(
    () => applications.filter((app) => app.staff === staffName),
    [applications, staffName]
  );
  const filteredApplications = useMemo(
    () =>
      staffApplications.filter(
        (app) =>
          (!serviceFilter || app.service === serviceFilter) &&
          (!statusFilter || app.status === statusFilter)
      ),
    [staffApplications, serviceFilter, statusFilter]
  );

  const updateApplicationStatus = (nextStatus, remark) => {
    if (!selectedApplication) return;
    const updated = applications.map((app) =>
      app.id === selectedApplication.id
        ? {
            ...app,
            status: nextStatus,
            remarksHistory: [
              ...(app.remarksHistory || []),
              { remark, status: nextStatus, date: new Date().toLocaleString() },
            ],
          }
        : app
    );
    localStorage.setItem("applications", JSON.stringify(updated));
    setSelectedApplication(null);
    setAlert({
      open: true,
      message: "Application status updated",
      severity: "success",
    });
  };

  const stats = useMemo(
    () => ({
      totalAssigned: staffApplications.length,
      underReview: staffApplications.filter((a) => a.status === "under_review")
        .length,
      forwardedToOfficer: staffApplications.filter(
        (a) => a.status === "forwarded"
      ).length,
      rejected: staffApplications.filter((a) => a.status === "rejected").length,
    }),
    [staffApplications]
  );

  const chartData = useMemo(
    () => [
      { name: "Under Review", value: stats.underReview },
      { name: "Forwarded", value: stats.forwardedToOfficer },
      { name: "Rejected", value: stats.rejected },
    ],
    [stats]
  );

  const sortedServices = useMemo(() => {
    if (!Array.isArray(services)) return [];
    return [...services].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [services, order, orderBy]);

  const handleServiceSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setViewOpen(true);
  };

  return (
    <StaffContext.Provider
      value={{
        filteredApplications,
        selectedApplication,
        setSelectedApplication,
        serviceFilter,
        setServiceFilter,
        statusFilter,
        setStatusFilter,
        updateApplicationStatus,
        stats,
        chartData,
        sortedServices,
        order,
        orderBy,
        handleServiceSort,
        selectedService,
        setSelectedService,
        viewOpen,
        setViewOpen,
        handleViewService,
        alert,
        setAlert,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};
