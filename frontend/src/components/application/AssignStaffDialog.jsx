import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const AssignStaffDialog = ({
  open,
  onClose,
  staffList,
  onAssign,
  staffEmail,
  setStaffEmail,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Assign Staff</DialogTitle>
    <DialogContent>
      <FormControl fullWidth>
        <InputLabel>Staff</InputLabel>
        <Select
          value={staffEmail}
          onChange={(e) => setStaffEmail(e.target.value)}
        >
          {staffList.map((s) => (
            <MenuItem key={s.id} value={s.email}>
              {s.username}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" onClick={onAssign}>
        Assign
      </Button>
    </DialogActions>
  </Dialog>
);

export default AssignStaffDialog;
