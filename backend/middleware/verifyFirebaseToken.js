// // middleware/verifyFirebaseToken.mjs
// import admin from "firebase-admin";
// import "dotenv/config"; // loads .env automatically

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.PROJECT_ID,
//     clientEmail: process.env.CLIENT_EMAIL,
//     privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
//   }),
// });

// async function verifyFirebaseToken(req, res, next) {
//   const token = req.headers.authorization?.split("Bearer ")[1];
//   if (!token) return res.status(401).json({ error: "No token provided" });

//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     req.user = { uid: decoded.uid };
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// }

// export default verifyFirebaseToken;

// middleware/verifyFirebaseToken.mjs
import admin from "firebase-admin";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      // Replace literal \n with actual newlines
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

async function verifyFirebaseToken(req, res, next) {
  // Expecting header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid }; // attach UID to request
    next();
  } catch (err) {
    console.error("Firebase token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default verifyFirebaseToken;
