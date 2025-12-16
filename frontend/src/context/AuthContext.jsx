import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  // Load users from localStorage (DB)
  const users = JSON.parse(localStorage.getItem("signupDetails"));
  const userList = Array.isArray(users) ? users : [];

  // Load logged-in user on refresh
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const signup = (
    username,
    email,
    password,
    confirmPassword,
    role = "user"
  ) => {
    if (!username || !email || !password || !confirmPassword) {
      return { success: false, message: "Please fill all fields." };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match." };
    }

    const storedUsers = JSON.parse(localStorage.getItem("signupDetails"));
    const usersArray = Array.isArray(storedUsers) ? storedUsers : [];

    const userExists = usersArray.find((u) => u.email === email);
    if (userExists) {
      return { success: false, message: "Email already registered." };
    }

    const newUser = {
      username,
      email,
      role,
      password,
      createdAt: new Date().toISOString(),
    };
    usersArray.push(newUser);

    localStorage.setItem("signupDetails", JSON.stringify(usersArray));

    return { success: true, message: "Signup successful!" };
  };

  // LOGIN (Role auto-detected)
  const login = (email, password) => {
    if (!email || !password) {
      return { success: false, message: "Please fill all fields." };
    }

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      return { success: false, message: "Invalid credentials." };
    }

    // Save logged-in user to localStorage and state
    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    setCurrentUser(foundUser);

    return { success: true, message: "Login successful!" };
  };

  // LOGOUT
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

export const useAuth = () => useContext(AuthContext);
