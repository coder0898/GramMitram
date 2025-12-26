import React, { createContext, useContext, useMemo, useState } from "react";
import { useAdmin } from "./AdminContext";
import { useAuth } from "./AuthContext";

export const StaffContext = createContext();
export const useStaff = () => useContext(StaffContext);

export const StaffProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { applications, services, updateApplication } = useAdmin();

  // Selected application
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Filters for applications
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Staff-specific applications
  const staffApplications = useMemo(() => {
    if (!currentUser || !applications) return [];
    return applications.filter((app) => app.staff === currentUser.email);
  }, [applications, currentUser]);

  const filteredApplications = useMemo(
    () =>
      staffApplications.filter(
        (app) =>
          (!serviceFilter || app.service === serviceFilter) &&
          (!statusFilter || app.status === statusFilter)
      ),
    [staffApplications, serviceFilter, statusFilter]
  );

  // Update application status via AdminContext
  const updateApplicationStatus = async (status, remark) => {
    if (!selectedApplication) return;
    try {
      await updateApplication(selectedApplication.id, { status, remark });
      setSelectedApplication((prev) => ({ ...prev, status, remark }));
    } catch (err) {
      console.error("Failed to update application status:", err);
    }
  };

  // === Staff services for ServiceTab ===
  const [selectedService, setSelectedService] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Sorting for services
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("service_name");

  const staffServices = useMemo(() => services || [], [services]); // always sync with AdminContext

  const sortedServices = useMemo(() => {
    return [...staffServices].sort((a, b) => {
      const valA = a[orderBy] ? a[orderBy].toString().toLowerCase() : "";
      const valB = b[orderBy] ? b[orderBy].toString().toLowerCase() : "";
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [staffServices, order, orderBy]);

  const handleServiceSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setViewOpen(true);
  };

  // === Dashboard stats for StaffDashboard ===
  const stats = useMemo(() => {
    const totalAssigned = staffApplications.length;
    const underReview = staffApplications.filter(
      (a) => a.status === "under_review"
    ).length;
    const forwardedToOfficer = staffApplications.filter(
      (a) => a.status === "forwarded"
    ).length;
    const rejected = staffApplications.filter(
      (a) => a.status === "rejected"
    ).length;
    return { totalAssigned, underReview, forwardedToOfficer, rejected };
  }, [staffApplications]);

  const chartData = [
    { name: "Under Review", value: stats.underReview },
    { name: "Forwarded", value: stats.forwardedToOfficer },
    { name: "Rejected", value: stats.rejected },
  ];

  return (
    <StaffContext.Provider
      value={{
        staffApplications,
        filteredApplications,
        selectedApplication,
        setSelectedApplication,
        serviceFilter,
        setServiceFilter,
        statusFilter,
        setStatusFilter,
        updateApplicationStatus,
        staffServices,
        sortedServices,
        order,
        orderBy,
        handleServiceSort,
        selectedService,
        viewOpen,
        setViewOpen,
        alert,
        setAlert,
        handleViewService,
        stats,
        chartData,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};
