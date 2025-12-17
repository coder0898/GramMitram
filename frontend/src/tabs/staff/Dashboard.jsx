import React from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useStaff } from "../../context/StaffContext";

const COLORS = ["#00C49F", "#0088FE", "#FF4C4C"];

const StaffDashboard = () => {
  const { stats, chartData } = useStaff();

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

      {/* Status Chart */}
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
