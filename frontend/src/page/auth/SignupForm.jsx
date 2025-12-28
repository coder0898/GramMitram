import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";

const SignupForm = () => {
  const { signup } = useAuth();

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  // const onSubmitHandler = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const result = await signup(
  //     signupData.username,
  //     signupData.email,
  //     signupData.password,
  //     signupData.confirmPassword
  //   );

  //   setAlert({
  //     open: true,
  //     severity: result.success ? "success" : "error",
  //     message: result.message,
  //   });

  //   setLoading(false);

  //   if (result.success) {
  //     setSignupData({
  //       username: "",
  //       email: "",
  //       password: "",
  //       confirmPassword: "",
  //     });
  //   }
  // };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1️⃣ Attempt signup
    const result = await signup(
      signupData.username,
      signupData.email,
      signupData.password,
      signupData.confirmPassword
    );

    // 2️⃣ Log signup action to backend
    try {
      // Get the user from localStorage if signup saved it, otherwise use email
      const user = JSON.parse(localStorage.getItem("loggedInUser")) || {
        uid: "unknown",
        role: "user",
      };

      await fetch("http://localhost:5000/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid || "unknown",
          role: user?.role || "user",
          action: "signup",
          details: {
            username: signupData.username,
            email: signupData.email,
            success: result.success,
            message: result.message,
          },
        }),
      });
    } catch (err) {
      console.error("Failed to log signup action:", err);
    }

    // 3️⃣ Show alert
    setAlert({
      open: true,
      severity: result.success ? "success" : "error",
      message: result.message,
    });

    setLoading(false);

    // 4️⃣ Clear form if successful
    if (result.success) {
      setSignupData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
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
          <Typography variant="h5" fontWeight={700} textAlign="center">
            Create Your Account
          </Typography>

          <FormControl fullWidth>
            <TextField
              label="User Name"
              size="small"
              required
              value={signupData.username}
              onChange={(e) =>
                setSignupData({ ...signupData, username: e.target.value })
              }
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Email"
              type="email"
              size="small"
              required
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Password"
              type="password"
              size="small"
              required
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label="Confirm Password"
              type="password"
              size="small"
              required
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </FormControl>

          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default SignupForm;
