import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  // Load users from localStorage
  const users = JSON.parse(localStorage.getItem("signupDetails")) || [];

  // Load logged-in user on refresh
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  // Signup function
  const signup = (username, email, role, password, confirmPassword) => {
    if (!username || !email || !role || !password || !confirmPassword) {
      return { success: false, message: "Please fill all fields." };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      return { success: false, message: "Email already registered." };
    }

    const newUser = { username, email, role, password };

    users.push(newUser);
    localStorage.setItem("signupDetails", JSON.stringify(users));

    return { success: true, message: "Signup successful!" };
  };

  // Login function
  const login = (email, role, password) => {
    if (!email || !role || !password) {
      return { success: false, message: "Please fill all fields." };
    }

    const foundUser = users.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (!foundUser) {
      return { success: false, message: "Invalid credentials." };
    }

    // Save logged-in user to localStorage and state
    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    setCurrentUser(foundUser);

    return { success: true, message: "Login successful!" };
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ signup, login, logout, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
