import React, { useState, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAdmin } from "../../context/AdminContext";

const ServiceTab = () => {
  const { services, createService, updateService, deleteService } = useAdmin();

  const [tab, setTab] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("service_name");

  const [serviceForm, setServiceForm] = useState({
    service_name: "",
    service_desc: "",
    requiredDocuments: [],
    category: "",
    service_status: true,
  });

  const [selectedService, setSelectedService] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ================= SORTING ================= */
  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [services, order, orderBy]);

  /* ================= FORM ================= */
  const resetForm = () => {
    setServiceForm({
      service_name: "",
      service_desc: "",
      requiredDocuments: [],
      category: "",
      service_status: true,
    });
  };

  const handleCreateService = () => {
    if (
      !serviceForm.service_name ||
      !serviceForm.service_desc ||
      !serviceForm.category
    ) {
      setAlert({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    createService({
      ...serviceForm,
      createdAt: new Date().toISOString(),
    });

    setAlert({
      open: true,
      message: "Service created successfully",
      severity: "success",
    });

    resetForm();
    setTab(0);
  };

  /* ================= VIEW / EDIT ================= */
  const handleView = (service) => {
    setSelectedService({ ...service });
    setEditMode(false);
    setViewOpen(true);
  };

  const handleSaveChanges = () => {
    updateService(selectedService);
    setViewOpen(false);
    setEditMode(false);

    setAlert({
      open: true,
      message: "Service updated successfully",
      severity: "success",
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = () => {
    deleteService(selectedService.id);
    setDeleteConfirmOpen(false);
    setViewOpen(false);

    setAlert({
      open: true,
      message: "Service deleted successfully",
      severity: "success",
    });
  };

  return (
    <>
      {/* ================= ALERT ================= */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>

      {/* ================= TABS ================= */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="All Services" />
        <Tab label="Create Service" />
      </Tabs>

      {/* ================= ALL SERVICES ================= */}
      {tab === 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "primary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>
                  <TableSortLabel
                    active={orderBy === "service_name"}
                    direction={order}
                    onClick={() => handleSort("service_name")}
                  >
                    Service Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>Documents</TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={order}
                    onClick={() => handleSort("category")}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  <TableSortLabel
                    active={orderBy === "service_status"}
                    direction={order}
                    onClick={() => handleSort("service_status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedServices.map((service) => (
                <TableRow key={service.id} hover>
                  <TableCell>{service.service_name}</TableCell>
                  <TableCell>
                    {service.requiredDocuments?.map((doc) => (
                      <Chip
                        key={doc}
                        label={doc}
                        size="small"
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell
                    sx={{
                      color: service.service_status
                        ? "success.main"
                        : "error.main",
                      fontWeight: 600,
                    }}
                  >
                    {service.service_status ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleView(service)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {sortedServices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No services found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ================= CREATE SERVICE ================= */}
      {tab === 1 && (
        <Box sx={{ maxWidth: 450, mt: 3 }}>
          <TextField
            fullWidth
            label="Service Name"
            margin="normal"
            value={serviceForm.service_name}
            onChange={(e) =>
              setServiceForm({ ...serviceForm, service_name: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Service Description"
            margin="normal"
            value={serviceForm.service_desc}
            onChange={(e) =>
              setServiceForm({ ...serviceForm, service_desc: e.target.value })
            }
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={serviceForm.category}
              onChange={(e) =>
                setServiceForm({ ...serviceForm, category: e.target.value })
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
              value={serviceForm.requiredDocuments}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  requiredDocuments: e.target.value,
                })
              }
            >
              <MenuItem value="Aadhaar Card">Aadhaar Card</MenuItem>
              <MenuItem value="PAN Card">PAN Card</MenuItem>
              <MenuItem value="Electricity Bill">Electricity Bill</MenuItem>
              <MenuItem value="Ration Card">Ration Card</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Typography sx={{ mr: 2 }}>
              Status: {serviceForm.service_status ? "Active" : "Inactive"}
            </Typography>
            <Switch
              checked={serviceForm.service_status}
              onChange={(e) =>
                setServiceForm({
                  ...serviceForm,
                  service_status: e.target.checked,
                })
              }
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleCreateService}
            >
              Save Service
            </Button>
            <Button variant="contained" color="warning" onClick={resetForm}>
              Reset
            </Button>
          </Box>
        </Box>
      )}

      {/* ================= VIEW / EDIT MODAL ================= */}
      <Dialog open={viewOpen} fullWidth maxWidth="sm">
        <DialogTitle>
          Service Details
          <Box sx={{ float: "right" }}>
            <IconButton
              onClick={() =>
                editMode ? handleSaveChanges() : setEditMode(true)
              }
            >
              {editMode ? "Save" : <EditIcon />}
            </IconButton>
            <IconButton
              color="error"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {selectedService && (
            <>
              <TextField
                fullWidth
                label="Service Name"
                margin="normal"
                disabled={!editMode}
                value={selectedService.service_name}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    service_name: e.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Description"
                margin="normal"
                disabled={!editMode}
                value={selectedService.service_desc}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    service_desc: e.target.value,
                  })
                }
              />

              <Switch
                disabled={!editMode}
                checked={selectedService.service_status}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    service_status: e.target.checked,
                  })
                }
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ================= DELETE CONFIRM ================= */}
      <Dialog open={deleteConfirmOpen}>
        <DialogTitle>Delete this service?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ServiceTab;
