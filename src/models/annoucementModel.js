import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
  },
  { timestamps: true }
);

// Auto filter out expired announcements when fetching
announcementSchema.statics.getActiveAnnouncements = function () {
  return this.find({ expiryDate: { $gte: new Date() } }).populate("createdBy", "name role");
};

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
