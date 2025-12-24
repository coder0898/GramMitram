// import React, { createContext, useContext, useEffect, useState } from "react";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// import { auth, db } from "../firebase/firebase";

// /* ================= CONTEXT SETUP ================= */
// export const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// /* ================= PROVIDER ================= */
// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= AUTO LOGIN / PERSISTENCE ================= */
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const userRef = doc(db, "users", user.uid);
//           const userSnap = await getDoc(userRef);

//           const role = userSnap.exists() ? userSnap.data().role : "user";

//           const userData = {
//             uid: user.uid,
//             email: user.email,
//             role,
//           };

//           setCurrentUser(userData);
//           localStorage.setItem("loggedInUser", JSON.stringify(userData));
//         } catch (error) {
//           console.error("Error fetching user role:", error);
//           setCurrentUser(null);
//           localStorage.removeItem("loggedInUser");
//         }
//       } else {
//         setCurrentUser(null);
//         localStorage.removeItem("loggedInUser");
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   /* ================= LOGIN ================= */
//   const login = async (email, password) => {
//     if (!email || !password) {
//       return { success: false, message: "Please fill all fields." };
//     }

//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       const user = userCredential.user;

//       // 🔥 Fetch role from Firestore
//       const userSnap = await getDoc(doc(db, "users", user.uid));

//       const role = userSnap.exists() ? userSnap.data().role : "user";

//       const userData = {
//         uid: user.uid,
//         email: user.email,
//         role,
//       };

//       setCurrentUser(userData);
//       localStorage.setItem("loggedInUser", JSON.stringify(userData));

//       return { success: true, message: "Login successful!" };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   };

//   /* ================= SIGNUP ================= */
//   const signup = async (username, email, password, confirmPassword) => {
//     if (!username || !email || !password || !confirmPassword) {
//       return { success: false, message: "Please fill all fields." };
//     }

//     if (password !== confirmPassword) {
//       return { success: false, message: "Passwords do not match." };
//     }

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       const user = userCredential.user;

//       // 🔥 Create user document in Firestore
//       await setDoc(doc(db, "users", user.uid), {
//         uid: user.uid,
//         username,
//         email,
//         role: "user", // default role
//         createdAt: new Date(),
//       });

//       return {
//         success: true,
//         message: "Signup successful! Please login.",
//       };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   };

//   /* ================= LOGOUT ================= */
//   const logout = async () => {
//     await signOut(auth);
//     setCurrentUser(null);
//     localStorage.removeItem("loggedInUser");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser,
//         login,
//         signup,
//         logout,
//       }}
//     >
//       {/* {loading ? <div>Loading...</div> : children} */}
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

        const userData = { uid: user.uid, email: user.email, role };
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
        password
      );
      const user = userCredential.user;

      // Save user role to Firestore
      await setDoc(doc(db, "users", user.uid), { username, email, role });

      return { success: true };
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
