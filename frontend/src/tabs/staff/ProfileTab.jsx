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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { currentUser, loading } = useAuth();
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

  // Fetch full user profile from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const fetchUser = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser({ id: currentUser.uid, ...docSnap.data() });
      }
    };

    fetchUser();
  }, [currentUser]);

  const handleChangePassword = async () => {
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

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );

      await reauthenticateWithCredential(
        currentUser.auth || currentUser,
        credential
      );

      await updatePassword(
        currentUser.auth || currentUser,
        passwordData.newPassword
      );

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
      setAlert({
        open: true,
        severity: "error",
        message:
          error.code === "auth/wrong-password"
            ? "Current password is incorrect"
            : "Failed to update password",
      });
    }
  };

  if (loading || !user) return null;

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
            <ListItemText primary="Username" secondary={user.username} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={currentUser.email} />
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
