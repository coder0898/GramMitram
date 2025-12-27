import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import CommonProfile from "../components/profile/CommonProfile";

const Profile = () => {
  const { currentUser, loading } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUser = async () => {
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData(snap.data());
      }
    };

    fetchUser();
  }, [currentUser]);

  if (loading || !currentUser || !userData) return null;

  return <CommonProfile user={userData} authUser={currentUser} />;
};

export default Profile;
