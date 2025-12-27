import React from "react";
import PanelLayout from "../../components/panel/PanelLayout";
import { useAuth } from "../../context/AuthContext";

import Dashboard from "../../tabs/Dashboard";
import ServiceTab from "../../tabs/ServiceTab";
import ApplicationTab from "../../tabs/ApplicationTab";
import StaffTab from "../../tabs/StaffTab";
import ProfileTab from "../../tabs/ProfileTab";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import AppsIcon from "@mui/icons-material/Apps";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Service Management", icon: <BuildCircleIcon /> },
  { label: "Application Management", icon: <AppsIcon /> },
  { label: "Staff Management", icon: <GroupIcon /> },
  { label: "Profile", icon: <AccountCircleIcon /> },
  { label: "Audit Logs", icon: <HistoryIcon /> },
];

export default function AdminPanel() {
  const { logout } = useAuth();

  return (
    <PanelLayout
      menuItems={menuItems}
      title="GramMitram"
      logout={logout}
      children={{
        Dashboard: <Dashboard />,
        "Service Management": <ServiceTab />,
        "Application Management": <ApplicationTab />,
        "Staff Management": <StaffTab />,
        Profile: <ProfileTab />,
        "Audit Logs": <div>Audit Logs Content</div>,
      }}
    />
  );
}
