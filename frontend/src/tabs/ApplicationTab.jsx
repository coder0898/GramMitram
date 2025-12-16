import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const ApplicationTab = () => {
  const [tab, setTab] = useState(0);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [applications, setApplications] = useState([
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
  ]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Staff modal state
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Approve/Reject modal
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"

  // Fetch staff from signupDetails in localStorage
  useEffect(() => {
    const signupDetails =
      JSON.parse(localStorage.getItem("signupDetails")) || [];
    const staff = signupDetails.filter((user) => user.role === "staff");
    setStaffList(staff);
  }, []);

  const filteredApplications = applications.filter(
    (app) =>
      (category
        ? app.service.toLowerCase() === category.toLowerCase()
        : true) &&
      (status ? app.status.toLowerCase() === status.toLowerCase() : true)
  );

  const handleView = (app) => {
    setSelectedApplication(app);
    setTab(1);
  };

  // Assign staff handler
  const handleAssignStaff = () => {
    if (!selectedStaff) return;
    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApplication.id
          ? { ...app, staff: selectedStaff.username, disableView: false }
          : app
      )
    );
    setSelectedApplication({
      ...selectedApplication,
      staff: selectedStaff.username,
    });
    setStaffModalOpen(false);
    setSelectedStaff(null);
    setTab(0); // Go back to table
  };

  // Approve/Reject handler
  const handleAction = () => {
    if (!selectedApplication.remarks) {
      alert("Please add remarks before proceeding.");
      return;
    }

    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApplication.id
          ? {
              ...app,
              status: actionType === "approve" ? "approved" : "rejected",
              staff: "Admin", // You can replace with actual admin name
              disableView: true, // disable view button
            }
          : app
      )
    );
    setSelectedApplication(null);
    setActionModalOpen(false);
    setTab(0); // Go back to table
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* SUB TABS */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="All Applications" />
        <Tab label="Application Details" disabled={!selectedApplication} />
      </Tabs>

      {/* ================= TAB 1: ALL APPLICATIONS ================= */}
      {tab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            View All Applications
          </Typography>

          {/* FILTERS */}
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="agriculture">Agriculture</MenuItem>
                <MenuItem value="essential">Essential</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
                <MenuItem value="health">Health</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="review">Under Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* TABLE */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>Application ID</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Applicant Name</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Service</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Assigned Staff</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Submitted Date</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.id}</TableCell>
                    <TableCell>{app.applicantName}</TableCell>
                    <TableCell>{app.service}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          app.status === "approved"
                            ? "success.main"
                            : app.status === "rejected"
                            ? "error.main"
                            : "warning.main",
                      }}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </TableCell>
                    <TableCell>{app.staff || "—"}</TableCell>
                    <TableCell>{app.submittedDate}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={app.disableView}
                        onClick={() => handleView(app)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredApplications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ================= TAB 2: APPLICATION DETAILS ================= */}
      {tab === 1 && selectedApplication && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Application Details ({selectedApplication.id})
          </Typography>

          {/* DETAILS */}
          <Box sx={{ mb: 2 }}>
            <Typography>
              <b>Applicant Name:</b> {selectedApplication.applicantName}
            </Typography>
            <Typography>
              <b>Service:</b> {selectedApplication.service}
            </Typography>
            <Typography>
              <b>Status:</b>{" "}
              {selectedApplication.status.charAt(0).toUpperCase() +
                selectedApplication.status.slice(1)}
            </Typography>
          </Box>

          {/* DOCUMENTS */}
          <Typography variant="subtitle1">Uploaded Documents</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
            {selectedApplication.documents.map((doc, index) => (
              <Chip key={index} label={doc} size="small" />
            ))}
          </Box>

          {/* REMARKS */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Staff Remarks"
            sx={{ my: 2 }}
            value={selectedApplication.remarks}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                remarks: e.target.value,
              })
            }
          />

          {/* ACTION BUTTONS */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={() => setStaffModalOpen(true)}>
              Assign Staff
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setActionType("approve");
                setActionModalOpen(true);
              }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setActionType("reject");
                setActionModalOpen(true);
              }}
            >
              Reject
            </Button>
          </Box>

          {/* BACK BUTTON */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedApplication(null);
                setTab(0);
              }}
            >
              Back to Applications
            </Button>
          </Box>
        </Box>
      )}

      {/* ====== STAFF ASSIGN MODAL ====== */}
      <Dialog open={staffModalOpen} onClose={() => setStaffModalOpen(false)}>
        <DialogTitle>Assign Staff</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Staff</InputLabel>
            <Select
              value={selectedStaff?.username || ""}
              onChange={(e) => {
                const staff = staffList.find(
                  (s) => s.username === e.target.value
                );
                setSelectedStaff(staff);
              }}
            >
              {staffList.map((staff) => (
                <MenuItem key={staff.username} value={staff.username}>
                  {staff.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStaffModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignStaff} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* ====== APPROVE/REJECT CONFIRM MODAL ====== */}
      <Dialog open={actionModalOpen} onClose={() => setActionModalOpen(false)}>
        <DialogTitle>
          Confirm {actionType === "approve" ? "Approve" : "Reject"} Application
        </DialogTitle>
        <DialogContent>
          Are you sure you want to {actionType} this application?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAction}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationTab;
