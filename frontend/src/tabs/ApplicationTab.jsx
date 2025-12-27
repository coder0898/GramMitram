import React, { useState, useMemo } from "react";
import { Box, Tabs, Tab, Button } from "@mui/material";

import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

import ApplicationTable from "../components/application/ApplicationTable";
import ApplicationDetails from "../components/application/ApplicationDetails";
import AssignStaffDialog from "../components/application/AssignStaffDialog";
import ApplicationFilters from "../components/application/ApplicationFilters";

const ApplicationTab = () => {
  const { currentUser } = useAuth();
  const {
    applications,
    myApplications,
    staffApplications,
    staffList,
    assignStaff,
    updateApplication,
  } = useApp();

  const role = currentUser?.role;

  const baseData = useMemo(() => {
    if (role === "admin") return applications;
    if (role === "staff") return staffApplications;
    return myApplications;
  }, [role, applications, staffApplications, myApplications]);

  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");
  const [staffDialog, setStaffDialog] = useState(false);
  const [staffEmail, setStaffEmail] = useState("");

  /* ================= FILTER STATE ================= */

  const [filters, setFilters] = useState({
    service: "",
    status: "",
  });

  const filteredData = useMemo(() => {
    return baseData.filter(
      (a) =>
        (!filters.service || a.service === filters.service) &&
        (!filters.status || a.status === filters.status)
    );
  }, [baseData, filters]);

  if (!role) return null;

  /* ================= FILTER OPTIONS ================= */

  const filterOptions = [
    {
      name: "service",
      label: "Service",
      values: [...new Set(baseData.map((a) => a.service))],
    },
    {
      name: "status",
      label: "Status",
      values: [
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "forwarded",
      ],
    },
  ];

  return (
    <Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Applications" />
        <Tab label="Details" disabled={!selected} />
      </Tabs>

      {/* ================= LIST ================= */}

      {tab === 0 && (
        <>
          <ApplicationFilters
            filters={filters}
            setFilters={setFilters}
            options={filterOptions}
          />

          <ApplicationTable
            role={role}
            data={filteredData}
            onView={(app) => {
              setSelected(app);
              setTab(1);
            }}
          />
        </>
      )}

      {/* ================= DETAILS ================= */}

      {tab === 1 && (
        <>
          <ApplicationDetails
            application={selected}
            role={role}
            remark={remark}
            setRemark={setRemark}
          />

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            {role === "admin" && (
              <Button variant="contained" onClick={() => setStaffDialog(true)}>
                Assign Staff
              </Button>
            )}

            {role === "staff" && (
              <Button
                variant="contained"
                onClick={() =>
                  updateApplication(selected.id, {
                    status: "forwarded",
                    remark,
                  })
                }
              >
                Forward
              </Button>
            )}

            <Button variant="outlined" onClick={() => setTab(0)}>
              Back
            </Button>
          </Box>
        </>
      )}

      {/* ================= ASSIGN STAFF ================= */}

      {role === "admin" && (
        <AssignStaffDialog
          open={staffDialog}
          onClose={() => setStaffDialog(false)}
          staffList={staffList}
          staffEmail={staffEmail}
          setStaffEmail={setStaffEmail}
          onAssign={async () => {
            await assignStaff(selected.id, staffEmail);
            setStaffDialog(false);
            setTab(0);
          }}
        />
      )}
    </Box>
  );
};

export default ApplicationTab;
