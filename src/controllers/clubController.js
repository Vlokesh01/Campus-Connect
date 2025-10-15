import Club from "../models/clubModel.js";
import User from "../models/userModel.js";


// Student registered club List
export const myClubList = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });
    const clubs = await Club.find({ members: user._id });
    res.status(200).json({ clubs });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Student joins a club
export const joinClub = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ take from token (auth middleware)
    const { clubId } = req.params; // ✅ from URL

    const user = await User.findById(userId);
    if (!user || user.role !== "student")
      return res.status(403).json({ message: "Only students can join clubs" });

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    if (club.members.includes(userId))
      return res.status(400).json({ message: "Already a member of this club" });

    club.members.push(userId);
    await club.save();

    user.joinedClubs.push(clubId);
    await user.save();

    res.status(200).json({ 
      message: "Joined club successfully", 
      joinedClubs: user.joinedClubs 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student leaves a club
export const leaveClub = async (req, res) => {
  try {
    const userId = req.user._id; // from token
    const { clubId } = req.params; // from URL

    const user = await User.findById(userId);
    if (!user || user.role !== "student")
      return res.status(403).json({ message: "Only students can leave clubs" });

    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    if (!club.members.includes(userId))
      return res.status(400).json({ message: "You are not a member of this club" });

    // Remove user from club members
    club.members = club.members.filter(
      (memberId) => memberId.toString() !== userId.toString()
    );
    await club.save();

    // Remove club from user joinedClubs
    user.joinedClubs = user.joinedClubs.filter(
      (id) => id.toString() !== clubId.toString()
    );
    await user.save();

    res.status(200).json({
      message: "Left club successfully",
      joinedClubs: user.joinedClubs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Member List Clubs
export const memberListClubs = async (req, res) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findById(clubId).populate("members", "name email");
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.status(200).json({ members: club.members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Admin List Clubs
export const listClubs = async (req, res) => {
  try {
    const clubs = await Club.find(); // fetch all clubs
    res.status(200).json({ clubs });
  } catch (error) {
    res.status(500).json({ message: "No clubs found", error: error.message });
  }
};
// ClubAdmin creates a club
export const createClub = async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    const user = req.user;

    if (!user || user.role !== "clubadmin")
      return res.status(403).json({ message: "Only ClubAdmin can create clubs" });

    const club = await Club.create({ name, description, createdBy : user._id });
    res.status(201).json({ message: "Club created successfully", club });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin edit Club
export const editClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { name, description } = req.body;
    const user = req.user;
    if (!user || user.role !== "clubadmin")
      return res.status(403).json({ message: "Only ClubAdmin can edit clubs" });
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });
    club.name = name || club.name;
    club.description = description || club.description;
    await club.save();
    res.status(200).json({ message: "Club updated successfully", club });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};
// Admin Delete Club
export const deleteClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const user = req.user;

    if (!user || user.role !== "clubadmin") {
      return res.status(403).json({ message: "Only ClubAdmin can delete clubs" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // ✅ Delete the club
    await Club.findByIdAndDelete(clubId);

    res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("Delete club error:", error);
    res.status(500).json({ message: error.message });
  }
};

