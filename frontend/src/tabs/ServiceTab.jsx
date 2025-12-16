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
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ServiceTab = () => {
  const [servicesList, setServicesList] = useState([]);
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

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("service_name");

  // MODAL STATES
  const [viewOpen, setViewOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // LOAD SERVICES
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("Services")) || [];
    setServicesList(stored);
  }, []);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const filteredServices = [...servicesList].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

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

  // CREATE SERVICE
  const handleFormSubmit = () => {
    if (
      !services.service_name ||
      !services.service_desc ||
      !services.category
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
      ...services,
      createdAt: new Date().toISOString(),
    };

    const updated = [...servicesList, newService];
    setServicesList(updated);
    localStorage.setItem("Services", JSON.stringify(updated));

    setAlert({
      open: true,
      message: "Service created successfully!",
      severity: "success",
    });

    setServices({
      service_name: "",
      service_desc: "",
      requiredDocuments: [],
      category: "",
      service_status: true,
    });
  };

  // VIEW
  const handleView = (service) => {
    setSelectedService({ ...service });
    setEditMode(false);
    setViewOpen(true);
  };

  // SAVE EDIT
  const handleSaveChanges = () => {
    const updated = servicesList.map((s) =>
      s.id === selectedService.id ? selectedService : s
    );

    setServicesList(updated);
    localStorage.setItem("Services", JSON.stringify(updated));

    setEditMode(false);
    setViewOpen(false);

    setAlert({
      open: true,
      message: "Service updated successfully!",
      severity: "success",
    });
  };

  // DELETE
  const handleDelete = () => {
    const updated = servicesList.filter((s) => s.id !== selectedService.id);

    setServicesList(updated);
    localStorage.setItem("Services", JSON.stringify(updated));

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
              {filteredServices.map((row) => (
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
      )}

      {/* ================= CREATE FORM TAB ================= */}
      {tab === 1 && (
        <Box sx={{ maxWidth: 450, mt: 3 }}>
          <TextField
            fullWidth
            label="Service Name"
            value={services.service_name}
            onChange={(e) =>
              setServices({ ...services, service_name: e.target.value })
            }
            margin="normal"
          />

          <TextField
            fullWidth
            label="Service Description"
            value={services.service_desc}
            onChange={(e) =>
              setServices({ ...services, service_desc: e.target.value })
            }
            margin="normal"
          />

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
                color: services.service_status ? "success.main" : "error.main",
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

      {/* ================= VIEW / EDIT MODAL ================= */}
      <Dialog open={viewOpen} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* TITLE */}
          <Box component="span" sx={{ fontWeight: 600 }}>
            Service Details
          </Box>

          {/* ACTIONS */}
          <Box>
            <IconButton
              onClick={() =>
                editMode ? handleSaveChanges() : setEditMode(true)
              }
              title={editMode ? "Save" : "Edit"}
            >
              {editMode ? "Save" : <EditIcon />}
            </IconButton>

            <IconButton
              color="error"
              onClick={() => setDeleteConfirmOpen(true)}
              title="Delete"
            >
              <DeleteIcon />
            </IconButton>

            <IconButton
              onClick={() => {
                setViewOpen(false);
                setEditMode(false);
              }}
              title="Close"
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
                  label="Category"
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
