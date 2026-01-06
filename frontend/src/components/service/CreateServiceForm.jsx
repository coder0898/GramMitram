import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useApp } from "../../context/AppContext";

const CreateServiceForm = ({ onClose }) => {
  const { createService } = useApp();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [serviceForm, setServiceForm] = useState({
    service_name: "",
    service_desc: "",
    category: "",
    requiredDocuments: [],
    service_status: true, // active by default
  });

  const categories = ["agriculture", "finance", "essential", "others"];
  const documentOptions = [
    "adhaarcard",
    "pancard",
    "10th/12th marksheet",
    "ration card",
    "electricity bill",
  ];

  const handleSubmit = async () => {
    if (!serviceForm.service_name || !serviceForm.category) {
      setAlert({
        open: true,
        message: "Please fill required fields",
        severity: "error",
      });
      return;
    }

    try {
      await createService(serviceForm);
      setAlert({
        open: true,
        message: "Service created successfully",
        severity: "success",
      });
      setServiceForm({
        service_name: "",
        service_desc: "",
        category: "",
        requiredDocuments: [], // ✅ correct
        service_status: true,
      });

      if (onClose) onClose();
    } catch (err) {
      setAlert({
        open: true,
        message: "Error creating service",
        severity: "error",
      });
      console.error(err);
    }
  };

  const handleReset = () => {
    setServiceForm({
      service_name: "",
      service_desc: "",
      category: "",
      requiredDocuments: [],
      service_status: true,
    });
  };

  return (
    <Box sx={{ mt: 3 }}>
      {alert.open && (
        <Alert
          severity={alert.severity}
          sx={{ mb: 2 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setAlert({ ...alert, open: false })}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.message}
        </Alert>
      )}

      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700} textAlign="center">
          Create Service
        </Typography>

        <TextField
          label="Service Name"
          size="small"
          value={serviceForm.service_name}
          onChange={(e) =>
            setServiceForm({ ...serviceForm, service_name: e.target.value })
          }
          required
        />

        <TextField
          label="Service Description"
          size="small"
          multiline
          rows={3}
          value={serviceForm.service_desc}
          onChange={(e) =>
            setServiceForm({
              ...serviceForm,
              service_desc: e.target.value,
            })
          }
        />

        <FormControl size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={serviceForm.category}
            label="Category"
            onChange={(e) =>
              setServiceForm({ ...serviceForm, category: e.target.value })
            }
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Documents Required</InputLabel>
          <Select
            multiple
            value={serviceForm.requiredDocuments}
            onChange={(e) =>
              setServiceForm({
                ...serviceForm,
                requiredDocuments: e.target.value,
              })
            }
            input={<OutlinedInput label="Documents Required" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {documentOptions.map((doc) => (
              <MenuItem key={doc} value={doc}>
                <Checkbox
                  checked={serviceForm.requiredDocuments.includes(doc)}
                />
                <ListItemText primary={doc} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={serviceForm.service_status}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  service_status: e.target.checked,
                })
              }
            />
          }
          label={serviceForm.service_status ? "Active" : "Inactive"}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>

          <Button
            variant="contained"
            fullWidth
            color="warning"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default CreateServiceForm;
