// // import React, { useState, useMemo } from "react";
// // import { Box, Tabs, Tab, Button } from "@mui/material";

// // import { useAuth } from "../context/AuthContext";
// // import { useApp } from "../context/AppContext";

// // import ApplicationTable from "../components/application/ApplicationTable";
// // import ApplicationDetails from "../components/application/ApplicationDetails";
// // import AssignStaffDialog from "../components/application/AssignStaffDialog";
// // import ApplicationFilters from "../components/application/ApplicationFilters";

// // const ApplicationTab = () => {
// //   const { currentUser } = useAuth();
// //   const {
// //     applications,
// //     myApplications,
// //     staffApplications,
// //     staffList,
// //     assignStaff,
// //     updateApplication,
// //   } = useApp();

// //   const role = currentUser?.role;

// //   const baseData = useMemo(() => {
// //     if (role === "admin") return applications;
// //     if (role === "staff") return staffApplications;
// //     return myApplications;
// //   }, [role, applications, staffApplications, myApplications]);

// //   const [tab, setTab] = useState(0);
// //   const [selected, setSelected] = useState(null);
// //   const [remark, setRemark] = useState("");
// //   const [staffDialog, setStaffDialog] = useState(false);
// //   const [staffEmail, setStaffEmail] = useState("");

// //   /* ================= FILTER STATE ================= */

// //   const [filters, setFilters] = useState({
// //     service: "",
// //     status: "",
// //   });

// //   const filteredData = useMemo(() => {
// //     return baseData.filter(
// //       (a) =>
// //         (!filters.service || a.service === filters.service) &&
// //         (!filters.status || a.status === filters.status)
// //     );
// //   }, [baseData, filters]);

// //   if (!role) return null;

// //   /* ================= FILTER OPTIONS ================= */

// //   const filterOptions = [
// //     {
// //       name: "service",
// //       label: "Service",
// //       values: [...new Set(baseData.map((a) => a.service))],
// //     },
// //     {
// //       name: "status",
// //       label: "Status",
// //       values:
// //         role === "staff"
// //           ? ["under_review", "approved", "rejected"]
// //           : role === "admin"
// //           ? ["submitted", "under_review", "approved", "rejected", "forwarded"]
// //           : ["submitted", "under_review", "approved", "rejected"],
// //     },
// //   ];

// //   return (
// //     <Box>
// //       <Tabs value={tab} onChange={(e, v) => setTab(v)}>
// //         <Tab label="Applications" />
// //         <Tab label="Details" disabled={!selected} />
// //       </Tabs>

// //       {/* ================= LIST ================= */}

// //       {tab === 0 && (
// //         <>
// //           <ApplicationFilters
// //             filters={filters}
// //             setFilters={setFilters}
// //             options={filterOptions}
// //           />

// //           <ApplicationTable
// //             role={role}
// //             data={filteredData}
// //             onView={(app) => {
// //               setSelected(app);
// //               setTab(1);
// //             }}
// //           />
// //         </>
// //       )}

// //       {/* ================= DETAILS ================= */}

// //       {tab === 1 && (
// //         <>
// //           <ApplicationDetails
// //             application={selected}
// //             role={role}
// //             remark={remark}
// //             setRemark={setRemark}
// //           />

// //           <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
// //             {role === "admin" && (
// //               <Button variant="contained" onClick={() => setStaffDialog(true)}>
// //                 Assign Staff
// //               </Button>
// //             )}

// //             {role === "staff" && (
// //               <>
// //                 <Button
// //                   variant="contained"
// //                   color="success"
// //                   onClick={() =>
// //                     updateApplication(selected.id, {
// //                       status: "approved",
// //                       remark,
// //                     })
// //                   }
// //                 >
// //                   Approve
// //                 </Button>
// //                 <Button
// //                   variant="contained"
// //                   color="error"
// //                   onClick={() =>
// //                     updateApplication(selected.id, {
// //                       status: "rejected",
// //                       remark,
// //                     })
// //                   }
// //                 >
// //                   Reject
// //                 </Button>
// //               </>
// //             )}

// //             <Button variant="outlined" onClick={() => setTab(0)}>
// //               Back
// //             </Button>
// //           </Box>
// //         </>
// //       )}

// //       {/* ================= ASSIGN STAFF ================= */}

// //       {role === "admin" && (
// //         <AssignStaffDialog
// //           open={staffDialog}
// //           onClose={() => setStaffDialog(false)}
// //           staffList={staffList}
// //           staffEmail={staffEmail}
// //           setStaffEmail={setStaffEmail}
// //           onAssign={async () => {
// //             await assignStaff(selected.id, staffEmail);
// //             setStaffDialog(false);
// //             setTab(0);
// //           }}
// //         />
// //       )}
// //     </Box>
// //   );
// // };

// // export default ApplicationTab;

// import React, { useState, useMemo } from "react";
// import { Box, Tabs, Tab, Button, Typography } from "@mui/material";

// import { useAuth } from "../context/AuthContext";
// import { useApp } from "../context/AppContext";

// import ApplicationTable from "../components/application/ApplicationTable";
// import ApplicationDetails from "../components/application/ApplicationDetails";
// import AssignStaffDialog from "../components/application/AssignStaffDialog";
// import ApplicationFilters from "../components/application/ApplicationFilters";

// const ApplicationTab = () => {
//   const { currentUser } = useAuth();
//   const {
//     applications,
//     myApplications,
//     staffApplications,
//     staffList,
//     assignStaff,
//     updateApplication,
//   } = useApp();

//   const role = currentUser?.role;

//   const baseData = useMemo(() => {
//     if (role === "admin") return applications;
//     if (role === "staff") return staffApplications;
//     return myApplications;
//   }, [role, applications, staffApplications, myApplications]);

//   const [tab, setTab] = useState(0);
//   const [selected, setSelected] = useState(null);
//   const [remark, setRemark] = useState("");
//   const [staffDialog, setStaffDialog] = useState(false);
//   const [staffEmail, setStaffEmail] = useState("");

//   /* ================= FILTER STATE ================= */

//   const [filters, setFilters] = useState({
//     service: "",
//     status: "",
//   });

//   const filteredData = useMemo(() => {
//     return baseData.filter(
//       (a) =>
//         (!filters.service || a.service === filters.service) &&
//         (!filters.status || a.status === filters.status)
//     );
//   }, [baseData, filters]);

//   if (!role) return null;

//   /* ================= FILTER OPTIONS ================= */

//   const filterOptions = [
//     {
//       name: "service",
//       label: "Service",
//       values: [...new Set(baseData.map((a) => a.service))],
//     },
//     {
//       name: "status",
//       label: "Status",
//       values:
//         role === "staff"
//           ? ["under_review", "approved", "rejected"]
//           : role === "admin"
//           ? ["submitted", "under_review", "approved", "rejected", "forwarded"]
//           : ["submitted", "under_review", "approved", "rejected"],
//     },
//   ];

//   /* ================= DOWNLOAD FUNCTION ================= */

//   const downloadDocument = async (fileName) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/files/${fileName}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // Firebase token
//         },
//       });
//       if (!res.ok) throw new Error("Failed to download file");

//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", fileName);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error("Download failed:", err);
//     }
//   };

//   return (
//     <Box>
//       <Tabs value={tab} onChange={(e, v) => setTab(v)}>
//         <Tab label="Applications" />
//         <Tab label="Details" disabled={!selected} />
//       </Tabs>

//       {/* ================= LIST ================= */}

//       {tab === 0 && (
//         <>
//           <ApplicationFilters
//             filters={filters}
//             setFilters={setFilters}
//             options={filterOptions}
//           />

//           <ApplicationTable
//             role={role}
//             data={filteredData}
//             onView={(app) => {
//               setSelected(app);
//               setTab(1);
//             }}
//           />
//         </>
//       )}

//       {/* ================= DETAILS ================= */}

//       {tab === 1 && selected && (
//         <>
//           <ApplicationDetails
//             application={selected}
//             role={role}
//             remark={remark}
//             setRemark={setRemark}
//             // Render document download buttons
//             extraActions={
//               role === "staff" &&
//               selected.documents?.map((doc) => (
//                 <Button
//                   key={doc.fileName}
//                   variant="outlined"
//                   size="small"
//                   sx={{ mt: 1, mr: 1 }}
//                   onClick={() => downloadDocument(doc.fileName)}
//                 >
//                   Download {doc.documentName}
//                 </Button>
//               ))
//             }
//           />

//           <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
//             {role === "admin" && (
//               <Button variant="contained" onClick={() => setStaffDialog(true)}>
//                 Assign Staff
//               </Button>
//             )}

//             {role === "staff" && (
//               <>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   onClick={() =>
//                     updateApplication(selected.id, {
//                       status: "approved",
//                       remark,
//                     })
//                   }
//                 >
//                   Approve
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={() =>
//                     updateApplication(selected.id, {
//                       status: "rejected",
//                       remark,
//                     })
//                   }
//                 >
//                   Reject
//                 </Button>
//               </>
//             )}

//             <Button variant="outlined" onClick={() => setTab(0)}>
//               Back
//             </Button>
//           </Box>
//         </>
//       )}

//       {/* ================= ASSIGN STAFF ================= */}

//       {role === "admin" && (
//         <AssignStaffDialog
//           open={staffDialog}
//           onClose={() => setStaffDialog(false)}
//           staffList={staffList}
//           staffEmail={staffEmail}
//           setStaffEmail={setStaffEmail}
//           onAssign={async () => {
//             await assignStaff(selected.id, staffEmail);
//             setStaffDialog(false);
//             setTab(0);
//           }}
//         />
//       )}
//     </Box>
//   );
// };

// export default ApplicationTab;

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
    myApplications,
    staffApplications,
    applications,
    staffList,
    assignStaff,
    updateApplication,
    downloadFile,
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

  const [filters, setFilters] = useState({ service: "", status: "" });

  const filteredData = useMemo(
    () =>
      baseData.filter(
        (a) =>
          (!filters.service || a.service === filters.service) &&
          (!filters.status || a.status === filters.status)
      ),
    [baseData, filters]
  );

  if (!role) return null;

  const filterOptions = [
    {
      name: "service",
      label: "Service",
      values: [...new Set(baseData.map((a) => a.service))],
    },
    {
      name: "status",
      label: "Status",
      values:
        role === "staff"
          ? ["under_review", "approved", "rejected"]
          : role === "admin"
          ? ["submitted", "under_review", "approved", "rejected", "forwarded"]
          : ["submitted", "under_review", "approved", "rejected"],
    },
  ];

  const handleUpdate = async (status) => {
    await updateApplication(selected.id, { status, remark });
    setSelected(null);
    setRemark("");
    setTab(0);
  };

  const handleBack = () => {
    setSelected(null);
    setRemark("");
    setTab(0);
  };

  // const handleDownload = async (fileName) => {
  //   try {
  //     await downloadFile(fileName);
  //   } catch (err) {
  //     console.error("Download error:", err);
  //   }
  // };

  const handleDownload = async (fileName) => {
    try {
      setLoading(true); // show loading state

      // 🔑 download the file
      await downloadFile(selectedApplicationId, fileName);

      setLoading(false); // hide loading state
      alert("File downloaded successfully!");
    } catch (err) {
      console.error("Error downloading file:", err);
      setError(err.message); // display error to user
      setLoading(false);
    }
  };

  return (
    <Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Applications" />
        <Tab label="Details" disabled={!selected} />
      </Tabs>

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

      {tab === 1 && selected && (
        <>
          <ApplicationDetails
            application={selected}
            role={role}
            remark={remark}
            setRemark={setRemark}
            extraActions={selected.documents?.map((doc) => (
              <Button
                key={doc.fileName}
                variant="outlined"
                size="small"
                sx={{ mt: 1, mr: 1 }}
                onClick={() => handleDownload(doc.fileName)}
              >
                Download {doc.documentName}
              </Button>
            ))}
          />

          {/* Display staff remark if available */}
          {selected.staffRemark && (
            <Box sx={{ mt: 2 }}>
              <strong>Staff Remark:</strong> {selected.staffRemark}
            </Box>
          )}

          <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            {role === "admin" && (
              <Button variant="contained" onClick={() => setStaffDialog(true)}>
                Assign Staff
              </Button>
            )}

            {role === "staff" && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleUpdate("approved")}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleUpdate("rejected")}
                >
                  Reject
                </Button>
              </>
            )}

            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
          </Box>
        </>
      )}

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
            handleBack();
          }}
        />
      )}
    </Box>
  );
};

export default ApplicationTab;
