import React from "react";
import PanelLayout from "../../components/panel/PanelLayout";
import { useAuth } from "../../context/AuthContext";

import Dashboard from "../../tabs/Dashboard";
import ServiceTab from "../../tabs/ServiceTab";
import ApplyServiceTab from "../../tabs/ApplyServiceTab";
import ApplicationTab from "../../tabs/ApplicationTab"; // unified component
import ProfileTab from "../../tabs/ProfileTab";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AppsIcon from "@mui/icons-material/Apps";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "View Services", icon: <BuildCircleIcon /> },
  // { label: "Apply Service", icon: <AssignmentIcon /> },
  { label: "My Applications", icon: <AppsIcon /> },
  { label: "Profile", icon: <AccountCircleIcon /> },
];

export default function UserPanel() {
  const { logout } = useAuth();

  return (
    <PanelLayout
      menuItems={menuItems}
      title="Digital E Gram Panchayat"
      logout={logout}
      children={{
        Dashboard: <Dashboard />,
        "View Services": <ServiceTab onApplyClick={() => {}} />, // handleApplyClick can be added inside ServiceTab if needed
        // "Apply Service": <ApplyServiceTab />,
        "My Applications": <ApplicationTab />,
        Profile: <ProfileTab />,
      }}
    />
  );
}
