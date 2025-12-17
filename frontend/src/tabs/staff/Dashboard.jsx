import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StaffDashboard = () => {
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pending: 0,
    underReview: 0,
    forwardedToOfficer: 0,
    rejected: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fetch applications assigned to logged-in staff
    const applications = JSON.parse(localStorage.getItem("applications")) || [];

    const totalAssigned = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const underReview = applications.filter(
      (a) => a.status === "under_review"
    ).length;
    const forwardedToOfficer = applications.filter(
      (a) => a.status === "forwarded"
    ).length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    setStats({
      totalAssigned,
      pending,
      underReview,
      forwardedToOfficer,
      rejected,
    });

    setChartData([
      { name: "Pending", value: pending },
      { name: "Under Review", value: underReview },
      { name: "Forwarded", value: forwardedToOfficer },
      { name: "Rejected", value: rejected },
    ]);
  }, []);

  const COLORS = ["#FFBB28", "#00C49F", "#0088FE", "#FF4C4C"];

  const cardData = [
    {
      label: "Total Assigned Applications",
      value: stats.totalAssigned,
      color: "primary.main",
    },
    {
      label: "Applications Under Review",
      value: stats.underReview,
      color: "info.main",
    },
    {
      label: "Pending Applications",
      value: stats.pending,
      color: "warning.main",
    },

    {
      label: "Forwarded to Officer",
      value: stats.forwardedToOfficer,
      color: "success.main",
    },
    {
      label: "Rejected Applications",
      value: stats.rejected,
      color: "error.main",
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Staff Dashboard
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cardData.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.label}>
            <Card
              sx={{
                backgroundColor: card.color,
                color: "#fff",
                minHeight: 110,
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1">{card.label}</Typography>
                <Typography variant="h5" fontWeight={700}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Application Status Summary */}
      <Grid container>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Application Status Summary
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
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

export default StaffDashboard;
