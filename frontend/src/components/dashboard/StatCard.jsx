import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ label, value, color }) => (
  <Card
    sx={{
      minHeight: 120,
      minWidth: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color,
      color: "#fff",
    }}
  >
    <CardContent sx={{ textAlign: "center" }}>
      <Typography variant="subtitle1">{label}</Typography>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default StatCard;
