import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { useUser } from "../../context/UserContext";

const ApplyServiceTab = () => {
  const {
    selectedServiceForApply,
    applyForService,
    clearSelectedServiceForApply,
  } = useUser();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (!selectedServiceForApply) clearSelectedServiceForApply();
  }, [selectedServiceForApply]);

  const handleSubmit = () => {
    if (!selectedServiceForApply || !form.name || !form.mobile) {
      setAlert(true);
      return;
    }

    applyForService({
      serviceId: selectedServiceForApply.id,
      serviceName: selectedServiceForApply.name,
      applicant: form,
      documents: selectedServiceForApply.requiredDocuments,
    });

    clearSelectedServiceForApply();
    setForm({ name: "", mobile: "", address: "" });
  };

  if (!selectedServiceForApply) {
    return (
      <Typography color="text.secondary">
        Please select a service to apply
      </Typography>
    );
  }

  return (
    <Box maxWidth={600}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Apply for {selectedServiceForApply.name}
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

          <Typography sx={{ mt: 2 }} fontWeight={500}>
            Required Documents
          </Typography>
          <Box sx={{ mt: 1 }}>
            {selectedServiceForApply.requiredDocuments.map((doc) => (
              <Chip key={doc} label={doc} sx={{ mr: 0.5 }} />
            ))}
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Submit Application
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={alert}
        autoHideDuration={3000}
        onClose={() => setAlert(false)}
      >
        <Alert severity="error">Please fill required fields</Alert>
      </Snackbar>
    </Box>
  );
};

export default ApplyServiceTab;
