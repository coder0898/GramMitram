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

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const applicationData = {
        serviceId: selectedService.id,
        serviceName: selectedService.service_name,
        service: selectedService.service_name,
        applicant: form,
      };

      const files = selectedService.requiredDocuments.map(
        (doc) => documents[doc]
      );

      await applyForService(applicationData, files);

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
