// // // // import { createContext, useContext, useState, useEffect } from "react";

// // // // export const AuthContext = createContext();

// // // // export const AuthProvider = ({ children }) => {
// // // //   const [currentUser, setCurrentUser] = useState(
// // // //     () => JSON.parse(localStorage.getItem("loggedInUser")) || null
// // // //   );

// // // //   // Load users from localStorage (DB)
// // // //   const users = JSON.parse(localStorage.getItem("signupDetails"));
// // // //   const userList = Array.isArray(users) ? users : [];

// // // //   // Load logged-in user on refresh
// // // //   useEffect(() => {
// // // //     const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
// // // //     if (savedUser) setCurrentUser(savedUser);
// // // //   }, []);

// // // //   const signup = (
// // // //     username,
// // // //     email,
// // // //     password,
// // // //     confirmPassword,
// // // //     role = "user"
// // // //   ) => {
// // // //     if (!username || !email || !password || !confirmPassword) {
// // // //       return { success: false, message: "Please fill all fields." };
// // // //     }

// // // //     if (password !== confirmPassword) {
// // // //       return { success: false, message: "Passwords do not match." };
// // // //     }

// // // //     const storedUsers = JSON.parse(localStorage.getItem("signupDetails"));
// // // //     const usersArray = Array.isArray(storedUsers) ? storedUsers : [];

// // // //     const userExists = usersArray.find((u) => u.email === email);
// // // //     if (userExists) {
// // // //       return { success: false, message: "Email already registered." };
// // // //     }

// // // //     const newUser = {
// // // //       username,
// // // //       email,
// // // //       role,
// // // //       password,
// // // //       createdAt: new Date().toISOString(),
// // // //     };
// // // //     usersArray.push(newUser);

// // // //     localStorage.setItem("signupDetails", JSON.stringify(usersArray));

// // // //     return { success: true, message: "Signup successful!" };
// // // //   };

// // // //   // LOGIN (Role auto-detected)
// // // //   const login = (email, password) => {
// // // //     if (!email || !password) {
// // // //       return { success: false, message: "Please fill all fields." };
// // // //     }

// // // //     const foundUser = users.find(
// // // //       (u) => u.email === email && u.password === password
// // // //     );

// // // //     if (!foundUser) {
// // // //       return { success: false, message: "Invalid credentials." };
// // // //     }

// // // //     // Save logged-in user to localStorage and state
// // // //     localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
// // // //     setCurrentUser(foundUser);

// // // //     return { success: true, message: "Login successful!" };
// // // //   };

// // // //   // LOGOUT
// // // //   const logout = () => {
// // // //     localStorage.removeItem("loggedInUser");
// // // //     setCurrentUser(null);
// // // //   };

// // // //   return (
// // // //     <AuthContext.Provider value={{ signup, login, logout, currentUser }}>
// // // //       {children}
// // // //     </AuthContext.Provider>
// // // //   );
// // // // };

// // // // export const useAuth = () => useContext(AuthContext);

// // // // AuthContext.js
// // // import { createContext, useContext, useEffect, useState } from "react";

// // // const AuthContext = createContext();
// // // export const useAuth = () => useContext(AuthContext);

// // // export const AuthProvider = ({ children }) => {
// // //   const [currentUser, setCurrentUser] = useState(null);

// // //   useEffect(() => {
// // //     const saved = JSON.parse(localStorage.getItem("loggedInUser"));
// // //     if (saved) setCurrentUser(saved);
// // //   }, []);

// // //   const signup = (
// // //     username,
// // //     email,
// // //     password,
// // //     confirmPassword,
// // //     role = "user"
// // //   ) => {
// // //     if (!username || !email || !password || !confirmPassword)
// // //       return { success: false, message: "All fields required" };

// // //     if (password !== confirmPassword)
// // //       return { success: false, message: "Passwords do not match" };

// // //     const users = JSON.parse(localStorage.getItem("signupDetails")) || [];

// // //     if (users.some((u) => u.email === email))
// // //       return { success: false, message: "Email already exists" };

// // //     users.push({
// // //       username,
// // //       email,
// // //       password,
// // //       role,
// // //       createdAt: new Date().toISOString(),
// // //     });

// // //     localStorage.setItem("signupDetails", JSON.stringify(users));
// // //     return { success: true, message: "Signup successful" };
// // //   };

// // //   const login = (email, password) => {
// // //     const users = JSON.parse(localStorage.getItem("signupDetails")) || [];
// // //     const found = users.find(
// // //       (u) => u.email === email && u.password === password
// // //     );

// // //     if (!found) return { success: false, message: "Invalid credentials" };

// // //     localStorage.setItem("loggedInUser", JSON.stringify(found));
// // //     setCurrentUser(found);
// // //     return { success: true };
// // //   };

// // //   const logout = () => {
// // //     localStorage.removeItem("loggedInUser");
// // //     setCurrentUser(null);
// // //   };

// // //   return (
// // //     <AuthContext.Provider value={{ signup, login, logout, currentUser }}>
// // //       {children}
// // //     </AuthContext.Provider>
// // //   );
// // // };

// // import React, { createContext, useContext, useState } from "react";
// // import { useAdmin } from "./AdminContext";

// // export const AuthContext = createContext();
// // export const useAuth = () => useContext(AuthContext);

// // export const AuthProvider = ({ children }) => {
// //   const { signupDetails } = useAdmin(); // Get users from AdminContext
// //   const [currentUser, setCurrentUser] = useState(
// //     () => JSON.parse(localStorage.getItem("loggedInUser")) || null
// //   );

// //   // LOGIN
// //   const login = (email, password) => {
// //     if (!email || !password)
// //       return { success: false, message: "Please fill all fields." };

// //     const foundUser = signupDetails.find(
// //       (u) => u.email === email && u.password === password
// //     );
// //     if (!foundUser) return { success: false, message: "Invalid credentials." };

// //     localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
// //     setCurrentUser(foundUser);

// //     return { success: true, message: "Login successful!" };
// //   };

// //   // LOGOUT
// //   const logout = () => {
// //     localStorage.removeItem("loggedInUser");
// //     setCurrentUser(null);
// //   };

// //   // SIGNUP
// //   const signup = (
// //     username,
// //     email,
// //     password,
// //     confirmPassword,
// //     role = "user"
// //   ) => {
// //     if (!username || !email || !password || !confirmPassword)
// //       return { success: false, message: "Please fill all fields." };
// //     if (password !== confirmPassword)
// //       return { success: false, message: "Passwords do not match." };
// //     if (signupDetails.some((u) => u.email === email))
// //       return { success: false, message: "Email already registered." };

// //     return { success: true, message: "Signup handled via AdminContext" };
// //   };

// //   return (
// //     <AuthContext.Provider value={{ currentUser, login, logout, signup }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// import React, { createContext, useContext, useState } from "react";
// import { useAdmin } from "./AdminContext";

// export const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const { signupDetails = [], addUser } = useAdmin();

//   const [currentUser, setCurrentUser] = useState(
//     () => JSON.parse(localStorage.getItem("loggedInUser")) || null
//   );

//   /* ================= LOGIN ================= */
//   const login = (email, password) => {
//     if (!email || !password)
//       return { success: false, message: "Please fill all fields." };

//     const foundUser = signupDetails.find(
//       (u) => u.email === email && u.password === password
//     );

//     if (!foundUser) return { success: false, message: "Invalid credentials." };

//     localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
//     setCurrentUser(foundUser);

//     return { success: true, message: "Login successful!" };
//   };

//   /* ================= SIGNUP ================= */
//   const signup = (
//     username,
//     email,
//     password,
//     confirmPassword,
//     role = "user"
//   ) => {
//     if (!username || !email || !password || !confirmPassword)
//       return { success: false, message: "Please fill all fields." };

//     if (password !== confirmPassword)
//       return { success: false, message: "Passwords do not match." };

//     if (signupDetails.some((u) => u.email === email))
//       return { success: false, message: "Email already registered." };

//     const newUser = {
//       id: Date.now(),
//       username,
//       email,
//       password,
//       role,
//       createdAt: new Date().toISOString(),
//     };

//     addUser(newUser);

//     return { success: true, message: "Signup successful! Please login." };
//   };

//   /* ================= LOGOUT ================= */
//   const logout = () => {
//     localStorage.removeItem("loggedInUser");
//     setCurrentUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState } from "react";
import { useAdmin } from "./AdminContext";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { signupDetails = [], addUser } = useAdmin();
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  const login = (email, password) => {
    if (!email || !password)
      return { success: false, message: "Please fill all fields." };
    const foundUser = signupDetails.find(
      (u) => u.email === email && u.password === password
    );
    if (!foundUser) return { success: false, message: "Invalid credentials." };
    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    setCurrentUser(foundUser);
    return { success: true, message: "Login successful!" };
  };

  const signup = (
    username,
    email,
    password,
    confirmPassword,
    role = "user"
  ) => {
    if (!username || !email || !password || !confirmPassword)
      return { success: false, message: "Please fill all fields." };
    if (password !== confirmPassword)
      return { success: false, message: "Passwords do not match." };
    if (signupDetails.some((u) => u.email === email))
      return { success: false, message: "Email already registered." };

    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    addUser(newUser);
    return { success: true, message: "Signup successful! Please login." };
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
