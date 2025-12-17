import {
  Alert,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Button,
} from "@mui/material";
import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useStaff } from "../../context/StaffContext";

const ServiceTab = () => {
  const {
    sortedServices,
    order,
    orderBy,
    handleServiceSort,
    selectedService,
    viewOpen,
    setViewOpen,
    alert,
    setAlert,
    handleViewService,
  } = useStaff();

  return (
    <Box sx={{ width: "100%" }}>
      {/* ALERT */}
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === "service_name"}
                  direction={order}
                  onClick={() => handleServiceSort("service_name")}
                >
                  Service Name
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Description
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Required Documents
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                <TableSortLabel
                  active={orderBy === "category"}
                  direction={order}
                  onClick={() => handleServiceSort("category")}
                >
                  Category
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Status
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
                <TableCell>{row.service_desc}</TableCell>

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

                <TableCell>{row.category}</TableCell>

                <TableCell
                  sx={{
                    fontWeight: 500,
                    color: row.service_status ? "success.main" : "error.main",
                  }}
                >
                  {row.service_status ? "Active" : "Inactive"}
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewService(row)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {sortedServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No services available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* VIEW DIALOG */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Service Details</DialogTitle>
        <DialogContent dividers>
          {selectedService && (
            <>
              <Typography gutterBottom>
                <strong>Name:</strong> {selectedService.service_name}
              </Typography>

              <Typography gutterBottom>
                <strong>Description:</strong> {selectedService.service_desc}
              </Typography>

              <Typography gutterBottom>
                <strong>Category:</strong> {selectedService.category}
              </Typography>

              <Typography gutterBottom>
                <strong>Status:</strong>{" "}
                {selectedService.service_status ? "Active" : "Inactive"}
              </Typography>

              <Typography gutterBottom sx={{ mt: 2 }}>
                <strong>Required Documents:</strong>
              </Typography>

              {selectedService.requiredDocuments.map((doc) => (
                <Chip
                  key={doc}
                  label={doc}
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ServiceTab;
