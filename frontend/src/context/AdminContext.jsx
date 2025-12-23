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
