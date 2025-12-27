import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Chip,
} from "@mui/material";

const statusColor = (status) => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "error";
    case "under_review":
      return "warning";
    default:
      return "default";
  }
};

const ApplicationTable = ({ role, data, onView }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead sx={{ backgroundColor: "primary.main" }}>
        <TableRow>
          <TableCell sx={{ color: "#fff" }}>ID</TableCell>
          {role !== "user" && (
            <TableCell sx={{ color: "#fff" }}>Applicant</TableCell>
          )}
          <TableCell sx={{ color: "#fff" }}>Service</TableCell>
          <TableCell sx={{ color: "#fff" }}>Status</TableCell>
          <TableCell sx={{ color: "#fff" }}>Date</TableCell>
          <TableCell sx={{ color: "#fff" }}>Staff</TableCell>
          <TableCell sx={{ color: "#fff" }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && data.length ? (
          data.map((app) => {
            // Determine if View button should be disabled
            let disableView = false;
            if (role === "admin") disableView = !!app.staff; // Admin cannot view after assigning staff
            if (role === "staff")
              disableView =
                app.status === "approved" || app.status === "rejected"; // Staff cannot view if already processed
            // Users can always view their own applications
            return (
              <TableRow key={app.id} hover>
                <TableCell>{app.id}</TableCell>
                {role !== "user" && <TableCell>{app.userEmail}</TableCell>}
                <TableCell>{app.service}</TableCell>
                <TableCell>
                  <Chip
                    label={app.status}
                    color={statusColor(app.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {app.createdAt?.toDate?.().toLocaleDateString() || "-"}
                </TableCell>
                <TableCell>{app.staff || "None"}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onView(app)}
                    disabled={disableView}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={role !== "user" ? 7 : 6} align="center">
              No applications found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ApplicationTable;
