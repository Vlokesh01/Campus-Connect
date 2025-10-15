import Announcement from "../models/annoucementModel.js";



// ClubAdmin creates announcement
export const createAnnouncement = async (req, res) => {
  try {
    const user = req.user;
    const { title, content, expiryDate, clubId } = req.body;

    if (!req.user || req.user.role !== "clubadmin") {
      return res.status(403).json({ message: "Only ClubAdmin can post announcements" });
    }

    const announcement = await Announcement.create({
      title,
      content,
      expiryDate,
      createdBy: req.user._id,
      club: clubId || null,
    });

    res.status(201).json({ message: "Announcement created successfully", announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    if (announcement.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to edit this announcement" });

    const updated = await Announcement.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Announcement updated", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Edit announcement
export const editAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, expiryDate } = req.body;
    const user = req.user; // from auth middleware

    // Find announcement
    const announcement = await Announcement.findById(id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });

    // Only creator can edit
    if (announcement.createdBy.toString() !== user._id.toString())
      return res.status(403).json({ message: "Not authorized to edit this announcement" });

    // Update fields if provided
    announcement.title = title || announcement.title;
    announcement.content = content || announcement.content;
    announcement.expiryDate = expiryDate || announcement.expiryDate;

    await announcement.save();

    res.status(200).json({ message: "Announcement updated successfully", announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);

    if (!announcement) return res.status(404).json({ message: "Announcement not found" });
    if (announcement.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to delete this announcement" });

    await announcement.deleteOne();
    res.status(200).json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Students can view announcements (only active ones)
export const listAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.getActiveAnnouncements();
    res.status(200).json({ announcements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
