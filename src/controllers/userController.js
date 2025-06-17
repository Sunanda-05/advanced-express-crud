import { getUserByEmail, getUserById } from "../services/authService.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUserIdByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    console.error("Error retrieving user ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default getUserProfile;
