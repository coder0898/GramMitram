import React, { useState, useMemo } from "react";
import { Box, Tabs, Tab, TextField } from "@mui/material";
import ServiceTable from "../components/service/ServiceTable";
import ServiceViewDialog from "../components/service/ServiceViewDialog";
import ApplyServiceTab from "./ApplyServiceTab";
import CreateServiceForm from "../components/service/CreateServiceForm";

import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const ServiceTab = () => {
  const { currentUser } = useAuth();
  const {
    services,
    activeServices,
    myApplications,
    updateService,
    deleteService,
  } = useApp();
  const role = currentUser?.role;

  const [tab, setTab] = useState(0);
  const [viewService, setViewService] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedServiceForApply, setSelectedServiceForApply] = useState(null);

  /* ================= FILTERED SERVICES ================= */
  const visibleServices = useMemo(() => {
    let base = role === "admin" ? services : activeServices;
    return base.filter((s) =>
      s.service_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [services, activeServices, search, role]);

  /* ================= CHECK IF USER HAS APPLIED ================= */
  // Users can reapply if their previous application was rejected
  const hasApplied = (serviceName) => {
    const application = myApplications?.find((a) => a.service === serviceName);
    if (!application) return false;
    return application.status !== "rejected"; // only disable apply if not rejected
  };

  /* ================= USER APPLY ================= */
  const handleApply = (service) => {
    setSelectedServiceForApply(service);
    setTab(1);
  };

  return (
    <Box>
      {/* ADMIN TABS */}
      {role === "admin" && (
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="All Services" />
          <Tab label="Create Service" />
        </Tabs>
      )}

      {/* USER TABS */}
      {role === "user" && (
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Services" />
          <Tab label="Apply Service" />
        </Tabs>
      )}

      {/* STAFF TABS */}
      {role === "staff" && (
        <Tabs value={0} sx={{ mb: 2 }}>
          <Tab label="Services" />
        </Tabs>
      )}

      {/* ================= SERVICE LIST / ADMIN TAB 0 / USER TAB 0 ================= */}
      {(role === "admin" && tab === 0) ||
      (role === "user" && tab === 0) ||
      role === "staff" ? (
        <>
          {role === "user" && (
            <TextField
              fullWidth
              sx={{ maxWidth: 400, mb: 3 }}
              placeholder="Search service"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          <ServiceTable
            services={visibleServices}
            role={role}
            onView={setViewService}
            onApply={role === "user" ? handleApply : undefined}
            disableApply={(service) =>
              role === "user" && hasApplied(service.service_name)
            }
          />
        </>
      ) : null}

      {/* ADMIN CREATE SERVICE FORM */}
      {role === "admin" && tab === 1 && <CreateServiceForm />}

      {/* USER APPLY SERVICE TAB */}
      {role === "user" && tab === 1 && selectedServiceForApply && (
        <ApplyServiceTab
          selectedService={selectedServiceForApply}
          onBack={() => setTab(0)}
        />
      )}

      {/* SERVICE VIEW DIALOG */}
      <ServiceViewDialog
        open={Boolean(viewService)}
        service={viewService}
        role={role}
        hasApplied={viewService && hasApplied(viewService.service_name)}
        onClose={() => setViewService(null)}
        onApply={handleApply} // for user
        onEdit={(updatedService) => {
          updateService(updatedService);
          setViewService(updatedService);
        }}
        onDelete={(serviceToDelete) => {
          deleteService(serviceToDelete.id);
          setViewService(null);
        }}
      />
    </Box>
  );
};

export default ServiceTab;
