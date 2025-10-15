import Event from "../models/eventModel.js";
import Participant from "../models/partcipantModel.js";
import User from "../models/userModel.js";


// Studnt's events
export const myEvents = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    if (!user) return res.status(404).json({ message: "User not found" });

    const participations = await Participant.find({ user: user._id }).populate("event");
    const events = participations.map(p => p.event);

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// all events
export const listEvents = async (req, res) => {
  try {
    const events = await Event.find(); // fetch all events
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: "No events found", error: error.message });
  }
};
// Student joins an event
export const joinEvent = async (req, res) => {
  try {
    const userId = req.user.id; // from protect middleware
    const eventId = req.params.eventId; // from URL

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "student")
      return res.status(403).json({ message: "Only students can join events" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const exists = await Participant.findOne({ user: userId, event: eventId });
    if (exists) return res.status(400).json({ message: "Already joined this event" });

    const participant = await Participant.create({ user: userId, event: eventId });

    res.status(200).json({ message: "Event joined successfully", participant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student leaves an event
export const leaveEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.eventId;

    // Check if participant record exists
    const participation = await Participant.findOne({ user: userId, event: eventId });
    if (!participation) return res.status(400).json({ message: "Not registered for this event" });

    // Remove participant
    await participation.deleteOne();

    res.status(200).json({ message: "Event left successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ClubAdmin creates an event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    // User info now comes from JWT
    const user = req.user;

    if (!user || user.role !== "clubadmin") {
      return res.status(403).json({ message: "Only ClubAdmin can create events" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      createdBy: user._id, // link to the ClubAdmin
    });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ClubAdmin edits an event
export const editEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, date } = req.body;
    const user = req.user;

    if (!user || user.role !== "clubadmin") {
      return res.status(403).json({ message: "Only ClubAdmin can edit events" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own events" });
    }

    // Update fields if provided
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Edit event error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ClubAdmin deletes an event
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const user = req.user;

    if (!user || user.role !== "clubadmin") {
      return res.status(403).json({ message: "Only ClubAdmin can delete events" });
    }

    const event = await Event.findById(eventId); // ✅ fixed broken line
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own events" });
    }
     
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: error.message });
  }
};


