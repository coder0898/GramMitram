import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/authContext";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ role }) => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    username: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  // Auto-close alert after 3 seconds
  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.open]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Call signup with separate parameters
    const result = signup(
      signupData.username,
      signupData.email,
      signupData.role,
      signupData.password,
      signupData.confirmPassword
    );

    setAlert({
      open: true,
      severity: result.success ? "success" : "error",
      message: result.message,
    });

    if (result.success) {
      // Optionally redirect to login page after signup
      setSignupData({
        username: "",
        role: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } else {
      // Reset form on failed signup
      setSignupData({
        username: "",
        role: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <>
      {/* Alert */}
      {alert.open && (
        <Alert
          severity={alert.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setAlert({ ...alert, open: false })}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      )}

      <form onSubmit={onSubmitHandler}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700} textAlign="center">
            Create Your Account
          </Typography>

          <FormControl fullWidth>
            <TextField
              label="User Name"
              name="username"
              size="small"
              value={signupData.username}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, username: e.target.value }))
              }
              autoComplete="username"
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="role-label">User Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={signupData.role}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, role: e.target.value }))
              }
              input={<OutlinedInput label="User Role" />}
            >
              <MenuItem value="">
                <em>Select role</em>
              </MenuItem>
              {role &&
                role.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Email"
              type="email"
              name="email"
              size="small"
              value={signupData.email}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, email: e.target.value }))
              }
              autoComplete="email"
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Password"
              type="password"
              name="password"
              size="small"
              value={signupData.password}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, password: e.target.value }))
              }
              autoComplete="new-password"
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Confirm Password"
              type="password"
              name="confirm-password"
              size="small"
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              autoComplete="new-password"
            />
          </FormControl>

          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ borderRadius: 2, py: 1.4 }}
            type="submit"
          >
            Sign Up
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default SignupForm;
