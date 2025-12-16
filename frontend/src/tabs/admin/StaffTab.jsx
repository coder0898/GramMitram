import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/AuthContext";

const StaffTab = () => {
  const { signup } = useAuth();

  const [tab, setTab] = useState(0);

  // staff list for table
  const [staffList, setStaffList] = useState([]);

  // signup form state
  const [staffForm, setStaffForm] = useState({
    username: "",
    email: "",
    role: "staff",
    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  /* ================= LOAD STAFF FROM LOCALSTORAGE ================= */
  const loadStaff = () => {
    const signupDetails =
      JSON.parse(localStorage.getItem("signupDetails")) || [];
    const staffUsers = signupDetails.filter((user) => user.role === "staff");
    setStaffList(staffUsers);
  };

  useEffect(() => {
    loadStaff();
  }, []);

  /* ================= STAFF SIGNUP ================= */
  const handleSubmitSignup = (e) => {
    e.preventDefault();

    if (staffForm.password !== staffForm.confirmPassword) {
      setAlert({
        open: true,
        severity: "error",
        message: "Passwords do not match",
      });
      return;
    }

    const result = signup(
      staffForm.username,
      staffForm.email,
      staffForm.password,
      staffForm.confirmPassword,
      staffForm.role
    );

    setAlert({
      open: true,
      severity: result.success ? "success" : "error",
      message: result.message,
    });

    if (result.success) {
      loadStaff(); // 🔥 auto refresh table
      setTab(0); // go back to table
      setStaffForm({
        username: "",
        email: "",
        role: "staff",
        password: "",
        confirmPassword: "",
      });
    }
  };

  /* ================= DELETE STAFF ================= */
  const handleDeleteStaff = (email) => {
    const signupDetails =
      JSON.parse(localStorage.getItem("signupDetails")) || [];

    const updated = signupDetails.filter((user) => user.email !== email);

    localStorage.setItem("signupDetails", JSON.stringify(updated));
    loadStaff(); // 🔥 auto refresh table
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* ================= TABS ================= */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Staff Details" />
        <Tab label="Staff Sign Up" />
      </Tabs>

      {/* ================= TAB 1: STAFF TABLE ================= */}
      {tab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            View All Staff
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}>#</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Role</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Created At</TableCell>
                  <TableCell sx={{ color: "#fff" }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {staffList.map((staff, index) => (
                  <TableRow key={staff.email}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{staff.username}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      {staff.createdAt ? staff.createdAt : "---"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteStaff(staff.email)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {staffList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No staff found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ================= TAB 2: STAFF SIGNUP ================= */}
      {tab === 1 && (
        <Box sx={{ mt: 3 }}>
          {alert.open && (
            <Alert
              severity={alert.severity}
              sx={{ mb: 2 }}
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => setAlert({ ...alert, open: false })}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {alert.message}
            </Alert>
          )}

          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={700} textAlign="center">
              Create Staff Account
            </Typography>

            <TextField
              label="User Name"
              size="small"
              value={staffForm.username}
              onChange={(e) =>
                setStaffForm({ ...staffForm, username: e.target.value })
              }
            />

            <TextField
              label="Email"
              type="email"
              size="small"
              value={staffForm.email}
              onChange={(e) =>
                setStaffForm({ ...staffForm, email: e.target.value })
              }
            />

            <FormControl>
              <InputLabel>Role</InputLabel>
              <Select
                value={staffForm.role}
                label="Role"
                onChange={(e) =>
                  setStaffForm({ ...staffForm, role: e.target.value })
                }
              >
                <MenuItem value="staff">Staff</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Password"
              type="password"
              size="small"
              value={staffForm.password}
              onChange={(e) =>
                setStaffForm({ ...staffForm, password: e.target.value })
              }
            />

            <TextField
              label="Confirm Password"
              type="password"
              size="small"
              value={staffForm.confirmPassword}
              onChange={(e) =>
                setStaffForm({
                  ...staffForm,
                  confirmPassword: e.target.value,
                })
              }
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleSubmitSignup}
              >
                Sign Up
              </Button>

              <Button
                variant="contained"
                fullWidth
                color="warning"
                onClick={() =>
                  setStaffForm({
                    username: "",
                    email: "",
                    role: "staff",
                    password: "",
                    confirmPassword: "",
                  })
                }
              >
                Reset
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default StaffTab;
