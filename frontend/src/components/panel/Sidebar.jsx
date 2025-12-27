import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

const Sidebar = ({ menuItems, activeTab, setActiveTab }) => {
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  return (
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
};

export default Sidebar;
