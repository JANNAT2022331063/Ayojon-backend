import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, isVerified }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

export const organizerOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "organizer") return res.status(403).json({ message: "Organizers only" });
  if (!req.user.isVerified) return res.status(403).json({ message: "Organizer not verified" });
  next();
};
