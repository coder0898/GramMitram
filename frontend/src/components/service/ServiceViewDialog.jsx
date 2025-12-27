import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Chip,
  Box,
} from "@mui/material";

const ServiceViewDialog = ({ open, onClose, service }) => {
  if (!service) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Service Details</DialogTitle>
      <DialogContent dividers>
        <Typography>
          <b>Name:</b> {service.service_name}
        </Typography>
        <Typography>
          <b>Description:</b> {service.service_desc}
        </Typography>
        <Typography>
          <b>Category:</b> {service.category}
        </Typography>
        <Typography>
          <b>Status:</b> {service.service_status ? "Active" : "Inactive"}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography>
            <b>Required Documents:</b>
          </Typography>
          {service.requiredDocuments?.map((doc) => (
            <Chip key={doc} label={doc} size="small" sx={{ mr: 0.5 }} />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceViewDialog;
