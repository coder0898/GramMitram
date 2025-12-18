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

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.open]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const result = login(loginData.email, loginData.password);

    setAlert({
      open: true,
      severity: result.success ? "success" : "error",
      message: result.message,
    });

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
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
          </FormControl>

          <Button fullWidth variant="contained" type="submit">
            Login
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default LoginForm;
