import React from "react";
import PanelLayout from "../../components/panel/PanelLayout";
import { useAuth } from "../../context/AuthContext";

import Dashboard from "../../tabs/Dashboard";
import ServiceTab from "../../tabs/ServiceTab";
import ApplicationTab from "../../tabs/ApplicationTab"; // unified component
import ProfileTab from "../../tabs/ProfileTab";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import AppsIcon from "@mui/icons-material/Apps";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Service View", icon: <BuildCircleIcon /> },
  { label: "Application Management", icon: <AppsIcon /> },
  { label: "Profile", icon: <AccountCircleIcon /> },
];

export default function StaffPanel() {
  const { logout } = useAuth();

  return (
    <PanelLayout
      menuItems={menuItems}
      title="GramMitram"
      logout={logout}
      children={{
        Dashboard: <Dashboard />,
        "Service View": <ServiceTab />,
        "Application Management": <ApplicationTab />,
        Profile: <ProfileTab />,
      }}
    />
  );
}
