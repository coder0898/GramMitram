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
