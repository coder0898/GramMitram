// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Alert,
//   Stack,
//   Paper,
// } from "@mui/material";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
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

//   // Load logged-in user
//   useEffect(() => {
//     const loggedInUser =
//       JSON.parse(localStorage.getItem("loggedInUser")) || null;
//     setUser(loggedInUser);
//   }, []);

//   // Handle password change
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

//     const updatedUser = { ...user, password: passwordData.newPassword };
//     localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
//     setUser(updatedUser);

//     setPasswordData({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });

//     setOpenDialog(false);

//     setAlert({
//       open: true,
//       severity: "success",
//       message: "Password updated successfully",
//     });
//   };

//   if (!user) return null;

//   return (
//     <Box sx={{ mx: "auto", mt: 4 }}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h5" fontWeight={700} gutterBottom>
//           My Profile
//         </Typography>

//         {alert.open && (
//           <Alert
//             severity={alert.severity}
//             sx={{ mb: 2 }}
//             onClose={() => setAlert({ ...alert, open: false })}
//           >
//             {alert.message}
//           </Alert>
//         )}

//         {/* Profile as List */}
//         <List>
//           <ListItem>
//             <ListItemText primary="Username" secondary={user.username} />
//           </ListItem>
//           <ListItem>
//             <ListItemText primary="Email" secondary={user.email} />
//           </ListItem>
//           <ListItem>
//             <ListItemText primary="Role" secondary={user.role} />
//           </ListItem>
//         </List>

//         <Box sx={{ mt: 2 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setOpenDialog(true)}
//           >
//             Change Password
//           </Button>
//         </Box>

//         {/* Change Password Dialog */}
//         <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//           <DialogTitle>Change Password</DialogTitle>
//           <DialogContent>
//             <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
//               <TextField
//                 label="Current Password"
//                 type="password"
//                 value={passwordData.currentPassword}
//                 onChange={(e) =>
//                   setPasswordData({
//                     ...passwordData,
//                     currentPassword: e.target.value,
//                   })
//                 }
//               />
//               <TextField
//                 label="New Password"
//                 type="password"
//                 value={passwordData.newPassword}
//                 onChange={(e) =>
//                   setPasswordData({
//                     ...passwordData,
//                     newPassword: e.target.value,
//                   })
//                 }
//               />
//               <TextField
//                 label="Confirm New Password"
//                 type="password"
//                 value={passwordData.confirmPassword}
//                 onChange={(e) =>
//                   setPasswordData({
//                     ...passwordData,
//                     confirmPassword: e.target.value,
//                   })
//                 }
//               />
//             </Stack>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//             <Button variant="contained" onClick={handleChangePassword}>
//               Update
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Paper>
//     </Box>
//   );
// };

// export default Profile;

import React, { useState } from "react";
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
import { useAuth } from "../../context/AuthContext";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";

const Profile = () => {
  const { currentUser } = useAuth();
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

  if (!currentUser) return null;

  // Handle password change securely
  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setAlert({
        open: true,
        severity: "error",
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return setAlert({
        open: true,
        severity: "error",
        message: "New passwords do not match",
      });
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Reauthenticate first
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

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
    } catch (error) {
      setAlert({ open: true, severity: "error", message: error.message });
    }
  };

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

        <List>
          <ListItem>
            <ListItemText primary="UserName" secondary={currentUser.username} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={currentUser.email} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Role" secondary={currentUser.role} />
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
