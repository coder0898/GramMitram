import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const API_BASE = import.meta.env.VITE_PUBLIC_API;

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Async logging (non-blocking) ----
  const logAction = useCallback(
    async (action, details = {}) => {
      try {
        fetch(`${API_BASE}/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser?.uid || "unknown",
            role: currentUser?.role || "unknown",
            action,
            details,
          }),
        });
      } catch (err) {
        console.error("Failed to log action:", err);
      }
    },
    [currentUser]
  );

  // ---- Firebase Auth state listener ----
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        localStorage.removeItem("loggedInUser");
        setLoading(false);
        return;
      }

      // Optimistically set minimal currentUser
      const minimalUser = {
        firebaseUser: user,
        uid: user.uid,
        email: user.email,
        role: "user",
      };
      setCurrentUser(minimalUser);
      localStorage.setItem("loggedInUser", JSON.stringify(minimalUser));
      setLoading(false);

      // Fetch Firestore role in background
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role || "user";
          setCurrentUser((prev) => ({ ...prev, role }));
          localStorage.setItem(
            "loggedInUser",
            JSON.stringify({ ...minimalUser, role })
          );
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  // ---- Login ----
  const login = useCallback(async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Optimistic minimal set
      const minimalUser = {
        firebaseUser: user,
        uid: user.uid,
        email: user.email,
        role: "user",
      };
      setCurrentUser(minimalUser);
      localStorage.setItem("loggedInUser", JSON.stringify(minimalUser));

      // Fetch Firestore role in background
      getDoc(doc(db, "users", user.uid))
        .then((docSnap) => {
          if (docSnap.exists()) {
            const role = docSnap.data().role || "user";
            setCurrentUser((prev) => ({ ...prev, role }));
            localStorage.setItem(
              "loggedInUser",
              JSON.stringify({ ...minimalUser, role })
            );
          }
        })
        .catch((err) => console.error("Firestore role fetch failed:", err));

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  // ---- Signup ----
  const signup = useCallback(
    async (username, email, password, role = "user") => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Save role to Firestore (async)
        setDoc(doc(db, "users", user.uid), { username, email, role }).catch(
          (err) => console.error("Firestore write failed:", err)
        );

        const userData = { firebaseUser: user, uid: user.uid, email, role };
        setCurrentUser(userData);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ uid: user.uid, email, role })
        );

        return { success: true, message: "Signup successful" };
      } catch (error) {
        return { success: false, message: error.message };
      }
    },
    []
  );

  // ---- Logout ----
  const logout = useCallback(async () => {
    await signOut(auth);
    logAction("logout", { info: "logout from system" });
    setCurrentUser(null);
    localStorage.removeItem("loggedInUser");
  }, [logAction]);

  // ---- Get ID token ----
  const getToken = useCallback(async () => {
    if (!currentUser?.firebaseUser) {
      console.error("No firebaseUser available for token");
      return null;
    }
    try {
      return await currentUser.firebaseUser.getIdToken();
    } catch (err) {
      console.error("Failed to get ID token:", err);
      return null;
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, login, signup, logout, loading, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
