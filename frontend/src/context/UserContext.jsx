import React, { createContext, useContext, useState, useEffect } from "react";
import { useAdmin } from "./AdminContext";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { services: adminServices = [] } = useAdmin();

  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedServiceForApply, setSelectedServiceForApply] = useState(null);

  /* -------- Load applications ONCE from localStorage -------- */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(stored);
  }, []);

  /* -------- Sync only SERVICES from Admin -------- */
  useEffect(() => {
    setServices(adminServices.filter((s) => s.service_status === true));
  }, [adminServices]);

  /* -------- Apply for Service -------- */
  const applyForService = (data) => {
    const formattedDocuments = Object.entries(data.documents || {}).map(
      ([docName, file]) => ({
        documentName: docName,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      })
    );

    const newApplication = {
      id: `APP${Date.now()}`,
      serviceId: data.serviceId,
      serviceName: data.serviceName, // ✅ SINGLE SOURCE OF TRUTH
      applicant: data.applicant,
      documents: formattedDocuments,
      status: "Submitted",
      submittedAt: new Date().toLocaleString(),
    };

    const updated = [newApplication, ...applications];
    setApplications(updated);
    localStorage.setItem("applications", JSON.stringify(updated));
  };

  const clearSelectedServiceForApply = () => setSelectedServiceForApply(null);

  const getDashboardStats = () => ({
    total: applications.length,
    submitted: applications.filter((a) => a.status === "Submitted").length,
    approved: applications.filter((a) => a.status === "Approved").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  });

  return (
    <UserContext.Provider
      value={{
        services,
        applications,
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
