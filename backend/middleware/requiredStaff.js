const requireStaff = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res.status(403).json({ error: "Staff access only" });
  }
  next();
};

export default requireStaff;
