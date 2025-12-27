// import { Box, Typography, TextField, Button } from "@mui/material";

// const ApplicationDetails = ({ application, role, remark, setRemark }) => {
//   if (!application) return null;

//   return (
//     <Box sx={{ mt: 3 }}>
//       <Typography variant="h6">
//         Application Details ({application.id})
//       </Typography>

//       <Typography sx={{ mt: 1 }}>
//         <b>Applicant:</b> {application.userEmail || "-"}
//       </Typography>

//       <Typography sx={{ mt: 1 }}>
//         <b>Service:</b> {application.service}
//       </Typography>

//       <Typography sx={{ mt: 1 }}>
//         <b>Status:</b> {application.status}
//       </Typography>

//       <Typography sx={{ mt: 1 }}>
//         <b>Submitted:</b>{" "}
//         {application.createdAt?.toDate?.().toLocaleDateString() || "-"}
//       </Typography>

//       <Typography sx={{ mt: 1 }}>
//         <b>Staff:</b> {application.staff || "None"}
//       </Typography>

//       {/* Remarks field for staff and admin (admin cannot edit) */}
//       {(role === "staff" || (role === "admin" && !application.staff)) && (
//         <TextField
//           fullWidth
//           multiline
//           rows={3}
//           label="Remarks"
//           sx={{ mt: 3 }}
//           value={remark}
//           onChange={(e) => setRemark(e.target.value)}
//           disabled={role === "admin"} // Admin cannot edit remarks
//         />
//       )}

//       {/* Download documents for staff */}
//       {role === "staff" && application.documents?.length > 0 && (
//         <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
//           {application.documents.map((doc, i) => (
//             <Button
//               key={i}
//               variant="outlined"
//               href={doc.url}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Download {doc.name}
//             </Button>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ApplicationDetails;

import { Box, Typography, TextField, Button } from "@mui/material";

const ApplicationDetails = ({ application, role, remark, setRemark }) => {
  if (!application) return null;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">
        Application Details ({application.id})
      </Typography>

      <Typography sx={{ mt: 1 }}>
        <b>Applicant:</b> {application.userEmail || "-"}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        <b>Service:</b> {application.service}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        <b>Status:</b> {application.status}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        <b>Submitted:</b>{" "}
        {application.createdAt?.toDate?.().toLocaleDateString() || "-"}
      </Typography>

      <Typography sx={{ mt: 1 }}>
        <b>Staff:</b> {application.staff || "None"}
      </Typography>

      {/* Remarks field for staff */}
      {role === "staff" && (
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Remarks"
          sx={{ mt: 3 }}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      )}

      {/* Download documents for staff */}
      {role === "staff" && application.documents?.length > 0 && (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          {application.documents.map((doc) => (
            <Button
              key={doc.fileName || doc.documentName}
              variant="outlined"
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download: {doc.documentName}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ApplicationDetails;
