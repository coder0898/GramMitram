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
