import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ApplicationTab = () => {
  const [tab, setTab] = useState(0);
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [applications, setApplications] = useState([
    {
      id: "APP001",
      applicantName: "Ravi Kumar",
      service: "Water Supply",
      submittedDate: "2025-09-12",
      status: "submitted",
      documents: ["Aadhaar Card", "Electricity Bill"],
      remarksHistory: [],
    },
  ]);

  /* FILTER LOGIC */
  const filteredApplications = applications.filter(
    (app) =>
      (serviceFilter ? app.service === serviceFilter : true) &&
      (statusFilter ? app.status === statusFilter : true)
  );

  /* STATUS UPDATE */
  const updateStatus = (nextStatus) => {
    const updated = applications.map((app) =>
      app.id === selectedApplication.id
        ? {
            ...app,
            status: nextStatus,
            remarksHistory: [
              ...app.remarksHistory,
              {
                remark: selectedApplication.currentRemark,
                date: new Date().toLocaleString(),
                status: nextStatus,
              },
            ],
          }
        : app
    );

    setApplications(updated);
    setSelectedApplication(null);
    setTab(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* SUB TABS */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Assigned Applications" />
        <Tab label="Application Details" disabled={!selectedApplication} />
      </Tabs>

      {/* ================= SUB TAB 3.1 ================= */}
      {tab === 0 && (
        <Box sx={{ mt: 3 }}>
          {/* FILTERS */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Service</InputLabel>
              <Select
                value={serviceFilter}
                label="Service"
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Water Supply">Water Supply</MenuItem>
                <MenuItem value="Electricity">Electricity</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="forwarded">Forwarded</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* TABLE */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>Application ID</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Applicant</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Service</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Submitted Date</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell>{app.id}</TableCell>
                    <TableCell>{app.applicantName}</TableCell>
                    <TableCell>{app.service}</TableCell>
                    <TableCell>{app.submittedDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.status.replace("_", " ")}
                        color={
                          app.status === "submitted"
                            ? "warning"
                            : app.status === "under_review"
                            ? "info"
                            : "success"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          setSelectedApplication(app);
                          setTab(1);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ================= SUB TAB 3.2 ================= */}
      {tab === 1 && selectedApplication && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Application Details – {selectedApplication.id}
          </Typography>

          <Typography>
            <b>Applicant:</b> {selectedApplication.applicantName}
          </Typography>
          <Typography>
            <b>Service:</b> {selectedApplication.service}
          </Typography>
          <Typography>
            <b>Status:</b> {selectedApplication.status}
          </Typography>

          {/* DOCUMENTS */}
          <Typography sx={{ mt: 2 }}>
            <b>Uploaded Documents</b>
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            {selectedApplication.documents.map((doc, i) => (
              <Chip key={i} label={doc} />
            ))}
          </Box>

          {/* REMARKS */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Verification Remarks"
            sx={{ mt: 3 }}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                currentRemark: e.target.value,
              })
            }
          />

          {/* ACTIONS */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            {selectedApplication.status === "submitted" && (
              <Button
                variant="contained"
                onClick={() => updateStatus("under_review")}
              >
                Mark Under Review
              </Button>
            )}

            {selectedApplication.status === "under_review" && (
              <Button
                variant="contained"
                color="success"
                onClick={() => updateStatus("forwarded")}
              >
                Forward to Officer
              </Button>
            )}

            <Button
              variant="outlined"
              onClick={() => {
                setSelectedApplication(null);
                setTab(0);
              }}
            >
              Back
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ApplicationTab;
