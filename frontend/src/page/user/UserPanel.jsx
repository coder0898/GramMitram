import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import Dashboard from "../../tabs/user/Dashboard";
import ServiceTab from "../../tabs/user/ServiceTab";
import ApplyServiceTab from "../../tabs/user/ApplyServiceTab";
import ApplicationTab from "../../tabs/user/ApplicationTab";
import ProfileTab from "../../tabs/user/ProfileTab";

import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AppsIcon from "@mui/icons-material/Apps";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import UserProvider from "../../context/UserContext";

const drawerWidth = 290;

/* USER MENU */
const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "View Services", icon: <BuildCircleIcon /> },
  { label: "Apply Service", icon: <AssignmentIcon /> },
  { label: "My Applications", icon: <AppsIcon /> },
  { label: "Profile", icon: <AccountCircleIcon /> },
];

const UserPanel = () => {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
    }, 200);
  };

  /* TAB CONTENT MAP */
  const tabContentMap = {
    Dashboard: <Dashboard />,
    "View Services": (
      <ServiceTab onApplyClick={() => handleTabChange("Apply Service")} />
    ),
    "Apply Service": <ApplyServiceTab />,
    "My Applications": <ApplicationTab />,
    Profile: <ProfileTab />,
  };

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => handleTabChange(item.label)}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              transition: "all 0.3s ease",
              backgroundColor:
                activeTab === item.label ? "primary.main" : "transparent",
              color: activeTab === item.label ? "white" : "text.primary",
              "&:hover": {
                backgroundColor:
                  activeTab === item.label ? "primary.dark" : "action.hover",
                transform: "translateX(6px)",
              },
            }}
          >
            <ListItemIcon
              sx={{ color: activeTab === item.label ? "white" : "inherit" }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <UserProvider>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* TOP APP BAR */}
        <AppBar position="fixed" sx={{ zIndex: 1300 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Digital E Gram Panchayat
            </Typography>

            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={logout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* SIDEBAR */}
        <Box component="nav" sx={{ width: { sm: drawerWidth } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* MAIN CONTENT */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Box
            sx={{
              transition: "all 0.25s ease",
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? "translateY(10px)" : "translateY(0)",
            }}
          >
            <Typography variant="h4" gutterBottom>
              {activeTab}
            </Typography>

            <Box sx={{ mt: 2 }}>{tabContentMap[activeTab]}</Box>
          </Box>
        </Box>
      </Box>
    </UserProvider>
  );
};

export default UserPanel;
