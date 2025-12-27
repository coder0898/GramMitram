import React, { useMemo } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

import StatCard from "../components/dashboard/StatCard";
import PieChartComponent from "../components/dashboard/PieChartComponent";
import BarChartComponent from "../components/dashboard/BarChartComponent";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const {
    applications,
    myApplications,
    staffApplications,
    services,
    adminStats,
    staffStats,
    userStats,
  } = useApp();

  /* ================= ROLE-BASED DATA ================= */
  const { cards, pieData, barData } = useMemo(() => {
    if (!role) return { cards: [], pieData: [], barData: null };

    if (role === "admin") {
      // Cards
      const cards = [
        {
          label: "Total Services",
          value: adminStats.totalServices,
          color: "primary.main",
        },
        {
          label: "Active Services",
          value: adminStats.activeServices,
          color: "success.main",
        },
        {
          label: "Inactive Services",
          value: adminStats.inactiveServices,
          color: "error.main",
        },
        {
          label: "Total Applications",
          value: adminStats.totalApplications,
          color: "primary.main",
        },
        {
          label: "Applications Under Review",
          value: applications.filter((a) => a.status === "under_review").length,
          color: "warning.main",
        },
        {
          label: "Submitted Applications",
          value: applications.filter((a) => a.status === "submitted").length,
          color: "info.main",
        },
      ];

      // Pie chart
      const statusCounts = applications.reduce(
        (acc, app) => {
          if (app.status === "submitted") acc.submitted += 1;
          else if (app.status === "under_review") acc.under_review += 1;
          else if (app.status === "approved") acc.approved += 1;
          else if (app.status === "rejected") acc.rejected += 1;
          return acc;
        },
        { submitted: 0, under_review: 0, approved: 0, rejected: 0 }
      );

      const pieData = [
        { name: "Submitted", value: statusCounts.submitted },
        { name: "Under Review", value: statusCounts.under_review },
        { name: "Approved", value: statusCounts.approved },
        { name: "Rejected", value: statusCounts.rejected },
      ];

      // Applications per service for Bar chart
      const barData = services.map((s) => ({
        name: s.name || s.service,
        count: applications.filter((a) => a.service === (s.name || s.service))
          .length,
      }));

      return { cards, pieData, barData };
    }

    if (role === "staff") {
      const cards = [
        {
          label: "Total Assigned Applications",
          value: staffStats.totalAssigned,
          color: "primary.main",
        },
        {
          label: "Applications Under Review",
          value: staffStats.underReview,
          color: "info.main",
        },
        {
          label: "Forwarded to Officer",
          value: staffStats.forwarded,
          color: "success.main",
        },
        {
          label: "Rejected Applications",
          value: staffStats.rejected,
          color: "error.main",
        },
      ];

      const pieData = [
        { name: "Under Review", value: staffStats.underReview },
        { name: "Forwarded", value: staffStats.forwarded },
        { name: "Rejected", value: staffStats.rejected },
      ];

      return { cards, pieData, barData: null };
    }

    // User
    const cards = [
      {
        label: "Total Applications",
        value: userStats.total,
        color: "primary.main",
      },
      { label: "Submitted", value: userStats.submitted, color: "info.main" },
      {
        label: "Under Review",
        value: userStats.underReview,
        color: "warning.main",
      },
      { label: "Approved", value: userStats.approved, color: "success.main" },
      { label: "Rejected", value: userStats.rejected, color: "error.main" },
    ];

    const pieData = [
      { name: "Submitted", value: userStats.submitted },
      { name: "Under Review", value: userStats.underReview },
      { name: "Approved", value: userStats.approved },
      { name: "Rejected", value: userStats.rejected },
    ];

    return { cards, pieData, barData: null };
  }, [
    role,
    applications,
    myApplications,
    staffApplications,
    services,
    adminStats,
    staffStats,
    userStats,
  ]);

  if (!role) return null;

  /* ================= COLOR SCHEMES ================= */
  const COLORS_PIE = ["#1976d2", "#ff9800", "#4caf50", "#f44336"];
  const COLORS_ADMIN_PIE = ["#FFBB28", "#00C49F", "#FF8042"];
  const COLORS_STAFF_PIE = ["#00C49F", "#0088FE", "#FF4C4C"];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
      </Typography>

      {/* STAT CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Bar chart for admin only */}
        {barData && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Applications per Service
              </Typography>
              <BarChartComponent
                data={barData}
                dataKey="count"
                fill="#1976d2"
              />
            </Paper>
          </Grid>
        )}

        {/* Pie chart for all roles */}
        <Grid item xs={12} md={barData ? 6 : 12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Application Status Overview
            </Typography>
            <PieChartComponent
              data={pieData}
              colors={
                role === "admin"
                  ? COLORS_ADMIN_PIE
                  : role === "staff"
                  ? COLORS_STAFF_PIE
                  : COLORS_PIE
              }
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
