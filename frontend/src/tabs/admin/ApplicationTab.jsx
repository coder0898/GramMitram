import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAdmin } from "../../context/AdminContext";

const ApplicationTab = () => {
  const {
    staffList,
    selectedApplication,
    setSelectedApplication,
    assignStaff,
    approveApplication,
    rejectApplication,
    filterApplications,
  } = useAdmin();

  const [tab, setTab] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const filteredApplications = filterApplications(categoryFilter, statusFilter);

  const handleAssignStaff = () => {
    if (!selectedStaff) return;
    assignStaff(selectedApplication.id, selectedStaff.username);
    setStaffModalOpen(false);
    setSelectedStaff(null);
    setTab(0);
  };

  const handleAction = () => {
    if (!selectedApplication.remarks?.trim()) {
      alert("Please add remarks before proceeding.");
      return;
    }

    actionType === "approve"
      ? approveApplication(selectedApplication.id, selectedApplication.remarks)
      : rejectApplication(selectedApplication.id, selectedApplication.remarks);

    setActionModalOpen(false);
    setSelectedApplication(null);
    setTab(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="All Applications" />
        <Tab label="Application Details" disabled={!selectedApplication} />
      </Tabs>

      {/* TAB 0 */}
      {tab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">View All Applications</Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
                  <TableRow key={app.id} hover>
                    <TableCell>{app.id}</TableCell>
                    <TableCell>{app.applicantName}</TableCell>
                    <TableCell>{app.service}</TableCell>
                    <TableCell>{app.status}</TableCell>
                    <TableCell>{app.staff || "—"}</TableCell>
                    <TableCell>{app.submittedDate}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={app.disableView}
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

      {/* TAB 1 */}
      {tab === 1 && selectedApplication && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            Application Details ({selectedApplication.id})
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Staff Remarks"
            sx={{ my: 2 }}
            value={selectedApplication.remarks || ""}
            onChange={(e) =>
              setSelectedApplication({
                ...selectedApplication,
                remarks: e.target.value,
              })
            }
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={() => setStaffModalOpen(true)}>
              Assign Staff
            </Button>
            <Button
              color="success"
              variant="contained"
              onClick={() => {
                setActionType("approve");
                setActionModalOpen(true);
              }}
            >
              Approve
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                setActionType("reject");
                setActionModalOpen(true);
              }}
            >
              Reject
            </Button>
          </Box>
        </Box>
      )}

      {/* STAFF MODAL */}
      <Dialog open={staffModalOpen} onClose={() => setStaffModalOpen(false)}>
        <DialogTitle>Assign Staff</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Staff</InputLabel>
            <Select
              value={selectedStaff?.username || ""}
              onChange={(e) =>
                setSelectedStaff(
                  staffList.find((s) => s.username === e.target.value)
                )
              }
            >
              {staffList.map((s) => (
                <MenuItem key={s.username} value={s.username}>
                  {s.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStaffModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssignStaff}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* ACTION MODAL */}
      <Dialog open={actionModalOpen} onClose={() => setActionModalOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
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
