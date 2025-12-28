// import React, { createContext, useContext, useEffect, useState } from "react";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { auth, db } from "../firebase/firebase"; // db if you want Firestore integration
// import { doc, getDoc, setDoc } from "firebase/firestore";

// export const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const logAction = async (action, details = {}) => {
//     try {
//       await fetch("http://localhost:5000/api/log", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: currentUser?.uid || "unknown",
//           role: currentUser?.role || "unknown",
//           action,
//           details,
//         }),
//       });
//     } catch (err) {
//       console.error("Failed to log action:", err);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         // Fetch role from Firestore if exists, else default to 'user'
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         const role = userDoc.exists() ? userDoc.data().role : "user";

//         const userData = {
//           uid: user.uid,
//           username: user.username,
//           email: user.email,
//           role,
//         };
//         localStorage.setItem("loggedInUser", JSON.stringify(userData));
//         setCurrentUser(userData);
//       } else {
//         localStorage.removeItem("loggedInUser");
//         setCurrentUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;

//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       const role = userDoc.exists() ? userDoc.data().role : "user";

//       const userData = { uid: user.uid, email: user.email, role };
//       localStorage.setItem("loggedInUser", JSON.stringify(userData));
//       setCurrentUser(userData);
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   };

//   const signup = async (username, email, password, role = "user") => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         role
//       );
//       const user = userCredential.user;

//       // Save user role to Firestore
//       await setDoc(doc(db, "users", user.uid), { username, email, role });

//       return { success: true, message: "singup successfully" };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   };

//   const logout = async () => {
//     await signOut(auth);
//     await logAction("logout", "logout form system");
//     localStorage.removeItem("loggedInUser");
//     setCurrentUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ currentUser, login, signup, logout, loading }}
//     >
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
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // includes firebaseUser
  const [loading, setLoading] = useState(true);

  // Log actions to backend
  const logAction = async (action, details = {}) => {
    try {
      await fetch("http://localhost:5000/api/log", {
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
  };

  // Firebase Auth state listener
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       // Fetch user role from Firestore
  //       const userDoc = await getDoc(doc(db, "users", user.uid));
  //       const role = userDoc.exists() ? userDoc.data().role : "user";

  //       const userData = {
  //         firebaseUser: user, // 🔑 store Firebase user for token
  //         uid: user.uid,
  //         email: user.email,
  //         role,
  //       };

  //       setCurrentUser(userData);
  //       localStorage.setItem(
  //         "loggedInUser",
  //         JSON.stringify({
  //           uid: user.uid,
  //           email: user.email,
  //           role,
  //         })
  //       );
  //     } else {
  //       setCurrentUser(null);
  //       localStorage.removeItem("loggedInUser");
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const role = userDoc.exists() ? userDoc.data().role : "user";

          // Store full Firebase user object for token usage
          const userData = {
            firebaseUser: user, // ✅ Firebase user for getIdToken
            uid: user.uid,
            email: user.email,
            role,
          };

          setCurrentUser(userData);

          // Optional: store non-sensitive info in localStorage
          localStorage.setItem(
            "loggedInUser",
            JSON.stringify({
              uid: user.uid,
              email: user.email,
              role,
            })
          );
        } else {
          // User logged out
          setCurrentUser(null);
          localStorage.removeItem("loggedInUser");
        }
      } catch (err) {
        console.error("Error in auth state change:", err);
        setCurrentUser(null);
        localStorage.removeItem("loggedInUser");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login
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

      const userData = {
        firebaseUser: user,
        uid: user.uid,
        email: user.email,
        role,
      };
      setCurrentUser(userData);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ uid: user.uid, email: user.email, role })
      );

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Signup
  const signup = async (username, email, password, role = "user") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save role to Firestore
      await setDoc(doc(db, "users", user.uid), { username, email, role });

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
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    await logAction("logout", { info: "logout from system" });
    setCurrentUser(null);
    localStorage.removeItem("loggedInUser");
  };

  // 🔑 Get Firebase token for API requests
  // const getToken = async () => {
  //   if (!currentUser?.firebaseUser) {
  //     console.warn("No Firebase user available to generate token");
  //     return null;
  //   }
  //   return await currentUser.firebaseUser.getIdToken();
  // };

  const getToken = async () => {
    if (!currentUser?.firebaseUser) {
      console.error("No firebaseUser available for token");
      return null;
    }
    try {
      return await currentUser.firebaseUser.getIdToken(); // force refresh token
    } catch (err) {
      console.error("Failed to get ID token:", err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        loading,
        getToken, // provide getToken for AppContext to use
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
