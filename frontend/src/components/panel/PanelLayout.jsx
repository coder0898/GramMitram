import React, { useState } from "react";
import { Box, CssBaseline, Drawer, Typography } from "@mui/material";
import TopAppBar from "./TopAppBar";
import Sidebar from "./Sidebar.jsx";

const drawerWidth = 290;

const PanelLayout = ({ menuItems, title, children, logout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(menuItems[0].label);
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

  const drawer = (
    <Sidebar
      menuItems={menuItems}
      activeTab={activeTab}
      setActiveTab={handleTabChange}
    />
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopAppBar
        title={title}
        handleDrawerToggle={handleDrawerToggle}
        logout={logout}
      />
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
          <Box sx={{ mt: 2 }}>{children[activeTab]}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PanelLayout;
