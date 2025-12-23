// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Chip,
//   Tab,
//   Tabs,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
// } from "@mui/material";
// import { useUser } from "../../context/UserContext";

// const ApplicationTab = () => {
//   const { applications } = useUser(); // Sync with UserContext
//   const [tab, setTab] = useState(0);
//   const [selectedApplication, setSelectedApplication] = useState(null);

//   return (
//     <Box sx={{ width: "100%" }}>
//       {/* Tabs */}
//       <Tabs value={tab} onChange={(e, v) => setTab(v)}>
//         <Tab label="My Applications" />
//         <Tab label="Application Details" disabled={!selectedApplication} />
//       </Tabs>

//       {/* TAB 0: My Applications */}
//       {tab === 0 && (
//         <Box sx={{ mt: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             My Applications
//           </Typography>

//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead sx={{ backgroundColor: "primary.main" }}>
//                 <TableRow>
//                   <TableCell sx={{ color: "#fff" }}>Application ID</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Service</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Status</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Submitted Date</TableCell>
//                   <TableCell sx={{ color: "#fff" }}>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {applications.length > 0 ? (
//                   applications.map((app) => (
//                     <TableRow key={app.id} hover>
//                       <TableCell>{app.id}</TableCell>
//                       <TableCell>{app.service_name}</TableCell>
//                       <TableCell
//                         sx={{
//                           color:
//                             app.status === "Approved"
//                               ? "success.main"
//                               : app.status === "Rejected"
//                               ? "error.main"
//                               : "warning.main",
//                           fontWeight: 500,
//                         }}
//                       >
//                         {app.status}
//                       </TableCell>
//                       <TableCell>{app.submittedAt}</TableCell>
//                       <TableCell>
//                         <Button
//                           size="small"
//                           variant="contained"
//                           onClick={() => {
//                             setSelectedApplication(app);
//                             setTab(1);
//                           }}
//                         >
//                           View
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={5} align="center">
//                       No applications found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       )}

//       {/* TAB 1: Application Details */}
//       {tab === 1 && selectedApplication && (
//         <Box sx={{ mt: 3 }}>
//           <Typography variant="h6">
//             Application Details ({selectedApplication.id})
//           </Typography>

//           <Typography sx={{ mt: 1 }}>
//             <b>Service:</b> {selectedApplication.service_name}
//           </Typography>
//           <Typography sx={{ mt: 1 }}>
//             <b>Status:</b> {selectedApplication.status}
//           </Typography>
//           <Typography sx={{ mt: 1 }}>
//             <b>Submitted Date:</b> {selectedApplication.submittedAt}
//           </Typography>

//           {/* <Typography variant="subtitle1" sx={{ mt: 2 }}>
//             Uploaded Documents
//           </Typography>
//           <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
//             {selectedApplication.documents?.map((doc, i) => (
//               <Chip key={i} label={doc} size="small" />
//             ))}
//           </Box> */}
//           <Typography variant="subtitle1" sx={{ mt: 2 }}>
//             Uploaded Documents
//           </Typography>

//           <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
//             {selectedApplication.documents?.length > 0 ? (
//               selectedApplication.documents.map((doc, i) => (
//                 <Chip
//                   key={i}
//                   label={`${doc.documentName} (${doc.fileName})`}
//                   size="small"
//                 />
//               ))
//             ) : (
//               <Typography variant="body2">No documents uploaded</Typography>
//             )}
//           </Box>

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
//     </Box>
//   );
// };

// export default ApplicationTab;

import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useUser } from "../../context/UserContext";

const ApplicationTab = () => {
  const { applications } = useUser();
  const [tab, setTab] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tabs */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="My Applications" />
        <Tab label="Application Details" disabled={!selectedApplication} />
      </Tabs>

      {/* TAB 0: My Applications */}
      {tab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            My Applications
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>Application ID</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Service</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Submitted Date</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <TableRow key={app.id} hover>
                      <TableCell>{app.id}</TableCell>
                      <TableCell>{app.serviceName}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            app.status === "Approved"
                              ? "success.main"
                              : app.status === "Rejected"
                              ? "error.main"
                              : "warning.main",
                          fontWeight: 500,
                        }}
                      >
                        {app.status}
                      </TableCell>
                      <TableCell>{app.submittedAt}</TableCell>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* TAB 1: Application Details */}
      {tab === 1 && selectedApplication && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            Application Details ({selectedApplication.id})
          </Typography>

          <Typography sx={{ mt: 1 }}>
            <b>Service:</b> {selectedApplication.serviceName}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <b>Status:</b> {selectedApplication.status}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <b>Submitted Date:</b> {selectedApplication.submittedAt}
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Uploaded Documents
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 1 }}>
            {selectedApplication.documents?.length > 0 ? (
              selectedApplication.documents.map((doc, i) => (
                <Chip
                  key={i}
                  label={`${doc.documentName} (${doc.fileName})`}
                  size="small"
                />
              ))
            ) : (
              <Typography variant="body2">No documents uploaded</Typography>
            )}
          </Box>

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
    </Box>
  );
};

export default ApplicationTab;
