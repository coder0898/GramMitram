// import React, { createContext, useContext, useState } from "react";
// import { useAdmin } from "./AdminContext";

// export const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const { signupDetails = [], addUser } = useAdmin();
//   const [currentUser, setCurrentUser] = useState(
//     () => JSON.parse(localStorage.getItem("loggedInUser")) || null
//   );

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

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/firebase";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= AUTO LOGIN (PERSISTENCE) ================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          role: "user", // default role (can change later)
        };

        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        setCurrentUser(userData);
      } else {
        localStorage.removeItem("loggedInUser");
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    if (!email || !password)
      return { success: false, message: "Please fill all fields." };

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        role: "user",
      };

      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      setCurrentUser(userData);

      return { success: true, message: "Login successful!" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  /* ================= SIGNUP ================= */
  const signup = async (username, email, password, confirmPassword) => {
    if (!username || !email || !password || !confirmPassword)
      return { success: false, message: "Please fill all fields." };

    if (password !== confirmPassword)
      return { success: false, message: "Passwords do not match." };

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      // Username can be stored in Firestore later
      return {
        success: true,
        message: "Signup successful! Please login.",
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("loggedInUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
