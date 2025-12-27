import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";

const ServiceTable = ({ services, role, onView, onApply }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: "primary.main" }}>
          <TableRow>
            <TableCell sx={{ color: "#fff" }}>Service</TableCell>
            <TableCell sx={{ color: "#fff" }}>Category</TableCell>
            <TableCell sx={{ color: "#fff" }}>Documents</TableCell>
            {role === "user" && (
              <TableCell sx={{ color: "#fff" }}>Assigned Staff</TableCell>
            )}
            <TableCell sx={{ color: "#fff" }}>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id} hover>
              <TableCell>{service.service_name}</TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>
                {service.requiredDocuments?.map((doc) => (
                  <Chip key={doc} label={doc} size="small" sx={{ mr: 0.5 }} />
                ))}
              </TableCell>

              {role === "user" && (
                <TableCell>{service.staff || "Not assigned"}</TableCell>
              )}

              <TableCell>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => onView(service)}
                >
                  View
                </Button>

                {role === "user" && (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<AssignmentIcon />}
                    sx={{ ml: 1 }}
                    onClick={() => onApply(service)}
                  >
                    Apply
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}

          {services.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No services available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ServiceTable;
