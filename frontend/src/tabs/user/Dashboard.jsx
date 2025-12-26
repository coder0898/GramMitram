// import React from "react";
// import { Box, Grid, Card, CardContent, Typography, Paper } from "@mui/material";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// import { useUser } from "../../context/UserContext";

// const COLORS = ["#1976d2", "#ff9800", "#4caf50", "#f44336"];

// const Dashboard = () => {
//   const { getDashboardStats } = useUser();
//   const stats = getDashboardStats();

//   const cardData = [
//     {
//       label: "Total Applications",
//       value: stats.total,
//       color: "primary.main",
//     },
//     {
//       label: "Submitted",
//       value: stats.submitted,
//       color: "info.main",
//     },
//     {
//       label: "Under Review",
//       value: stats.underReview,
//       color: "warning.main",
//     },
//     {
//       label: "Approved",
//       value: stats.approved,
//       color: "success.main",
//     },
//     {
//       label: "Rejected",
//       value: stats.rejected,
//       color: "error.main",
//     },
//   ];

//   const pieData = [
//     { name: "Submitted", value: stats.submitted },
//     { name: "Under Review", value: stats.underReview },
//     { name: "Approved", value: stats.approved },
//     { name: "Rejected", value: stats.rejected },
//   ];

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" fontWeight={700} gutterBottom>
//         User Dashboard
//       </Typography>

//       {/* STAT CARDS */}
//       <Grid container spacing={4} sx={{ mb: 4 }}>
//         {cardData.map((stat) => (
//           <Grid item xs={12} sm={6} md={4} key={stat.label}>
//             <Card
//               sx={{
//                 minHeight: 120,
//                 display: "flex",
//                 alignItems: "center",
//                 backgroundColor: stat.color,
//                 color: "#fff",
//               }}
//             >
//               <CardContent>
//                 <Typography variant="subtitle1">{stat.label}</Typography>
//                 <Typography variant="h5" fontWeight={700}>
//                   {stat.value}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* CHART */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               Application Status Overview
//             </Typography>

//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={110}
//                   label
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;

import React from "react";
import { Box, Grid, Card, CardContent, Typography, Paper } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "../../context/UserContext";

const COLORS = ["#1976d2", "#ff9800", "#4caf50", "#f44336"];

const Dashboard = () => {
  const { getDashboardStats } = useUser();
  const stats = getDashboardStats; // <-- now it's an object, not a function

  const cardData = [
    { label: "Total Applications", value: stats.total, color: "primary.main" },
    { label: "Submitted", value: stats.submitted, color: "info.main" },
    { label: "Under Review", value: stats.underReview, color: "warning.main" },
    { label: "Approved", value: stats.approved, color: "success.main" },
    { label: "Rejected", value: stats.rejected, color: "error.main" },
  ];

  const pieData = [
    { name: "Submitted", value: stats.submitted },
    { name: "Under Review", value: stats.underReview },
    { name: "Approved", value: stats.approved },
    { name: "Rejected", value: stats.rejected },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        User Dashboard
      </Typography>

      {/* STAT CARDS */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {cardData.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.label}>
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

      {/* PIE CHART */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Application Status Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >
                  {pieData.map((entry, index) => (
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

export default Dashboard;
