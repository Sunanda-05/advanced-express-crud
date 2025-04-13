import User from "../models/userModel.js";

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }).select("+password");
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching user by email");
  }
};

const createUser = async (userData) => {
  try {
    const user = await User.create(userData);
    const { password, ...safeUser } = user.toObject(); // or .lean()
    return safeUser;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating user");
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching user by id");
  }
};

export { getUserByEmail, createUser, getUserById };
