// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Grid,
//   Alert,
//   Stack,
//   Divider,
// } from "@mui/material";

// const ProfileTab = () => {
//   const [user, setUser] = useState(null);
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [alert, setAlert] = useState({
//     open: false,
//     severity: "",
//     message: "",
//   });

//   /* ================= LOAD LOGGED-IN USER ================= */
//   useEffect(() => {
//     const loggedInUser =
//       JSON.parse(localStorage.getItem("loggedInUser")) || null;
//     setUser(loggedInUser);
//   }, []);

//   /* ================= CHANGE PASSWORD ================= */
//   const handleChangePassword = () => {
//     if (
//       !passwordData.currentPassword ||
//       !passwordData.newPassword ||
//       !passwordData.confirmPassword
//     ) {
//       return setAlert({
//         open: true,
//         severity: "error",
//         message: "All fields are required",
//       });
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       return setAlert({
//         open: true,
//         severity: "error",
//         message: "New passwords do not match",
//       });
//     }

//     if (passwordData.currentPassword !== user.password) {
//       return setAlert({
//         open: true,
//         severity: "error",
//         message: "Current password is incorrect",
//       });
//     }

//     const users = JSON.parse(localStorage.getItem("signupDetails")) || [];

//     const updatedUsers = users.map((u) =>
//       u.email === user.email ? { ...u, password: passwordData.newPassword } : u
//     );

//     localStorage.setItem("signupDetails", JSON.stringify(updatedUsers));

//     const updatedUser = {
//       ...user,
//       password: passwordData.newPassword,
//     };
//     localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
//     setUser(updatedUser);

//     setPasswordData({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });

//     setAlert({
//       open: true,
//       severity: "success",
//       message: "Password updated successfully",
//     });
//   };

//   if (!user) return null;

//   return (
//     <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
//       <Paper sx={{ p: 4 }}>
//         <Typography variant="h5" fontWeight={700} gutterBottom>
//           My Profile
//         </Typography>

//         {alert.open && (
//           <Alert
//             severity={alert.severity}
//             sx={{ mb: 3 }}
//             onClose={() => setAlert({ ...alert, open: false })}
//           >
//             {alert.message}
//           </Alert>
//         )}

//         {/* ================= PROFILE DETAILS ================= */}
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//             <TextField
//               label="Username"
//               fullWidth
//               value={user.username}
//               disabled
//             />
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <TextField label="Email" fullWidth value={user.email} disabled />
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <TextField label="Role" fullWidth value={user.role} disabled />
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 4 }} />

//         {/* ================= CHANGE PASSWORD ================= */}
//         <Typography variant="h6" fontWeight={600} gutterBottom>
//           Change Password
//         </Typography>

//         <Stack spacing={2} maxWidth={400}>
//           <TextField
//             label="Current Password"
//             type="password"
//             value={passwordData.currentPassword}
//             onChange={(e) =>
//               setPasswordData({
//                 ...passwordData,
//                 currentPassword: e.target.value,
//               })
//             }
//           />

//           <TextField
//             label="New Password"
//             type="password"
//             value={passwordData.newPassword}
//             onChange={(e) =>
//               setPasswordData({
//                 ...passwordData,
//                 newPassword: e.target.value,
//               })
//             }
//           />

//           <TextField
//             label="Confirm New Password"
//             type="password"
//             value={passwordData.confirmPassword}
//             onChange={(e) =>
//               setPasswordData({
//                 ...passwordData,
//                 confirmPassword: e.target.value,
//               })
//             }
//           />

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleChangePassword}
//           >
//             Update Password
//           </Button>
//         </Stack>
//       </Paper>
//     </Box>
//   );
// };

// export default ProfileTab;

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stack,
  Paper,
} from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });

  // Load logged-in user
  useEffect(() => {
    const loggedInUser =
      JSON.parse(localStorage.getItem("loggedInUser")) || null;
    setUser(loggedInUser);
  }, []);

  // Handle password change
  const handleChangePassword = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      return setAlert({
        open: true,
        severity: "error",
        message: "All fields are required",
      });
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setAlert({
        open: true,
        severity: "error",
        message: "New passwords do not match",
      });
    }

    if (passwordData.currentPassword !== user.password) {
      return setAlert({
        open: true,
        severity: "error",
        message: "Current password is incorrect",
      });
    }

    const users = JSON.parse(localStorage.getItem("signupDetails")) || [];

    const updatedUsers = users.map((u) =>
      u.email === user.email ? { ...u, password: passwordData.newPassword } : u
    );

    localStorage.setItem("signupDetails", JSON.stringify(updatedUsers));

    const updatedUser = { ...user, password: passwordData.newPassword };
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    setUser(updatedUser);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setOpenDialog(false);

    setAlert({
      open: true,
      severity: "success",
      message: "Password updated successfully",
    });
  };

  if (!user) return null;

  return (
    <Box sx={{ mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          My Profile
        </Typography>

        {alert.open && (
          <Alert
            severity={alert.severity}
            sx={{ mb: 2 }}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            {alert.message}
          </Alert>
        )}

        {/* Profile as List */}
        <List>
          <ListItem>
            <ListItemText primary="Username" secondary={user.username} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Role" secondary={user.role} />
          </ListItem>
        </List>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Change Password
          </Button>
        </Box>

        {/* Change Password Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
              <TextField
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />
              <TextField
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleChangePassword}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default Profile;
