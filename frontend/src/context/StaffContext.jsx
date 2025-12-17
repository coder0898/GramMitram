import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const StaffContext = createContext();
export const useStaff = () => useContext(StaffContext);

export const StaffProvider = ({ children }) => {
  const loggedInStaff = JSON.parse(localStorage.getItem("loggedInUser"));
  const staffName = loggedInStaff?.username;

  /* ================= APPLICATIONS ================= */
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  /* ================= LOAD FROM ADMIN DATA ================= */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("applications")) || [];
    setApplications(stored);
  }, []);

  /* ================= STAFF-SPECIFIC APPS ================= */
  const staffApplications = useMemo(() => {
    return applications.filter((app) => app.staff === staffName);
  }, [applications, staffName]);

  const filteredApplications = useMemo(() => {
    return staffApplications.filter(
      (app) =>
        (serviceFilter ? app.service === serviceFilter : true) &&
        (statusFilter ? app.status === statusFilter : true)
    );
  }, [staffApplications, serviceFilter, statusFilter]);

  /* ================= STATUS UPDATE ================= */
  const updateApplicationStatus = (nextStatus, remark) => {
    const updated = applications.map((app) =>
      app.id === selectedApplication.id
        ? {
            ...app,
            status: nextStatus,
            remarksHistory: [
              ...(app.remarksHistory || []),
              {
                remark,
                status: nextStatus,
                date: new Date().toLocaleString(),
              },
            ],
          }
        : app
    );

    setApplications(updated);
    localStorage.setItem("applications", JSON.stringify(updated));
    setSelectedApplication(null);
  };

  /* ================= DASHBOARD ================= */
  const stats = useMemo(() => {
    return {
      totalAssigned: staffApplications.length,
      underReview: staffApplications.filter((a) => a.status === "under_review")
        .length,
      forwardedToOfficer: staffApplications.filter(
        (a) => a.status === "forwarded"
      ).length,
      rejected: staffApplications.filter((a) => a.status === "rejected").length,
    };
  }, [staffApplications]);

  const chartData = useMemo(
    () => [
      { name: "Under Review", value: stats.underReview },
      { name: "Forwarded", value: stats.forwardedToOfficer },
      { name: "Rejected", value: stats.rejected },
    ],
    [stats]
  );

  /* ================= SERVICES ================= */
  const [servicesList, setServicesList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("service_name");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("Services")) || [];
    setServicesList(stored);
  }, []);

  const sortedServices = useMemo(() => {
    return [...servicesList].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [servicesList, order, orderBy]);

  const handleServiceSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  /* ================= SERVICE UI STATE ================= */
  const [viewOpen, setViewOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleViewService = (service) => {
    setSelectedService(service);
    setViewOpen(true);
  };

  return (
    <StaffContext.Provider
      value={{
        /* Applications */
        filteredApplications,
        selectedApplication,
        setSelectedApplication,
        serviceFilter,
        setServiceFilter,
        statusFilter,
        setStatusFilter,
        updateApplicationStatus,

        /* Dashboard */
        stats,
        chartData,

        /* Services */
        sortedServices,
        selectedService,
        setSelectedService,
        handleServiceSort,
        order,
        orderBy,
        /* Service UI */
        viewOpen,
        setViewOpen,
        alert,
        setAlert,
        handleViewService,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};
