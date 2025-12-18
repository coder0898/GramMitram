import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useUser } from "../../context/UserContext";

const ServiceTab = ({ onApplyClick }) => {
  const { services, setSelectedServiceForApply } = useUser();
  const [search, setSearch] = useState("");
  const [viewService, setViewService] = useState(null);

  const filteredServices = services.filter(
    (s) =>
      s.status === "Active" &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = (service) => {
    setSelectedServiceForApply(service);
    if (onApplyClick) onApplyClick(); // Switch tab
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Available Services
      </Typography>

      <TextField
        placeholder="Search service"
        fullWidth
        sx={{ maxWidth: 400, mb: 3 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Service</TableCell>
              <TableCell sx={{ color: "#fff" }}>Category</TableCell>
              <TableCell sx={{ color: "#fff" }}>Documents</TableCell>
              <TableCell sx={{ color: "#fff" }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id} hover>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell>
                  {service.requiredDocuments.map((doc) => (
                    <Chip key={doc} label={doc} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => setViewService(service)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<AssignmentIcon />}
                    sx={{ ml: 1 }}
                    onClick={() => handleApply(service)}
                  >
                    Apply
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filteredServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No services available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* VIEW SERVICE */}
      <Dialog open={Boolean(viewService)} onClose={() => setViewService(null)}>
        <DialogTitle>Service Details</DialogTitle>
        <DialogContent>
          {viewService && (
            <>
              <Typography fontWeight={600}>{viewService.name}</Typography>
              <Typography sx={{ mt: 1 }}>{viewService.description}</Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ServiceTab;
