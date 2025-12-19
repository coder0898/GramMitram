import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { AdminPanelProvider } from "./context/AdminContext.jsx";
import { StaffProvider } from "./context/StaffContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminPanelProvider>
        <AuthProvider>
          <StaffProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </StaffProvider>
        </AuthProvider>
      </AdminPanelProvider>
    </BrowserRouter>
  </StrictMode>
);
