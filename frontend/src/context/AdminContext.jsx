// import React, { createContext, useContext, useEffect, useState } from "react";

// const AdminPanelContext = createContext();
// export const useAdmin = () => useContext(AdminPanelContext);

// export const AdminPanelProvider = ({ children }) => {
//   /* ================= SERVICES ================= */
//   const [services, setServices] = useState([]);

//   /* ================= APPLICATIONS ================= */
//   const [applications, setApplications] = useState([]);
//   const [selectedApplication, setSelectedApplication] = useState(null);

//   /* ================= STAFF ================= */
//   const [staffList, setStaffList] = useState([]);

//   /* ================= DASHBOARD ================= */
//   const [dashboardStats, setDashboardStats] = useState({
//     totalServices: 0,
//     activeServices: 0,
//     inActiveServices: 0,
//     totalApplications: 0,
//     approvedApplications: 0,
//     rejectedApplications: 0,
//   });

//   const [chartData, setChartData] = useState({
//     applicationsPerService: [],
//     applicationStatusDistribution: [],
//   });

//   /* ================= INIT LOAD ================= */
//   useEffect(() => {
//     setServices(JSON.parse(localStorage.getItem("Services")) || []);
//     setApplications(JSON.parse(localStorage.getItem("applications")) || []);
//     const signup = JSON.parse(localStorage.getItem("signupDetails")) || [];
//     setStaffList(signup.filter((u) => u.role === "staff"));
//   }, []);

//   /* ================= SERVICES ================= */
//   const createService = (service) => {
//     const updated = [...services, service];
//     setServices(updated);
//     localStorage.setItem("Services", JSON.stringify(updated));
//   };

//   const updateService = (service) => {
//     const updated = services.map((s) => (s.id === service.id ? service : s));
//     setServices(updated);
//     localStorage.setItem("Services", JSON.stringify(updated));
//   };

//   const deleteService = (id) => {
//     const updated = services.filter((s) => s.id !== id);
//     setServices(updated);
//     localStorage.setItem("Services", JSON.stringify(updated));
//   };

//   /* ================= APPLICATIONS ================= */
//   const updateApplication = (id, data) => {
//     const updated = applications.map((app) =>
//       app.id === id ? { ...app, ...data } : app
//     );
//     setApplications(updated);
//     localStorage.setItem("applications", JSON.stringify(updated));
//   };

//   const assignStaff = (appId, staffName) => {
//     updateApplication(appId, { staff: staffName, status: "under review" });
//   };

//   const approveApplication = (appId, remarks) => {
//     updateApplication(appId, { status: "approved", adminRemarks: remarks });
//   };

//   const rejectApplication = (appId, remarks) => {
//     updateApplication(appId, { status: "rejected", adminRemarks: remarks });
//   };

//   /* ================= STAFF ================= */
//   const signupStaff = (username, email, password, confirmPassword, role) => {
//     const signupDetails =
//       JSON.parse(localStorage.getItem("signupDetails")) || [];

//     if (signupDetails.find((u) => u.email === email)) {
//       return { success: false, message: "Email already exists" };
//     }

//     const newUser = {
//       username,
//       email,
//       password,
//       role,
//       createdAt: new Date().toLocaleString(),
//     };

//     const updated = [...signupDetails, newUser];
//     localStorage.setItem("signupDetails", JSON.stringify(updated));
//     setStaffList(updated.filter((u) => u.role === "staff"));

//     return { success: true, message: "Staff account created successfully" };
//   };

//   const deleteStaff = (email) => {
//     const signupDetails =
//       JSON.parse(localStorage.getItem("signupDetails")) || [];
//     const updated = signupDetails.filter((u) => u.email !== email);
//     localStorage.setItem("signupDetails", JSON.stringify(updated));
//     setStaffList(updated.filter((u) => u.role === "staff"));
//   };

//   /* ================= DASHBOARD ================= */
//   useEffect(() => {
//     const totalServices = services.length;
//     const activeServices = services.filter(
//       (s) => s.service_status === true
//     ).length;
//     const inActiveServices = totalServices - activeServices;

//     const totalApplications = applications.length;
//     const approvedApplications = applications.filter(
//       (a) => a.status === "approved"
//     ).length;
//     const rejectedApplications = applications.filter(
//       (a) => a.status === "rejected"
//     ).length;

//     setDashboardStats({
//       totalServices,
//       activeServices,
//       inActiveServices,
//       totalApplications,
//       approvedApplications,
//       rejectedApplications,
//     });

//     const applicationsPerService = services.map((service) => {
//       const count = applications.filter(
//         (a) => a.serviceId === service.id
//       ).length;
//       return { name: service.name, count };
//     });

//     const applicationStatusDistribution = [
//       { name: "Approved", value: approvedApplications },
//       { name: "Rejected", value: rejectedApplications },
//     ];

//     setChartData({ applicationsPerService, applicationStatusDistribution });
//   }, [services, applications]);

//   return (
//     <AdminPanelContext.Provider
//       value={{
//         services,
//         applications,
//         selectedApplication,
//         setSelectedApplication,
//         staffList,
//         dashboardStats,
//         chartData,

//         createService,
//         updateService,
//         deleteService,

//         assignStaff,
//         approveApplication,
//         rejectApplication,

//         signupStaff,
//         deleteStaff,
//       }}
//     >
//       {children}
//     </AdminPanelContext.Provider>
//   );
// };

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AdminPanelContext = createContext();
export const useAdmin = () => useContext(AdminPanelContext);

export const AdminPanelProvider = ({ children }) => {
  /* ================= APPLICATIONS ================= */
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  /* ================= STAFF ================= */
  const [staffList, setStaffList] = useState([]);

  /* ================= INIT ================= */
  useEffect(() => {
    const storedApps = JSON.parse(localStorage.getItem("applications")) || [
      {
        id: "APP001",
        applicantName: "Ravi Kumar",
        service: "Water Supply",
        status: "submitted",
        staff: "",
        submittedDate: "12-09-2025",
        documents: ["Aadhaar Card", "Electricity Bill"],
        remarks: "",
        disableView: false,
      },
    ];

    setApplications(storedApps);

    const signup = JSON.parse(localStorage.getItem("signupDetails")) || [];
    setStaffList(signup.filter((u) => u.role === "staff"));
  }, []);

  /* ================= PERSIST ================= */
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  /* ================= APPLICATION ACTIONS ================= */
  const updateApplication = (id, data) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...data } : app))
    );
  };

  const assignStaff = (appId, staffName) => {
    updateApplication(appId, {
      staff: staffName,
      status: "under_review",
      disableView: false,
    });
  };

  const approveApplication = (appId, remarks) => {
    updateApplication(appId, {
      status: "approved",
      remarks,
      staff: "Admin",
      disableView: true,
    });
  };

  const rejectApplication = (appId, remarks) => {
    updateApplication(appId, {
      status: "rejected",
      remarks,
      staff: "Admin",
      disableView: true,
    });
  };

  /* ================= FILTER HELPERS ================= */
  const filterApplications = (category, status) => {
    return applications.filter(
      (app) =>
        (category
          ? app.service.toLowerCase() === category.toLowerCase()
          : true) && (status ? app.status === status : true)
    );
  };

  return (
    <AdminPanelContext.Provider
      value={{
        applications,
        selectedApplication,
        setSelectedApplication,
        staffList,

        assignStaff,
        approveApplication,
        rejectApplication,

        filterApplications,
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  );
};
