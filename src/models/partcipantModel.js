import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    joinedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["joined", "cancelled"], default: "joined" }
  },
  { timestamps: true }
);

// A user should not join the same event twice
participantSchema.index({ user: 1, event: 1 }, { unique: true });

const Participant = mongoose.model("Participant", participantSchema);
export default Participant;
