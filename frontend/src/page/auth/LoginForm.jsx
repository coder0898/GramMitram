import {
  Alert,
  Button,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.VITE_PUBLIC_API_BASE;

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(
        () => setAlert((prev) => ({ ...prev, open: false })),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [alert.open]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Attempt login
    const result = await login(loginData.email, loginData.password);

    // 2️⃣ Save login action to backend log route
    try {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      await fetch(`${API_BASE}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid || "unknown",
          role: user?.role || "user",
          action: "login",
          details: { email: loginData.email, success: result.success },
        }),
      });
    } catch (err) {
      console.error("Failed to log login action:", err);
    }

    // 3️⃣ Show alert
    setAlert({
      open: true,
      severity: result.success ? "success" : "error",
      message: result.message,
    });

    setLoading(false);

    // 4️⃣ Navigate if successful
    if (result.success) {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      navigate(`/${user.role}`);
    } else {
      setLoginData({ email: "", password: "" });
    }
  };

  return (
    <>
      {alert.open && (
        <Alert
          severity={alert.severity}
          sx={{ mb: 2 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setAlert((prev) => ({ ...prev, open: false }))}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.message}
        </Alert>
      )}

      <form onSubmit={onSubmitHandler}>
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center" fontWeight={700}>
            Welcome Back
          </Typography>

          <FormControl fullWidth>
            <TextField
              label="Email"
              type="email"
              size="small"
              required
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Password"
              type="password"
              size="small"
              required
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default LoginForm;
