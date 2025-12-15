import React from "react";
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
} from "@mui/material";
import { useState } from "react";

const ApplicationTab = () => {
  return (
    <>
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
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Service</InputLabel>
                <Select
                  value={service}
                  label="Service"
                  onChange={(e) => setService(e.target.value)}
                >
                  <MenuItem value="water">Water Supply</MenuItem>
                  <MenuItem value="electricity">Electricity</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="review">Under Review</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* TABLE */}
            <table border="1" width="100%">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Applicant Name</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
                  <th>Submitted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>APP001</td>
                  <td>Ravi Kumar</td>
                  <td>Water Supply</td>
                  <td>Submitted</td>
                  <td>—</td>
                  <td>12-09-2025</td>
                  <td>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedApplication("APP001");
                        setTab(1);
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        )}

        {/* ================= TAB 2: APPLICATION DETAILS ================= */}
        {tab === 1 && selectedApplication && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Application Details ({selectedApplication})
            </Typography>

            {/* DETAILS */}
            <Box sx={{ mb: 2 }}>
              <Typography>
                <b>Applicant Name:</b> Ravi Kumar
              </Typography>
              <Typography>
                <b>Service:</b> Water Supply
              </Typography>
              <Typography>
                <b>Status:</b> Under Review
              </Typography>
            </Box>

            {/* DOCUMENTS */}
            <Typography variant="subtitle1">Uploaded Documents</Typography>
            <ul>
              <li>Aadhaar Card</li>
              <li>Electricity Bill</li>
            </ul>

            {/* REMARKS */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Staff Remarks"
              sx={{ my: 2 }}
            />

            {/* ACTION BUTTONS */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained">Assign Staff</Button>
              <Button variant="contained" color="success">
                Approve
              </Button>
              <Button variant="contained" color="error">
                Reject
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ApplicationTab;
