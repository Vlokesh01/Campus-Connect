import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ClubAdmin
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // students
    },
  ],
}, { timestamps: true });

const Club = mongoose.model("Club", clubSchema);

export default Club;

