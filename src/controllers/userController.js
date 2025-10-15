import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Register a new user
export  const registerUser = async (req, res) => {
  try {
    const { name, email, password, srn, role } = req.body;

    // Check if email or SRN already exists
    const existingUser = await User.findOne({ $or: [{ email }, { srn }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      srn,
      role: role || "student",
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

