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
  /* ================= INIT FLAG ================= */
  const [isInitialized, setIsInitialized] = useState(false);

  /* ================= APPLICATIONS ================= */
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  /* ================= USERS ================= */
  const [signupDetails, setSignupDetails] = useState([]);
  const [staffList, setStaffList] = useState([]);

  /* ================= SERVICES ================= */
  const [services, setServices] = useState([]);

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    const storedApplications = JSON.parse(
      localStorage.getItem("applications")
    ) ?? [
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

    const storedSignup =
      JSON.parse(localStorage.getItem("signupDetails")) ?? [];

    const storedServices = JSON.parse(localStorage.getItem("services")) ?? [];

    setApplications(storedApplications);
    setSignupDetails(storedSignup);
    setStaffList(storedSignup.filter((u) => u.role === "staff"));
    setServices(storedServices);

    setIsInitialized(true);
  }, []);

  /* ================= PERSIST ================= */
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("signupDetails", JSON.stringify(signupDetails));
  }, [signupDetails, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("services", JSON.stringify(services));
  }, [services, isInitialized]);

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

  const filterApplications = (category, status) => {
    return applications.filter(
      (app) =>
        (!category || app.service.toLowerCase() === category.toLowerCase()) &&
        (!status || app.status === status)
    );
  };

  /* ================= STAFF ACTIONS ================= */
  const signupStaff = (username, email, password, confirmPassword, role) => {
    if (!username || !email || !password || !confirmPassword) {
      return { success: false, message: "All fields are required" };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }

    if (signupDetails.some((u) => u.email === email)) {
      return { success: false, message: "Email already exists" };
    }

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

  /* ================= SERVICE ACTIONS ================= */
  const createService = (service) => {
    setServices((prev) => [...prev, service]);
  };

  const updateService = (updatedService) => {
    setServices((prev) =>
      prev.map((s) => (s.id === updatedService.id ? updatedService : s))
    );
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  /* ================= DASHBOARD STATS ================= */
  const dashboardStats = useMemo(() => {
    const totalServices = services.length;
    const activeServices = services.filter((s) => s.service_status).length;

    return {
      totalServices,
      activeServices,
      inActiveServices: totalServices - activeServices,
      totalApplications: applications.length,
      approvedApplications: applications.filter((a) => a.status === "approved")
        .length,
      rejectedApplications: applications.filter((a) => a.status === "rejected")
        .length,
    };
  }, [services, applications]);

  const chartData = useMemo(() => {
    return {
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
    };
  }, [services, applications]);

  return (
    <AdminPanelContext.Provider
      value={{
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
