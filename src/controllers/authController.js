import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserByEmail, createUser } from "../services/authService.js";
import {
  deleteRefreshToken,
  generateRefreshToken,
  getRefreshToken,
} from "../services/tokenService.js";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

export const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return response.status(404).json({ error: "Email is not registered." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({ error: "Wrong password." });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = await generateRefreshToken(user._id);

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents XSS (JavaScript cannot access it)
      secure: false, // Only send over HTTPS     //make to true when https
      sameSite: "Lax", // Prevents most CSRF attacks
      path: "/auth/refresh-token", // Restrict usage to refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return response.status(200).json({
      message: "Login successful!",
      email,
      accessToken,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
};

export const refreshTokens = async (request, response) => {
  try {
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken)
      return response.status(401).json({ error: "No refresh token provided." });

    const dbToken = getRefreshToken(refreshToken);
    if (!dbToken) {
      return response.status(401).json({ error: "Invalid refresh token" });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err)
        return response
          .status(403)
          .json({ error: "Expired or invalid refresh token" });

      const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      return response.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error in Refresh Token:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
};

export const logoutUser = async (request, response) => {
  try {
    const refreshToken = request.cookies.refreshToken;
    await deleteRefreshToken(refreshToken);

    response.clearCookie("refreshToken");
    return response.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in Refresh Token:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
};

export const registerUser = async (request, response) => {
  try {
    const { email, password, name } = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email & Password are required." });
    }

    const userExists = await getUserByEmail(email);
    if (userExists) {
      return response
        .status(400)
        .json({ error: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { email, password: hashedPassword, name };
    const user = await createUser(userData);

    response.status(201).json(user);
  } catch (error) {
    console.error("Error in Register User:", error);
    response.status(500).json({ error: "Internal server error." });
  }
};
