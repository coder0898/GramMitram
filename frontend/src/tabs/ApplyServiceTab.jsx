// // import React, { useState } from "react";
// // import {
// //   Box,
// //   Button,
// //   Card,
// //   CardContent,
// //   TextField,
// //   Typography,
// //   Alert,
// //   Snackbar,
// // } from "@mui/material";
// // import { useApp } from "../context/AppContext";

// // const ApplyServiceTab = ({ selectedService, onBack }) => {
// //   const { applyForService } = useApp();

// //   const [form, setForm] = useState({
// //     name: "",
// //     mobile: "",
// //     address: "",
// //   });

// //   const [documents, setDocuments] = useState({});
// //   const [error, setError] = useState(false);

// //   if (!selectedService) {
// //     return (
// //       <Typography color="text.secondary">
// //         Please select a service to apply
// //       </Typography>
// //     );
// //   }

// //   const handleFileChange = (doc, file) => {
// //     setDocuments((prev) => ({ ...prev, [doc]: file }));
// //   };

// //   const handleSubmit = async () => {
// //     // Validation
// //     if (
// //       !form.name ||
// //       !form.mobile ||
// //       selectedService.requiredDocuments.some((doc) => !documents[doc])
// //     ) {
// //       setError(true);
// //       return;
// //     }

// //     try {
// //       // Prepare metadata (backend upload later)
// //       const uploadedDocs = Object.keys(documents).map((docName) => ({
// //         documentName: docName,
// //         fileName: documents[docName].name,
// //         fileUrl: null,
// //       }));

// //       await applyForService({
// //         serviceId: selectedService.id,
// //         serviceName: selectedService.service_name,
// //         service: selectedService.service_name,
// //         applicant: form,
// //         documents: uploadedDocs,
// //       });

// //       // Reset
// //       setForm({ name: "", mobile: "", address: "" });
// //       setDocuments({});
// //       if (onBack) onBack();
// //     } catch (err) {
// //       console.error("Error submitting application:", err);
// //       setError(true);
// //     }
// //   };

// //   return (
// //     <Box maxWidth={600}>
// //       <Typography variant="h5" fontWeight={600} gutterBottom>
// //         Apply for {selectedService.service_name}
// //       </Typography>

// //       <Card>
// //         <CardContent>
// //           <TextField
// //             fullWidth
// //             label="Full Name"
// //             margin="normal"
// //             value={form.name}
// //             onChange={(e) => setForm({ ...form, name: e.target.value })}
// //           />

// //           <TextField
// //             fullWidth
// //             label="Mobile Number"
// //             margin="normal"
// //             value={form.mobile}
// //             onChange={(e) => setForm({ ...form, mobile: e.target.value })}
// //           />

// //           <TextField
// //             fullWidth
// //             label="Address"
// //             margin="normal"
// //             multiline
// //             rows={2}
// //             value={form.address}
// //             onChange={(e) => setForm({ ...form, address: e.target.value })}
// //           />

// //           <Typography sx={{ mt: 3 }} fontWeight={500}>
// //             Upload Required Documents
// //           </Typography>

// //           {selectedService.requiredDocuments.map((doc) => (
// //             <Box key={doc} sx={{ mt: 2 }}>
// //               <Typography variant="body2">{doc}</Typography>
// //               <Button variant="outlined" component="label" size="small">
// //                 Upload
// //                 <input
// //                   type="file"
// //                   hidden
// //                   onChange={(e) => handleFileChange(doc, e.target.files[0])}
// //                 />
// //               </Button>
// //               {documents[doc] && (
// //                 <Typography variant="caption" sx={{ ml: 1 }}>
// //                   {documents[doc].name}
// //                 </Typography>
// //               )}
// //             </Box>
// //           ))}

// //           <Button
// //             fullWidth
// //             variant="contained"
// //             sx={{ mt: 4 }}
// //             onClick={handleSubmit}
// //           >
// //             Submit Application
// //           </Button>
// //         </CardContent>
// //       </Card>

// //       <Snackbar
// //         open={error}
// //         autoHideDuration={3000}
// //         onClose={() => setError(false)}
// //       >
// //         <Alert severity="error">
// //           Please fill all required fields and upload documents
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default ApplyServiceTab;

// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   TextField,
//   Typography,
//   Alert,
//   Snackbar,
// } from "@mui/material";
// import { useApp } from "../context/AppContext";

// const ApplyServiceTab = ({ selectedService, onBack }) => {
//   const { applyForService, uploadFile } = useApp();

//   const [form, setForm] = useState({
//     name: "",
//     mobile: "",
//     address: "",
//   });

//   const [documents, setDocuments] = useState({});
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(false);

//   if (!selectedService) {
//     return (
//       <Typography color="text.secondary">
//         Please select a service to apply
//       </Typography>
//     );
//   }

//   const handleFileChange = (doc, file) => {
//     setDocuments((prev) => ({ ...prev, [doc]: file }));
//   };

//   const handleSubmit = async () => {
//     // Validation
//     if (
//       !form.name ||
//       !form.mobile ||
//       selectedService.requiredDocuments.some((doc) => !documents[doc])
//     ) {
//       setError(true);
//       return;
//     }

//     try {
//       setLoading(true);

//       // 1. Create application in Firestore first
//       const applicationData = {
//         serviceId: selectedService.id,
//         serviceName: selectedService.service_name,
//         service: selectedService.service_name,
//         applicant: form,
//         documents: [], // will fill after upload
//       };

//       // Save application
//       const app = await applyForService(applicationData);

//       // 2. Upload each document and update application documents
//       const uploadedDocs = [];
//       for (const docName of selectedService.requiredDocuments) {
//         const file = documents[docName];
//         if (file) {
//           const uploadRes = await uploadFile(app.id, file); // calls backend
//           uploadedDocs.push({
//             documentName: docName,
//             fileName: uploadRes.filename,
//             fileUrl: uploadRes.filename, // backend returns filename
//           });
//         }
//       }

//       // 3. Update application with uploaded documents
//       if (uploadedDocs.length) {
//         await applyForService.updateApplication(app.id, {
//           documents: uploadedDocs,
//         });
//       }

//       // Reset form
//       setForm({ name: "", mobile: "", address: "" });
//       setDocuments({});
//       setLoading(false);
//       if (onBack) onBack();
//     } catch (err) {
//       console.error("Error submitting application:", err);
//       setError(true);
//       setLoading(false);
//     }
//   };

//   return (
//     <Box maxWidth={600}>
//       <Typography variant="h5" fontWeight={600} gutterBottom>
//         Apply for {selectedService.service_name}
//       </Typography>

//       <Card>
//         <CardContent>
//           <TextField
//             fullWidth
//             label="Full Name"
//             margin="normal"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />

//           <TextField
//             fullWidth
//             label="Mobile Number"
//             margin="normal"
//             value={form.mobile}
//             onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//           />

//           <TextField
//             fullWidth
//             label="Address"
//             margin="normal"
//             multiline
//             rows={2}
//             value={form.address}
//             onChange={(e) => setForm({ ...form, address: e.target.value })}
//           />

//           <Typography sx={{ mt: 3 }} fontWeight={500}>
//             Upload Required Documents
//           </Typography>

//           {selectedService.requiredDocuments.map((doc) => (
//             <Box key={doc} sx={{ mt: 2 }}>
//               <Typography variant="body2">{doc}</Typography>
//               <Button variant="outlined" component="label" size="small">
//                 Upload
//                 <input
//                   type="file"
//                   hidden
//                   onChange={(e) => handleFileChange(doc, e.target.files[0])}
//                 />
//               </Button>
//               {documents[doc] && (
//                 <Typography variant="caption" sx={{ ml: 1 }}>
//                   {documents[doc].name}
//                 </Typography>
//               )}
//             </Box>
//           ))}

//           <Button
//             fullWidth
//             variant="contained"
//             sx={{ mt: 4 }}
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit Application"}
//           </Button>
//         </CardContent>
//       </Card>

//       <Snackbar
//         open={error}
//         autoHideDuration={3000}
//         onClose={() => setError(false)}
//       >
//         <Alert severity="error">
//           Please fill all required fields and upload documents
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ApplyServiceTab;

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { useApp } from "../context/AppContext";

const ApplyServiceTab = ({ selectedService, onBack }) => {
  const { applyForService, uploadFile } = useApp();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
  });
  const [documents, setDocuments] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!selectedService) {
    return (
      <Typography color="text.secondary">
        Please select a service to apply
      </Typography>
    );
  }

  const handleFileChange = (doc, file) => {
    setDocuments((prev) => ({ ...prev, [doc]: file }));
  };

  // const handleSubmit = async () => {
  //   // Validation
  //   if (
  //     !form.name ||
  //     !form.mobile ||
  //     selectedService.requiredDocuments.some((doc) => !documents[doc])
  //   ) {
  //     setError(true);
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // 1. Create application first without documents
  //     const applicationData = {
  //       serviceId: selectedService.id,
  //       serviceName: selectedService.service_name,
  //       service: selectedService.service_name,
  //       applicant: form,
  //       documents: [],
  //     };

  //     const app = await applyForService(applicationData); // should return app with id

  //     // 2. Upload each document
  //     const uploadedDocs = [];
  //     for (const docName of selectedService.requiredDocuments) {
  //       const file = documents[docName];
  //       if (file) {
  //         const uploadRes = await uploadFile(app.id, file); // upload to backend/storage
  //         uploadedDocs.push({
  //           documentName: docName,
  //           fileName: uploadRes.filename,
  //           fileUrl: uploadRes.fileUrl || uploadRes.filename,
  //         });
  //       }
  //     }

  //     // 3. Update application with uploaded documents
  //     if (uploadedDocs.length && app.id) {
  //       await applyForService(app.id, { documents: uploadedDocs }, true);
  //       // third param `true` can indicate update if your API supports
  //     }

  //     // 4. Reset form
  //     setForm({ name: "", mobile: "", address: "" });
  //     setDocuments({});
  //     setLoading(false);

  //     if (onBack) onBack();
  //   } catch (err) {
  //     console.error("Error submitting application:", err);
  //     setError(true);
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const applicationData = {
        serviceId: selectedService.id,
        serviceName: selectedService.service_name,
        service: selectedService.service_name,
        applicant: form,
      };

      // 🔑 get the actual file object
      const file = documents[selectedService.requiredDocuments[0]];

      await applyForService(applicationData, file);

      setForm({ name: "", mobile: "", address: "" });
      setDocuments({});
      setLoading(false);
      onBack?.();
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Apply for {selectedService.service_name}
      </Typography>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            fullWidth
            label="Mobile Number"
            margin="normal"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />

          <TextField
            fullWidth
            label="Address"
            margin="normal"
            multiline
            rows={2}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <Typography sx={{ mt: 3 }} fontWeight={500}>
            Upload Required Documents
          </Typography>

          {selectedService.requiredDocuments.map((doc) => (
            <Box key={doc} sx={{ mt: 2 }}>
              <Typography variant="body2">{doc}</Typography>
              <Button variant="outlined" component="label" size="small">
                Upload
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={(e) => handleFileChange(doc, e.target.files[0])}
                />
              </Button>
              {documents[doc] && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {documents[doc].name}
                </Typography>
              )}
            </Box>
          ))}

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 4 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={error}
        autoHideDuration={3000}
        onClose={() => setError(false)}
      >
        <Alert severity="error">
          Please fill all required fields and upload documents
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApplyServiceTab;
