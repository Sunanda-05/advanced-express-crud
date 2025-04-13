import { getUserById } from "../services/authService.js";

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

export default getUserProfile;
