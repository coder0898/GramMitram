import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Box,
  Button,
  Stack,
  TextField,
  Switch,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";

const ServiceViewDialog = ({
  open,
  onClose,
  service,
  role,
  hasApplied,
  onApply,
  onEdit,
  onDelete,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editableService, setEditableService] = useState(service || {});

  useEffect(() => {
    setEditableService(service || {});
    setEditMode(false);
  }, [service]);

  if (!service) return null;

  const handleSave = () => {
    onEdit(editableService);
    setEditMode(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Service Details
        {role === "admin" && (
          <Box sx={{ float: "right" }}>
            <IconButton
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
            >
              {editMode ? "Save" : <EditIcon />}
            </IconButton>
            <IconButton color="error" onClick={() => onDelete(service)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {/* Editable fields for Admin */}
        {role === "admin" && editMode ? (
          <>
            <TextField
              fullWidth
              label="Service Name"
              margin="normal"
              value={editableService.service_name}
              onChange={(e) =>
                setEditableService({
                  ...editableService,
                  service_name: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              value={editableService.service_desc}
              onChange={(e) =>
                setEditableService({
                  ...editableService,
                  service_desc: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              label="Category"
              margin="normal"
              value={editableService.category}
              onChange={(e) =>
                setEditableService({
                  ...editableService,
                  category: e.target.value,
                })
              }
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Typography sx={{ mr: 2 }}>
                Status: {editableService.service_status ? "Active" : "Inactive"}
              </Typography>
              <Switch
                checked={editableService.service_status}
                onChange={(e) =>
                  setEditableService({
                    ...editableService,
                    service_status: e.target.checked,
                  })
                }
              />
            </Box>
          </>
        ) : (
          // Read-only view for users or admin in view mode
          <>
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

            {role === "user" && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onApply(service)}
                  disabled={hasApplied}
                >
                  {hasApplied ? "Already Applied" : "Apply"}
                </Button>
                {hasApplied && (
                  <Typography sx={{ mt: 1 }}>
                    You have already applied to this service.
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceViewDialog;
