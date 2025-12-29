import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const AuditLogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(`${API_BASE}/api/logs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch audit logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [getToken]);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Audit Logs
      </Typography>

      {logs.length === 0 ? (
        <Typography>No logs available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.role}</TableCell>
                  <TableCell>{log.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AuditLogsTab;
