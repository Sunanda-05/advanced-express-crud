import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshTokenModel.js";

const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;
const generateRefreshToken = async (userId) => {
  const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  await RefreshToken.create({
    token: refreshToken,
    userId,
    expirationDate,
  });

  return refreshToken;
};

const getRefreshToken = async (token) => {
  return await RefreshToken.findOne({ token });
};

const deleteRefreshToken = async (token) => {
  return await RefreshToken.deleteOne({ token });
};


export { generateRefreshToken, getRefreshToken, deleteRefreshToken };
