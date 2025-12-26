import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase"; // db if you want Firestore integration
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch role from Firestore if exists, else default to 'user'
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : "user";

        const userData = {
          uid: user.uid,
          username: user.username,
          email: user.email,
          role,
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

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "user";

      const userData = { uid: user.uid, email: user.email, role };
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      setCurrentUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (username, email, password, role = "user") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        role
      );
      const user = userCredential.user;

      // Save user role to Firestore
      await setDoc(doc(db, "users", user.uid), { username, email, role });

      return { success: true, message: "singup successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("loggedInUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
