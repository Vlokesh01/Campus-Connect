import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    srn: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["student", "clubadmin", "superadmin"],
      default: "student",
    },
    registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare passwords for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
