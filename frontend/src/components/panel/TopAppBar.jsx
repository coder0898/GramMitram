import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

const TopAppBar = ({ title, handleDrawerToggle, logout }) => (
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
        {title}
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
);

export default TopAppBar;
