import { Typography, Paper, Tab, Tabs, Fade, Box } from "@mui/material";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const Auth = ({ tab, setTab, role }) => {
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 5,
        }}
      >
        {/* Title Box with White Background */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            textAlign: "center",
            borderRadius: 2,
            backgroundColor: "white",
            minWidth: { xs: "90%", sm: 400 },
          }}
          elevation={3}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 1, color: "#6a11cb" }}
          >
            GramMitram
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ opacity: 0.9, color: "#6a11cb" }}
          >
            e-Gram Panchayat Portal
          </Typography>
        </Paper>
        <Paper
          elevation={10}
          sx={{
            width: { xs: "90%", sm: 400 },
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(8px)",
            backgroundColor: "white",
          }}
        >
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label="Login" sx={{ fontWeight: 600 }} />
            <Tab label="Sign Up" sx={{ fontWeight: 600 }} />
          </Tabs>

          {/* Animated Content */}
          <Box sx={{ position: "relative", minHeight: "260px" }}>
            <Fade in={tab === 0} timeout={400} unmountOnExit mountOnEnter>
              <Box
                sx={{
                  position: tab === 0 ? "relative" : "absolute",
                  width: "100%",
                }}
              >
                <LoginForm role={role} alert={alert} setAlert={setAlert} />
              </Box>
            </Fade>

            <Fade in={tab === 1} timeout={400} unmountOnExit mountOnEnter>
              <Box
                sx={{
                  position: tab === 1 ? "relative" : "absolute",
                  width: "100%",
                }}
              >
                <SignupForm role={role} alert={alert} setAlert={setAlert} />
              </Box>
            </Fade>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Auth;
