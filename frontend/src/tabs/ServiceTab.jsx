import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const serviceData = JSON.parse(localStorage.getItem("Services")) || [];

const ServiceTab = () => {
  const [tab, setTab] = useState(0);
  const [services, setServices] = useState({
    service_name: "",
    service_desc: "",
    requiredDocuments: [],
    category: "",
    service_status: true,
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("service_name");

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const filteredServices = serviceData
    .filter((s) => s.service_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  //   const [selectedService, setSelectedService] = useState(null);

  //form reset
  const handleFormReset = (e) => {
    e.preventDefault();
    setServices({
      service_name: "",
      service_desc: "",
      requiredDocuments: [],
      category: "",
      service_status: true,
    });
  };

  //submit service
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      !services.service_name ||
      !services.service_desc ||
      !services.requiredDocuments ||
      !services.category
    ) {
      setAlert({
        open: true,
        message: "Please fill all fields!",
        severity: "error",
      });
      setServices({
        service_name: "",
        service_desc: "",
        requiredDocuments: [],
        category: "",
        service_status: true,
      });
      return;
    }

    const newService = {
      id: `SRV${Date.now()}`,
      ...services,
      createdAt: new Date().toISOString(),
    };

    serviceData.push(newService);
    localStorage.setItem("Services", JSON.stringify(serviceData));
    setAlert({
      open: true,
      message: "Service created successfully!",
      severity: "success",
    });

    // Reset form
    setServices({
      service_name: "",
      service_desc: "",
      requiredDocuments: [],
      category: "",
      service_status: true,
    });
  };

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
      ;
      <Box sx={{ width: "100%" }}>
        {/* SUB TABS */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="All Services" />
          <Tab label="Create Service" />
        </Tabs>

        {/* TAB 1: TABLE */}
        {tab === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">All Services</Typography>
            {/* <table border="1" width="100%">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Water Supply</td>
                  <td>Utility</td>
                  <td>Active</td>
                </tr>
              </tbody>
            </table> */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead
                  sx={{
                    backgroundColor: "primary.main",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      <TableSortLabel
                        active={orderBy === "service_name"}
                        direction={order}
                        onClick={() => handleSort("service_name")}
                      >
                        Service Name
                      </TableSortLabel>
                    </TableCell>

                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Required Documents
                    </TableCell>

                    <TableCell>
                      <TableSortLabel
                        sx={{ color: "white", fontWeight: "bold" }}
                        active={orderBy === "category"}
                        direction={order}
                        onClick={() => handleSort("category")}
                      >
                        Service Category
                      </TableSortLabel>
                    </TableCell>

                    <TableCell>
                      <TableSortLabel
                        sx={{ color: "white", fontWeight: "bold" }}
                        active={orderBy === "service_status"}
                        direction={order}
                        onClick={() => handleSort("service_status")}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>

                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredServices.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.service_name}</TableCell>

                      <TableCell>
                        {row.requiredDocuments.map((doc) => (
                          <Chip
                            key={doc}
                            label={doc}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>

                      <TableCell>{row.category || "-"}</TableCell>

                      <TableCell
                        sx={{
                          color: row.service_status
                            ? "success.main"
                            : "error.main",
                          fontWeight: 500,
                        }}
                      >
                        {row.service_status ? "Active" : "Inactive"}
                      </TableCell>

                      <TableCell>
                        <Button size="small" variant="contained">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredServices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No services found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* TAB 2: FORM */}
        {tab === 1 && (
          <Box sx={{ maxWidth: 400, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create Service
            </Typography>

            <FormControl fullWidth margin="normal">
              <TextField
                fullWidth
                label="Service Name"
                value={services.service_name}
                onChange={(e) =>
                  setServices((prev) => ({
                    ...prev,
                    service_name: e.target.value,
                  }))
                }
                margin="normal"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                fullWidth
                label="Service Description"
                margin="normal"
                value={services.service_desc}
                onChange={(e) =>
                  setServices((prev) => ({
                    ...prev,
                    service_desc: e.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={services.category}
                label="Category"
                onChange={(e) =>
                  setServices((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                <MenuItem value="agriculture">Agriculture</MenuItem>
                <MenuItem value="essential">Essential</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
                <MenuItem value="health">Health</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Required Documents</InputLabel>
              <Select
                multiple
                value={services.requiredDocuments}
                label="Required Documents"
                onChange={(e) =>
                  setServices((prev) => ({
                    ...prev,
                    requiredDocuments: e.target.value,
                  }))
                }
              >
                <MenuItem value="aadhaar">Aadhaar Card</MenuItem>
                <MenuItem value="pan">PAN Card</MenuItem>
                <MenuItem value="age_proof">
                  Age Proof (10th / 12th Certificate / Birth Certificate)
                </MenuItem>
                <MenuItem value="electricity_bill">Electricity Bill</MenuItem>
                <MenuItem value="ration_card">Ration Card</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography
                sx={{
                  mr: 2,
                  color: services.service_status
                    ? "success.main"
                    : "error.main",
                }}
              >
                Status: {services.service_status ? "Active" : "Inactive"}
              </Typography>
              <Switch
                checked={services.service_status}
                onChange={(e) =>
                  setServices((prev) => ({
                    ...prev,
                    service_status: e.target.checked,
                  }))
                }
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleFormSubmit}
              >
                Save Service
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={handleFormReset}
              >
                Reset Form
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ServiceTab;
