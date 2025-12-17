import React, { useState } from "react";
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
import { useStaff } from "../../context/StaffContext";

const ApplicationTab = () => {
  const {
    filteredApplications,
    selectedApplication,
    setSelectedApplication,
    serviceFilter,
    setServiceFilter,
    statusFilter,
    setStatusFilter,
    updateApplicationStatus,
  } = useStaff();

  const [tab, setTab] = useState(0);
  const [remark, setRemark] = useState("");

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Assigned Applications" />
        <Tab label="Application Details" disabled={!selectedApplication} />
      </Tabs>

      {tab === 0 && (
        <Box sx={{ mt: 3 }}>
          {/* Filters */}
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

          {/* Table */}
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
                      <Chip label={app.status.replace("_", " ")} size="small" />
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

      {tab === 1 && selectedApplication && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            Application Details – {selectedApplication.id}
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Verification Remarks"
            sx={{ mt: 3 }}
            onChange={(e) => setRemark(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            {selectedApplication.status === "submitted" && (
              <Button
                variant="contained"
                onClick={() => updateApplicationStatus("under_review", remark)}
              >
                Mark Under Review
              </Button>
            )}

            {selectedApplication.status === "under_review" && (
              <Button
                variant="contained"
                color="success"
                onClick={() => updateApplicationStatus("forwarded", remark)}
              >
                Forward to Officer
              </Button>
            )}

            <Button variant="outlined" onClick={() => setTab(0)}>
              Back
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ApplicationTab;
