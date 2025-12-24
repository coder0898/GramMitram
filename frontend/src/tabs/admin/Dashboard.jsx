import React, { useMemo } from "react";
import { Box, Grid, Card, CardContent, Typography, Paper } from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAdmin } from "../../context/AdminContext";

const Dashboard = () => {
  const { dashboardStats, applications, services } = useAdmin();

  const COLORS = ["#FFBB28", "#00C49F", "#FF8042"];

  // Compute chart data dynamically from context
  const chartData = useMemo(() => {
    // Applications per service
    const applicationsPerService = services.map((service) => {
      return {
        name: service.name || service.service,
        count: applications.filter(
          (app) => app.service === (service.name || service.service)
        ).length,
      };
    });

    // Application status distribution
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

    const applicationStatusDistribution = [
      { name: "Submitted", value: statusCounts.submitted },
      { name: "Under Review", value: statusCounts.under_review },
      { name: "Approved", value: statusCounts.approved },
      { name: "Rejected", value: statusCounts.rejected },
    ];

    return { applicationsPerService, applicationStatusDistribution };
  }, [applications, services]);

  const cardData = [
    {
      label: "Total Services",
      value: dashboardStats.totalServices,
      color: "primary.main",
    },
    {
      label: "Active Services",
      value: dashboardStats.activeServices,
      color: "success.main",
    },
    {
      label: "Inactive Services",
      value: dashboardStats.inactiveServices,
      color: "error.main",
    },
    {
      label: "Total Applications",
      value: dashboardStats.totalApplications,
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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Officer Dashboard
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        {cardData.map((stat) => (
          <Grid item sm={6} md={4} key={stat.label}>
            <Card
              sx={{
                minHeight: 120,
                display: "flex",
                alignItems: "center",
                backgroundColor: stat.color,
                color: "#fff",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1">{stat.label}</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Applications per Service
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.applicationsPerService}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Application Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.applicationStatusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.applicationStatusDistribution.map(
                    (entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    )
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
