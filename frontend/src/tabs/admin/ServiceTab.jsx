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
import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAdmin } from "../../context/AdminContext";

const ServiceTab = () => {
  const { services, createService, updateService, deleteService } = useAdmin();

  const [tab, setTab] = useState(0);

  const [serviceForm, setServiceForm] = useState({
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

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("service_name");

  const [viewOpen, setViewOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  /* ================= SORT ================= */
  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedServices = [...services].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  /* ================= FORM ACTIONS ================= */
  const handleFormReset = () => {
    setServiceForm({
      service_name: "",
      service_desc: "",
      requiredDocuments: [],
      category: "",
      service_status: true,
    });
  };

  const handleFormSubmit = () => {
    if (
      !serviceForm.service_name ||
      !serviceForm.service_desc ||
      !serviceForm.category
    ) {
      setAlert({
        open: true,
        message: "Please fill all fields",
        severity: "error",
      });
      return;
    }

    const newService = {
      id: `SRV${Date.now()}`,
      ...serviceForm,
      createdAt: new Date().toISOString(),
    };

    createService(newService);

    setAlert({
      open: true,
      message: "Service created successfully!",
      severity: "success",
    });

    handleFormReset();
  };

  /* ================= VIEW / EDIT ================= */
  const handleView = (service) => {
    setSelectedService({ ...service });
    setEditMode(false);
    setViewOpen(true);
  };

  const handleSaveChanges = () => {
    updateService(selectedService);

    setEditMode(false);
    setViewOpen(false);

    setAlert({
      open: true,
      message: "Service updated successfully!",
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
      message: "Service deleted successfully!",
      severity: "success",
    });
  };

  return (
    <>
      {/* ALERT */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>

      {/* TABS */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="All Services" />
        <Tab label="Create Service" />
      </Tabs>

      {/* ================= TABLE TAB ================= */}
      {tab === 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "primary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === "service_name"}
                    direction={order}
                    onClick={() => handleSort("service_name")}
                  >
                    Service Name
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Documents
                </TableCell>

                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={order}
                    onClick={() => handleSort("category")}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === "service_status"}
                    direction={order}
                    onClick={() => handleSort("service_status")}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedServices.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.service_name}</TableCell>
                  <TableCell>
                    {row.requiredDocuments.map((d) => (
                      <Chip
                        key={d}
                        label={d}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell
                    sx={{
                      color: row.service_status ? "success.main" : "error.main",
                      fontWeight: 500,
                    }}
                  >
                    {row.service_status ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleView(row)}
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

      {/* ================= CREATE FORM TAB ================= */}
      {tab === 1 && (
        <Box sx={{ maxWidth: 450, mt: 3 }}>
          <TextField
            fullWidth
            label="Service Name"
            value={serviceForm.service_name}
            onChange={(e) =>
              setServiceForm({ ...serviceForm, service_name: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Service Description"
            value={serviceForm.service_desc}
            onChange={(e) =>
              setServiceForm({ ...serviceForm, service_desc: e.target.value })
            }
            margin="normal"
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
              <MenuItem value="aadhaar">Aadhaar Card</MenuItem>
              <MenuItem value="pan">PAN Card</MenuItem>
              <MenuItem value="age_proof">
                Age Proof (10th / 12th / Birth Certificate)
              </MenuItem>
              <MenuItem value="electricity_bill">Electricity Bill</MenuItem>
              <MenuItem value="ration_card">Ration Card</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Typography
              sx={{
                mr: 2,
                color: serviceForm.service_status
                  ? "success.main"
                  : "error.main",
              }}
            >
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

      {/* ================= VIEW / EDIT MODAL ================= */}
      <Dialog open={viewOpen} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box component="span" sx={{ fontWeight: 600 }}>
            Service Details
          </Box>
          <Box>
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
            <IconButton
              onClick={() => {
                setViewOpen(false);
                setEditMode(false);
              }}
            >
              ✕
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {selectedService && (
            <>
              <TextField
                fullWidth
                label="Service Name"
                disabled={!editMode}
                margin="normal"
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
                disabled={!editMode}
                margin="normal"
                value={selectedService.service_desc}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    service_desc: e.target.value,
                  })
                }
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  disabled={!editMode}
                  value={selectedService.category}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      category: e.target.value,
                    })
                  }
                >
                  <MenuItem value="agriculture">Agriculture</MenuItem>
                  <MenuItem value="essential">Essential</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="health">Health</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Typography sx={{ mr: 2, fontWeight: 500 }}>Status</Typography>
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
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setViewOpen(false);
              setEditMode(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= DELETE CONFIRM ================= */}
      <Dialog open={deleteConfirmOpen}>
        <DialogTitle>Are you sure want to delete this service.?</DialogTitle>
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
