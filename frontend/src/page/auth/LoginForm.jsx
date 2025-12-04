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
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ role }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    role: "",
    password: "",
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

    // Correctly call login with separate parameters
    const result = login(loginData.email, loginData.role, loginData.password);

    setAlert({
      open: true,
      severity: result.success ? "success" : "error",
      message: result.message,
    });

    if (result.success) {
      // Redirect user based on role
      switch (loginData.role) {
        case "admin":
          navigate("/admin");
          break;
        case "staff":
          navigate("/staff");
          break;
        case "user":
          navigate("/user");
          break;
        default:
          break;
      }
    } else {
      // Reset form on failed login
      setLoginData({ email: "", role: "", password: "" });
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
            Welcome Back
          </Typography>

          <FormControl fullWidth>
            <TextField
              label="Email"
              type="email"
              name="email"
              size="small"
              value={loginData.email}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, email: e.target.value }))
              }
              autoComplete="email"
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="role-label">User Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={loginData.role}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, role: e.target.value }))
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
              label="Password"
              type="password"
              name="password"
              size="small"
              value={loginData.password}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, password: e.target.value }))
              }
              autoComplete="current-password"
            />
          </FormControl>

          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ borderRadius: 2, py: 1.4 }}
            type="submit"
          >
            Login
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default LoginForm;
