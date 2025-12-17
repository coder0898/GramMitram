// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Chip,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Tab,
//   Tabs,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Typography,
// } from "@mui/material";

// const ApplicationTab = () => {
//   const [tab, setTab] = useState(0); // Main tab index
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [applications, setApplications] = useState([]);
//   const [selectedApplication, setSelectedApplication] = useState(null);

//   // Staff assignment modal
//   const [staffModalOpen, setStaffModalOpen] = useState(false);
//   const [staffList, setStaffList] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState(null);

//   // Approve/Reject modal
//   const [actionModalOpen, setActionModalOpen] = useState(false);
//   const [actionType, setActionType] = useState(""); // "approve" or "reject"

//   // Load initial applications from localStorage or default
//   useEffect(() => {
//     const storedApplications = JSON.parse(
//       localStorage.getItem("Applications")
//     ) || [
//       {
//         id: "APP001",
//         applicantName: "Ravi Kumar",
//         service: "Water Supply",
//         status: "submitted",
//         staff: "",
//         submittedDate: "12-09-2025",
//         documents: ["Aadhaar Card", "Electricity Bill"],
//         remarks: "",
//         disableView: false,
//       },
//     ];
//     setApplications(storedApplications);
//   }, []);

//   // Load staff from signupDetails in localStorage
//   useEffect(() => {
//     const signupDetails =
//       JSON.parse(localStorage.getItem("signupDetails")) || [];
//     const staff = signupDetails.filter((user) => user.role === "staff");
//     setStaffList(staff);
//   }, []);

//   // Filter applications
//   const filteredApplications = applications.filter(
//     (app) =>
//       (categoryFilter
//         ? app.service.toLowerCase() === categoryFilter.toLowerCase()
//         : true) &&
//       (statusFilter
//         ? app.status.toLowerCase() === statusFilter.toLowerCase()
//         : true)
//   );

//   // View application details
//   const handleView = (app) => {
//     setSelectedApplication(app);
//     setTab(1);
//   };

//   // Assign staff to application
//   const handleAssignStaff = () => {
//     if (!selectedStaff) return;

//     const updatedApps = applications.map((app) =>
//       app.id === selectedApplication.id
//         ? { ...app, staff: selectedStaff.username, disableView: false }
//         : app
//     );

//     setApplications(updatedApps);
//     localStorage.setItem("Applications", JSON.stringify(updatedApps));
//     setSelectedApplication({
//       ...selectedApplication,
//       staff: selectedStaff.username,
//     });
//     setSelectedStaff(null);
//     setStaffModalOpen(false);
//     setTab(0);
//   };

//   // Approve or reject application
//   const handleAction = () => {
//     if (!selectedApplication.remarks.trim()) {
//       alert("Please add remarks before proceeding.");
//       return;
//     }

//     const updatedApps = applications.map((app) =>
//       app.id === selectedApplication.id
//         ? {
//             ...app,
//             status: actionType === "approve" ? "approved" : "rejected",
//             staff: "Admin",
//             disableView: true,
//           }
//         : app
//     );

//     setApplications(updatedApps);
//     localStorage.setItem("Applications", JSON.stringify(updatedApps));
//     setSelectedApplication(null);
//     setActionModalOpen(false);
//     setTab(0);
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       {/* Main Tabs */}
//       <Tabs
//         value={tab}
//         onChange={(e, newValue) => setTab(newValue)}
//         sx={{ borderBottom: 1, borderColor: "divider" }}
//       >
//         <Tab label="All Applications" />
//         <Tab label="Application Details" disabled={!selectedApplication} />
//       </Tabs>

//       {/* ================= TAB 0: All Applications ================= */}
//       {tab === 0 && (
//         <Box sx={{ mt: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             View All Applications
//           </Typography>

//           {/* Filters */}
//           <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
//             <FormControl sx={{ minWidth: 200 }}>
//               <InputLabel>Category</InputLabel>
//               <Select
//                 value={categoryFilter}
//                 label="Category"
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//               >
//                 <MenuItem value="">All Categories</MenuItem>
//                 <MenuItem value="agriculture">Agriculture</MenuItem>
//                 <MenuItem value="essential">Essential</MenuItem>
//                 <MenuItem value="finance">Finance</MenuItem>
//                 <MenuItem value="health">Health</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl sx={{ minWidth: 200 }}>
//               <InputLabel>Status</InputLabel>
//               <Select
//                 value={statusFilter}
//                 label="Status"
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <MenuItem value="">All Status</MenuItem>
//                 <MenuItem value="submitted">Submitted</MenuItem>
//                 <MenuItem value="review">Under Review</MenuItem>
//                 <MenuItem value="approved">Approved</MenuItem>
//                 <MenuItem value="rejected">Rejected</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           {/* Applications Table */}
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead sx={{ backgroundColor: "primary.main" }}>
//                 <TableRow>
//                   <TableCell sx={{ color: "#fff" }}>Application ID</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Applicant Name</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Service</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Status</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Assigned Staff</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Submitted Date</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredApplications.length > 0 ? (
//                   filteredApplications.map((app) => (
//                     <TableRow key={app.id} hover>
//                       <TableCell>{app.id}</TableCell>
//                       <TableCell>{app.applicantName}</TableCell>
//                       <TableCell>{app.service}</TableCell>
//                       <TableCell
//                         sx={{
//                           color:
//                             app.status === "approved"
//                               ? "success.main"
//                               : app.status === "rejected"
//                               ? "error.main"
//                               : "warning.main",
//                           fontWeight: 500,
//                         }}
//                       >
//                         {app.status.charAt(0).toUpperCase() +
//                           app.status.slice(1)}
//                       </TableCell>
//                       <TableCell>{app.staff || "—"}</TableCell>
//                       <TableCell>{app.submittedDate}</TableCell>
//                       <TableCell>
//                         <Button
//                           size="small"
//                           variant="contained"
//                           disabled={app.disableView}
//                           onClick={() => handleView(app)}
//                         >
//                           View
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7} align="center">
//                       No applications found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       )}

//       {/* ================= TAB 1: Application Details ================= */}
//       {tab === 1 && selectedApplication && (
//         <Box sx={{ mt: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             Application Details ({selectedApplication.id})
//           </Typography>

//           {/* Application Info */}
//           <Box sx={{ mb: 2 }}>
//             <Typography>
//               <b>Applicant Name:</b> {selectedApplication.applicantName}
//             </Typography>
//             <Typography>
//               <b>Service:</b> {selectedApplication.service}
//             </Typography>
//             <Typography>
//               <b>Status:</b>{" "}
//               {selectedApplication.status.charAt(0).toUpperCase() +
//                 selectedApplication.status.slice(1)}
//             </Typography>
//             <Typography>
//               <b>Assigned Staff:</b> {selectedApplication.staff || "—"}
//             </Typography>
//           </Box>

//           {/* Uploaded Documents */}
//           <Typography variant="subtitle1">Uploaded Documents</Typography>
//           <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
//             {selectedApplication.documents.map((doc, index) => (
//               <Chip key={index} label={doc} size="small" />
//             ))}
//           </Box>

//           {/* Staff Remarks */}
//           <TextField
//             fullWidth
//             multiline
//             rows={3}
//             label="Staff Remarks"
//             sx={{ my: 2 }}
//             value={selectedApplication.remarks}
//             onChange={(e) =>
//               setSelectedApplication({
//                 ...selectedApplication,
//                 remarks: e.target.value,
//               })
//             }
//           />

//           {/* Action Buttons */}
//           <Box sx={{ display: "flex", gap: 2 }}>
//             <Button variant="contained" onClick={() => setStaffModalOpen(true)}>
//               Assign Staff
//             </Button>
//             <Button
//               variant="contained"
//               color="success"
//               onClick={() => {
//                 setActionType("approve");
//                 setActionModalOpen(true);
//               }}
//             >
//               Approve
//             </Button>
//             <Button
//               variant="contained"
//               color="error"
//               onClick={() => {
//                 setActionType("reject");
//                 setActionModalOpen(true);
//               }}
//             >
//               Reject
//             </Button>
//           </Box>

//           {/* Back Button */}
//           <Box sx={{ mt: 3 }}>
//             <Button
//               variant="outlined"
//               onClick={() => {
//                 setSelectedApplication(null);
//                 setTab(0);
//               }}
//             >
//               Back to Applications
//             </Button>
//           </Box>
//         </Box>
//       )}

//       {/* ================= Staff Assignment Modal ================= */}
//       <Dialog open={staffModalOpen} onClose={() => setStaffModalOpen(false)}>
//         <DialogTitle>Assign Staff</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth>
//             <InputLabel>Staff</InputLabel>
//             <Select
//               value={selectedStaff?.username || ""}
//               onChange={(e) => {
//                 const staff = staffList.find(
//                   (s) => s.username === e.target.value
//                 );
//                 setSelectedStaff(staff);
//               }}
//             >
//               {staffList.map((staff) => (
//                 <MenuItem key={staff.username} value={staff.username}>
//                   {staff.username}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setStaffModalOpen(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleAssignStaff}>
//             Assign
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* ================= Approve/Reject Modal ================= */}
//       <Dialog open={actionModalOpen} onClose={() => setActionModalOpen(false)}>
//         <DialogTitle>
//           Confirm {actionType === "approve" ? "Approve" : "Reject"} Application
//         </DialogTitle>
//         <DialogContent>
//           Are you sure you want to {actionType} this application?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setActionModalOpen(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handleAction}>
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ApplicationTab;

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
