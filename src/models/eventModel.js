import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ClubAdmin or SuperAdmin
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;