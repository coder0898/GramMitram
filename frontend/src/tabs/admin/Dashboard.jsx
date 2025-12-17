import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
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

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    inActiveServices: 0,
    totalApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });

  const [chartData, setChartData] = useState({
    applicationsPerService: [],
    applicationStatusDistribution: [],
  });

  useEffect(() => {
    // Load data from localStorage or API
    const services = JSON.parse(localStorage.getItem("Services")) || [];
    const applications = JSON.parse(localStorage.getItem("applications")) || [];

    const totalServices = services.length;
    const activeServices = services.filter(
      (s) => s.service_status === true
    ).length;
    const inActiveServices = totalServices - activeServices;

    const totalApplications = applications.length;
    const approvedApplications = applications.filter(
      (a) => a.status === "approved"
    ).length;
    const rejectedApplications = applications.filter(
      (a) => a.status === "rejected"
    ).length;

    setStats({
      totalServices,
      activeServices,
      inActiveServices,
      totalApplications,
      approvedApplications,
      rejectedApplications,
    });

    // Chart Data
    const applicationsPerService = services.map((service) => {
      const count = applications.filter(
        (a) => a.serviceId === service.id
      ).length;
      return { name: service.name, count };
    });

    const applicationStatusDistribution = [
      { name: "Approved", value: approvedApplications },
      { name: "Rejected", value: rejectedApplications },
    ];

    setChartData({ applicationsPerService, applicationStatusDistribution });
  }, []);

  const COLORS = ["#FFBB28", "#00C49F", "#FF8042"];

  // Define cards dynamically based on current stats
  const cardData = [
    {
      label: "Total Services",
      value: stats.totalServices,
      color: "primary.main",
    },
    {
      label: "Active Services",
      value: stats.activeServices,
      color: "success.main",
    },
    {
      label: "InActive Services",
      value: stats.inActiveServices,
      color: "error.main",
    },
    {
      label: "Total Applications",
      value: stats.totalApplications,
      color: "primary.main",
    },

    {
      label: "Approved Applications",
      value: stats.approvedApplications,
      color: "success.main",
    },
    {
      label: "Rejected Applications",
      value: stats.rejectedApplications,
      color: "error.main",
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Officer Dashboard
      </Typography>

      {/* Quick Stats */}
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

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Applications per Service (Bar Chart) */}
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

        {/* Application Status Distribution (Pie Chart) */}
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
