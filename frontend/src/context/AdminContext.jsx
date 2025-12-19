// // // import React, {
// // //   createContext,
// // //   useContext,
// // //   useEffect,
// // //   useMemo,
// // //   useState,
// // // } from "react";

// // // const AdminPanelContext = createContext();
// // // export const useAdmin = () => useContext(AdminPanelContext);

// // // export const AdminPanelProvider = ({ children }) => {
// // //   /* ================= INIT FLAG ================= */
// // //   const [isInitialized, setIsInitialized] = useState(false);

// // //   /* ================= APPLICATIONS ================= */
// // //   const [applications, setApplications] = useState([]);
// // //   const [selectedApplication, setSelectedApplication] = useState(null);

// // //   /* ================= USERS ================= */
// // //   const [signupDetails, setSignupDetails] = useState([]);
// // //   const [staffList, setStaffList] = useState([]);

// // //   /* ================= SERVICES ================= */
// // //   const [services, setServices] = useState([]);

// // //   /* ================= INITIAL LOAD ================= */
// // //   useEffect(() => {
// // //     const storedApplications = JSON.parse(
// // //       localStorage.getItem("applications")
// // //     ) ?? [
// // //       {
// // //         id: "APP001",
// // //         applicantName: "Ravi Kumar",
// // //         service: "Water Supply",
// // //         status: "submitted",
// // //         staff: "",
// // //         submittedDate: "12-09-2025",
// // //         documents: ["Aadhaar Card", "Electricity Bill"],
// // //         remarks: "",
// // //         disableView: false,
// // //       },
// // //     ];

// // //     const storedSignup =
// // //       JSON.parse(localStorage.getItem("signupDetails")) ?? [];

// // //     const storedServices = JSON.parse(localStorage.getItem("services")) ?? [];

// // //     setApplications(storedApplications);
// // //     setSignupDetails(storedSignup);
// // //     setStaffList(storedSignup.filter((u) => u.role === "staff"));
// // //     setServices(storedServices);

// // //     setIsInitialized(true);
// // //   }, []);

// // //   /* ================= PERSIST ================= */
// // //   useEffect(() => {
// // //     if (!isInitialized) return;
// // //     localStorage.setItem("applications", JSON.stringify(applications));
// // //   }, [applications, isInitialized]);

// // //   useEffect(() => {
// // //     if (!isInitialized) return;
// // //     localStorage.setItem("signupDetails", JSON.stringify(signupDetails));
// // //   }, [signupDetails, isInitialized]);

// // //   useEffect(() => {
// // //     if (!isInitialized) return;
// // //     localStorage.setItem("services", JSON.stringify(services));
// // //   }, [services, isInitialized]);

// // //   /* ================= APPLICATION ACTIONS ================= */
// // //   const updateApplication = (id, data) => {
// // //     setApplications((prev) =>
// // //       prev.map((app) => (app.id === id ? { ...app, ...data } : app))
// // //     );
// // //   };

// // //   const assignStaff = (appId, staffName) => {
// // //     updateApplication(appId, {
// // //       staff: staffName,
// // //       status: "under_review",
// // //       disableView: false,
// // //     });
// // //   };

// // //   const approveApplication = (appId, remarks) => {
// // //     updateApplication(appId, {
// // //       status: "approved",
// // //       remarks,
// // //       staff: "Admin",
// // //       disableView: true,
// // //     });
// // //   };

// // //   const rejectApplication = (appId, remarks) => {
// // //     updateApplication(appId, {
// // //       status: "rejected",
// // //       remarks,
// // //       staff: "Admin",
// // //       disableView: true,
// // //     });
// // //   };

// // //   const filterApplications = (category, status) => {
// // //     return applications.filter(
// // //       (app) =>
// // //         (!category || app.service.toLowerCase() === category.toLowerCase()) &&
// // //         (!status || app.status === status)
// // //     );
// // //   };

// // //   /* ================= STAFF ACTIONS ================= */
// // //   const signupStaff = (username, email, password, confirmPassword, role) => {
// // //     if (!username || !email || !password || !confirmPassword) {
// // //       return { success: false, message: "All fields are required" };
// // //     }

// // //     if (password !== confirmPassword) {
// // //       return { success: false, message: "Passwords do not match" };
// // //     }

// // //     if (signupDetails.some((u) => u.email === email)) {
// // //       return { success: false, message: "Email already exists" };
// // //     }

// // //     const newStaff = {
// // //       username,
// // //       email,
// // //       password,
// // //       role,
// // //       createdAt: new Date().toISOString(),
// // //     };

// // //     const updatedSignup = [...signupDetails, newStaff];

// // //     setSignupDetails(updatedSignup);
// // //     setStaffList(updatedSignup.filter((u) => u.role === "staff"));

// // //     return { success: true, message: "Staff created successfully" };
// // //   };

// // //   const deleteStaff = (email) => {
// // //     const updatedSignup = signupDetails.filter(
// // //       (u) => !(u.email === email && u.role === "staff")
// // //     );

// // //     setSignupDetails(updatedSignup);
// // //     setStaffList(updatedSignup.filter((u) => u.role === "staff"));
// // //   };

// // //   /* ================= SERVICE ACTIONS ================= */
// // //   const createService = (service) => {
// // //     setServices((prev) => [...prev, service]);
// // //   };

// // //   const updateService = (updatedService) => {
// // //     setServices((prev) =>
// // //       prev.map((s) => (s.id === updatedService.id ? updatedService : s))
// // //     );
// // //   };

// // //   const deleteService = (id) => {
// // //     setServices((prev) => prev.filter((s) => s.id !== id));
// // //   };

// // //   /* ================= DASHBOARD STATS ================= */
// // //   const dashboardStats = useMemo(() => {
// // //     const totalServices = services.length;
// // //     const activeServices = services.filter((s) => s.service_status).length;

// // //     return {
// // //       totalServices,
// // //       activeServices,
// // //       inActiveServices: totalServices - activeServices,
// // //       totalApplications: applications.length,
// // //       approvedApplications: applications.filter((a) => a.status === "approved")
// // //         .length,
// // //       rejectedApplications: applications.filter((a) => a.status === "rejected")
// // //         .length,
// // //     };
// // //   }, [services, applications]);

// // //   const chartData = useMemo(() => {
// // //     return {
// // //       applicationsPerService: services.map((s) => ({
// // //         name: s.service_name,
// // //         count: applications.filter((a) => a.service === s.service_name).length,
// // //       })),
// // //       applicationStatusDistribution: [
// // //         {
// // //           name: "Submitted",
// // //           value: applications.filter((a) => a.status === "submitted").length,
// // //         },
// // //         {
// // //           name: "Under Review",
// // //           value: applications.filter((a) => a.status === "under_review").length,
// // //         },
// // //         {
// // //           name: "Approved",
// // //           value: applications.filter((a) => a.status === "approved").length,
// // //         },
// // //         {
// // //           name: "Rejected",
// // //           value: applications.filter((a) => a.status === "rejected").length,
// // //         },
// // //       ],
// // //     };
// // //   }, [services, applications]);

// // //   return (
// // //     <AdminPanelContext.Provider
// // //       value={{
// // //         applications,
// // //         selectedApplication,
// // //         setSelectedApplication,

// // //         signupDetails,
// // //         staffList,

// // //         services,

// // //         assignStaff,
// // //         approveApplication,
// // //         rejectApplication,
// // //         filterApplications,

// // //         signupStaff,
// // //         deleteStaff,

// // //         createService,
// // //         updateService,
// // //         deleteService,

// // //         dashboardStats,
// // //         chartData,
// // //       }}
// // //     >
// // //       {children}
// // //     </AdminPanelContext.Provider>
// // //   );
// // // };

// // // AdminContext.js
// // import React, {
// //   createContext,
// //   useContext,
// //   useEffect,
// //   useMemo,
// //   useState,
// // } from "react";

// // const AdminContext = createContext();
// // export const useAdmin = () => useContext(AdminContext);

// // export const AdminPanelProvider = ({ children }) => {
// //   const [ready, setReady] = useState(false);

// //   const [applications, setApplications] = useState([]);
// //   const [services, setServices] = useState([]);
// //   const [signupDetails, setSignupDetails] = useState([]);
// //   const [selectedApplication, setSelectedApplication] = useState(null);

// //   /* INIT */
// //   useEffect(() => {
// //     setApplications(JSON.parse(localStorage.getItem("applications")) || []);
// //     setServices(JSON.parse(localStorage.getItem("services")) || []);
// //     const users = JSON.parse(localStorage.getItem("signupDetails")) || [];
// //     setSignupDetails(users);
// //     setReady(true);
// //   }, []);

// //   /* PERSIST */
// //   useEffect(() => {
// //     if (ready)
// //       localStorage.setItem("applications", JSON.stringify(applications));
// //   }, [applications, ready]);

// //   useEffect(() => {
// //     if (ready) localStorage.setItem("services", JSON.stringify(services));
// //   }, [services, ready]);

// //   useEffect(() => {
// //     if (ready)
// //       localStorage.setItem("signupDetails", JSON.stringify(signupDetails));
// //   }, [signupDetails, ready]);

// //   /* STAFF */
// //   const staffList = signupDetails.filter((u) => u.role === "staff");

// //   const signupStaff = (username, email, password, confirmPassword) => {
// //     if (signupDetails.some((u) => u.email === email))
// //       return { success: false, message: "Email exists" };

// //     const updated = [
// //       ...signupDetails,
// //       {
// //         username,
// //         email,
// //         password,
// //         role: "staff",
// //         createdAt: new Date().toISOString(),
// //       },
// //     ];
// //     setSignupDetails(updated);
// //     return { success: true, message: "Staff created" };
// //   };

// //   const deleteStaff = (email) =>
// //     setSignupDetails((prev) => prev.filter((u) => u.email !== email));

// //   /* APPLICATION FLOW */
// //   const updateApplication = (id, data) =>
// //     setApplications((prev) =>
// //       prev.map((a) => (a.id === id ? { ...a, ...data } : a))
// //     );

// //   const assignStaff = (id, staff) =>
// //     updateApplication(id, { staff, status: "under_review" });

// //   const approveApplication = (id, remarks) =>
// //     updateApplication(id, { status: "approved", remarks });

// //   const rejectApplication = (id, remarks) =>
// //     updateApplication(id, { status: "rejected", remarks });

// //   const filterApplications = (category, status) =>
// //     applications.filter(
// //       (a) =>
// //         (!category || a.service === category) &&
// //         (!status || a.status === status)
// //     );

// //   /* SERVICES */
// //   const createService = (service) => setServices((s) => [...s, service]);
// //   const updateService = (srv) =>
// //     setServices((s) => s.map((x) => (x.id === srv.id ? srv : x)));
// //   const deleteService = (id) =>
// //     setServices((s) => s.filter((x) => x.id !== id));

// //   /* DASHBOARD */
// //   const dashboardStats = useMemo(
// //     () => ({
// //       totalServices: services.length,
// //       activeServices: services.filter((s) => s.service_status).length,
// //       inActiveServices: services.filter((s) => !s.service_status).length,
// //       totalApplications: applications.length,
// //       approvedApplications: applications.filter((a) => a.status === "approved")
// //         .length,
// //       rejectedApplications: applications.filter((a) => a.status === "rejected")
// //         .length,
// //     }),
// //     [services, applications]
// //   );

// //   const chartData = useMemo(
// //     () => ({
// //       applicationsPerService: services.map((s) => ({
// //         name: s.service_name,
// //         count: applications.filter((a) => a.service === s.service_name).length,
// //       })),
// //       applicationStatusDistribution: [
// //         {
// //           name: "Submitted",
// //           value: applications.filter((a) => a.status === "submitted").length,
// //         },
// //         {
// //           name: "Under Review",
// //           value: applications.filter((a) => a.status === "under_review").length,
// //         },
// //         {
// //           name: "Approved",
// //           value: applications.filter((a) => a.status === "approved").length,
// //         },
// //         {
// //           name: "Rejected",
// //           value: applications.filter((a) => a.status === "rejected").length,
// //         },
// //       ],
// //     }),
// //     [applications, services]
// //   );

// //   return (
// //     <AdminContext.Provider
// //       value={{
// //         applications,
// //         services,
// //         staffList,
// //         selectedApplication,
// //         setSelectedApplication,
// //         signupStaff,
// //         deleteStaff,
// //         assignStaff,
// //         approveApplication,
// //         rejectApplication,
// //         filterApplications,
// //         createService,
// //         updateService,
// //         deleteService,
// //         dashboardStats,
// //         chartData,
// //       }}
// //     >
// //       {children}
// //     </AdminContext.Provider>
// //   );
// // };

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// const AdminPanelContext = createContext();
// export const useAdmin = () => useContext(AdminPanelContext);

// export const AdminPanelProvider = ({ children }) => {
//   const [isInitialized, setIsInitialized] = useState(false);

//   /* Applications */
//   const [applications, setApplications] = useState([]);
//   const [selectedApplication, setSelectedApplication] = useState(null);

//   /* Users */
//   const [signupDetails, setSignupDetails] = useState(() => {
//     return JSON.parse(localStorage.getItem("signupDetails")) || [];
//   });

//   const [staffList, setStaffList] = useState([]);

//   /* Services */
//   const [services, setServices] = useState([]);

//   const addUser = (user) => {
//     const updated = [...signupDetails, user];
//     setSignupDetails(updated);
//     localStorage.setItem("signupDetails", JSON.stringify(updated));
//   };

//   /* Initialize from localStorage */
//   useEffect(() => {
//     const storedApplications = JSON.parse(
//       localStorage.getItem("applications")
//     ) || [
//       {
//         id: "APP001",
//         applicantName: "Ravi Kumar",
//         service: "Water Supply",
//         status: "submitted",
//         staff: "",
//         submittedDate: "12-09-2025",
//         documents: ["Aadhaar Card", "Electricity Bill"],
//         remarks: "",
//         disableView: false,
//       },
//     ];

//     const storedSignup = JSON.parse(localStorage.getItem("signupDetails")) || [
//       {
//         username: "admin",
//         email: "admin@example.com",
//         password: "admin123",
//         role: "admin",
//         createdAt: new Date().toISOString(),
//       },
//     ];

//     const storedServices = JSON.parse(localStorage.getItem("services")) || [];

//     setApplications(storedApplications);
//     setSignupDetails(storedSignup);
//     setStaffList(storedSignup.filter((u) => u.role === "staff"));
//     setServices(storedServices);

//     setIsInitialized(true);
//   }, []);

//   /* Persist changes to localStorage */
//   useEffect(() => {
//     if (!isInitialized) return;
//     localStorage.setItem("applications", JSON.stringify(applications));
//   }, [applications, isInitialized]);

//   useEffect(() => {
//     if (!isInitialized) return;
//     localStorage.setItem("signupDetails", JSON.stringify(signupDetails));
//   }, [signupDetails, isInitialized]);

//   useEffect(() => {
//     if (!isInitialized) return;
//     localStorage.setItem("services", JSON.stringify(services));
//   }, [services, isInitialized]);

//   /* ================= APPLICATION ACTIONS ================= */
//   const updateApplication = (id, data) => {
//     setApplications((prev) =>
//       prev.map((app) => (app.id === id ? { ...app, ...data } : app))
//     );
//   };

//   const assignStaff = (appId, staffName) => {
//     updateApplication(appId, {
//       staff: staffName,
//       status: "under_review",
//       disableView: false,
//     });
//   };

//   const approveApplication = (appId, remarks) => {
//     updateApplication(appId, {
//       status: "approved",
//       remarks,
//       staff: "Admin",
//       disableView: true,
//     });
//   };

//   const rejectApplication = (appId, remarks) => {
//     updateApplication(appId, {
//       status: "rejected",
//       remarks,
//       staff: "Admin",
//       disableView: true,
//     });
//   };

//   const filterApplications = (category, status) => {
//     return applications.filter(
//       (app) =>
//         (!category || app.service.toLowerCase() === category.toLowerCase()) &&
//         (!status || app.status === status)
//     );
//   };

//   /* ================= STAFF ACTIONS ================= */
//   const signupStaff = (
//     username,
//     email,
//     password,
//     confirmPassword,
//     role = "staff"
//   ) => {
//     if (!username || !email || !password || !confirmPassword)
//       return { success: false, message: "All fields are required" };
//     if (password !== confirmPassword)
//       return { success: false, message: "Passwords do not match" };
//     if (signupDetails.some((u) => u.email === email))
//       return { success: false, message: "Email already exists" };

//     const newStaff = {
//       username,
//       email,
//       password,
//       role,
//       createdAt: new Date().toISOString(),
//     };
//     const updatedSignup = [...signupDetails, newStaff];

//     setSignupDetails(updatedSignup);
//     setStaffList(updatedSignup.filter((u) => u.role === "staff"));

//     return { success: true, message: "Staff created successfully" };
//   };

//   const deleteStaff = (email) => {
//     const updatedSignup = signupDetails.filter(
//       (u) => !(u.email === email && u.role === "staff")
//     );
//     setSignupDetails(updatedSignup);
//     setStaffList(updatedSignup.filter((u) => u.role === "staff"));
//   };

//   /* ================= SERVICE ACTIONS ================= */
//   const createService = (service) => setServices((prev) => [...prev, service]);
//   const updateService = (updatedService) =>
//     setServices((prev) =>
//       prev.map((s) => (s.id === updatedService.id ? updatedService : s))
//     );
//   const deleteService = (id) =>
//     setServices((prev) => prev.filter((s) => s.id !== id));

//   /* ================= DASHBOARD STATS ================= */
//   const dashboardStats = useMemo(() => {
//     const totalServices = services.length;
//     const activeServices = services.filter((s) => s.service_status).length;
//     return {
//       totalServices,
//       activeServices,
//       inActiveServices: totalServices - activeServices,
//       totalApplications: applications.length,
//       approvedApplications: applications.filter((a) => a.status === "approved")
//         .length,
//       rejectedApplications: applications.filter((a) => a.status === "rejected")
//         .length,
//     };
//   }, [services, applications]);

//   const chartData = useMemo(() => {
//     return {
//       applicationsPerService: services.map((s) => ({
//         name: s.service_name,
//         count: applications.filter((a) => a.service === s.service_name).length,
//       })),
//       applicationStatusDistribution: [
//         {
//           name: "Submitted",
//           value: applications.filter((a) => a.status === "submitted").length,
//         },
//         {
//           name: "Under Review",
//           value: applications.filter((a) => a.status === "under_review").length,
//         },
//         {
//           name: "Approved",
//           value: applications.filter((a) => a.status === "approved").length,
//         },
//         {
//           name: "Rejected",
//           value: applications.filter((a) => a.status === "rejected").length,
//         },
//       ],
//     };
//   }, [services, applications]);

//   return (
//     <AdminPanelContext.Provider
//       value={{
//         addUser,
//         applications,
//         selectedApplication,
//         setSelectedApplication,
//         signupDetails,
//         staffList,
//         services,
//         assignStaff,
//         approveApplication,
//         rejectApplication,
//         filterApplications,
//         signupStaff,
//         deleteStaff,
//         createService,
//         updateService,
//         deleteService,
//         dashboardStats,
//         chartData,
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
  useState,
  useMemo,
} from "react";

const AdminPanelContext = createContext();
export const useAdmin = () => useContext(AdminPanelContext);

export const AdminPanelProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  /* Applications */
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  /* Users */
  const [signupDetails, setSignupDetails] = useState([]);
  const [staffList, setStaffList] = useState([]);

  /* Services */
  const [services, setServices] = useState([]);

  const addUser = (user) => {
    const updated = [...signupDetails, user];
    setSignupDetails(updated);
    localStorage.setItem("signupDetails", JSON.stringify(updated));
  };

  /* Initialize data from localStorage */
  useEffect(() => {
    const storedApplications = JSON.parse(
      localStorage.getItem("applications")
    ) || [
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

    const storedSignup = JSON.parse(localStorage.getItem("signupDetails")) || [
      {
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ];

    const storedServices = JSON.parse(localStorage.getItem("services")) || [];

    setApplications(storedApplications);
    setSignupDetails(storedSignup);
    setStaffList(storedSignup.filter((u) => u.role === "staff"));
    setServices(storedServices);

    setIsInitialized(true);
  }, []);

  /* Persist changes */
  useEffect(() => {
    if (isInitialized)
      localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications, isInitialized]);
  useEffect(() => {
    if (isInitialized)
      localStorage.setItem("signupDetails", JSON.stringify(signupDetails));
  }, [signupDetails, isInitialized]);
  useEffect(() => {
    if (isInitialized)
      localStorage.setItem("services", JSON.stringify(services));
  }, [services, isInitialized]);

  /* Application actions */
  const updateApplication = (id, data) =>
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...data } : app))
    );
  const assignStaff = (appId, staffName) =>
    updateApplication(appId, {
      staff: staffName,
      status: "under_review",
      disableView: false,
    });
  const approveApplication = (appId, remarks) =>
    updateApplication(appId, {
      status: "approved",
      remarks,
      staff: "Admin",
      disableView: true,
    });
  const rejectApplication = (appId, remarks) =>
    updateApplication(appId, {
      status: "rejected",
      remarks,
      staff: "Admin",
      disableView: true,
    });
  const filterApplications = (category, status) =>
    applications.filter(
      (app) =>
        (!category || app.service.toLowerCase() === category.toLowerCase()) &&
        (!status || app.status === status)
    );

  /* Staff actions */
  const signupStaff = (
    username,
    email,
    password,
    confirmPassword,
    role = "staff"
  ) => {
    if (!username || !email || !password || !confirmPassword)
      return { success: false, message: "All fields are required" };
    if (password !== confirmPassword)
      return { success: false, message: "Passwords do not match" };
    if (signupDetails.some((u) => u.email === email))
      return { success: false, message: "Email already exists" };

    const newStaff = {
      username,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    const updatedSignup = [...signupDetails, newStaff];
    setSignupDetails(updatedSignup);
    setStaffList(updatedSignup.filter((u) => u.role === "staff"));
    return { success: true, message: "Staff created successfully" };
  };
  const deleteStaff = (email) => {
    const updatedSignup = signupDetails.filter(
      (u) => !(u.email === email && u.role === "staff")
    );
    setSignupDetails(updatedSignup);
    setStaffList(updatedSignup.filter((u) => u.role === "staff"));
  };

  /* Service actions */
  const createService = (service) => setServices((prev) => [...prev, service]);
  const updateService = (updatedService) =>
    setServices((prev) =>
      prev.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
  const deleteService = (id) =>
    setServices((prev) => prev.filter((s) => s.id !== id));

  /* Dashboard stats */
  const dashboardStats = useMemo(() => {
    return {
      totalServices: services.length,
      activeServices: services.filter((s) => s.service_status).length,
      inActiveServices:
        services.length - services.filter((s) => s.service_status).length,
      totalApplications: applications.length,
      approvedApplications: applications.filter((a) => a.status === "approved")
        .length,
      rejectedApplications: applications.filter((a) => a.status === "rejected")
        .length,
    };
  }, [services, applications]);

  const chartData = useMemo(
    () => ({
      applicationsPerService: services.map((s) => ({
        name: s.service_name,
        count: applications.filter((a) => a.service === s.service_name).length,
      })),
      applicationStatusDistribution: [
        {
          name: "Submitted",
          value: applications.filter((a) => a.status === "submitted").length,
        },
        {
          name: "Under Review",
          value: applications.filter((a) => a.status === "under_review").length,
        },
        {
          name: "Approved",
          value: applications.filter((a) => a.status === "approved").length,
        },
        {
          name: "Rejected",
          value: applications.filter((a) => a.status === "rejected").length,
        },
      ],
    }),
    [services, applications]
  );

  return (
    <AdminPanelContext.Provider
      value={{
        addUser,
        applications,
        selectedApplication,
        setSelectedApplication,
        signupDetails,
        staffList,
        services,
        assignStaff,
        approveApplication,
        rejectApplication,
        filterApplications,
        signupStaff,
        deleteStaff,
        createService,
        updateService,
        deleteService,
        dashboardStats,
        chartData,
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  );
};
