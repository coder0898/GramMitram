import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Auth from "./page/auth/Auth";
import AdminPanel from "./page/admin/AdminPanel";
import StaffPanel from "./page/staff/StaffPanel";
import UserPanel from "./page/user/UserPanel";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  const role = ["user", "staff", "admin"];
  const [tab, setTab] = useState(0);

  return (
    <Routes>
      <Route
        path="/"
        element={<Auth tab={tab} setTab={setTab} role={role} />}
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRole={["admin"]}>
            <AdminPanel />
          </PrivateRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <PrivateRoute allowedRole={["staff"]}>
            <StaffPanel />
          </PrivateRoute>
        }
      />

      <Route
        path="/user"
        element={
          <PrivateRoute allowedRole={["user"]}>
            <UserPanel />
          </PrivateRoute>
        }
      />

      <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
    </Routes>
  );
}

export default App;
