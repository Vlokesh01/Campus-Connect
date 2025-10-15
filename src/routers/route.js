import express from "express";
import { registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";
import { myEvents , joinEvent, leaveEvent } from "../controllers/eventController.js";
import { myClubList, joinClub,leaveClub, memberListClubs } from "../controllers/clubController.js";
import { listEvents , createEvent, editEvent , deleteEvent } from "../controllers/eventController.js";
import {  listClubs ,createClub, editClub,deleteClub , } from "../controllers/clubController.js";
import { protect , authorizeRoles } from "../middlewares/authMiddleware.js";
import { listAnnouncements , createAnnouncement , editAnnouncement, deleteAnnouncement } from "../controllers/announcementController.js"; 

const router = express.Router();


// Users
router.post("/register", registerUser);
router.post("/login", loginUser);

// User roles urls
// Events routes
router.get("/events", listEvents);
router.get("/events/myevents", protect, myEvents);
router.post("/events/join/:eventId", protect, authorizeRoles("student"), joinEvent);
router.post("/events/leave/:eventId", protect, authorizeRoles("student"), leaveEvent);
// Club routes
router.get("/clubs", listClubs);
router.get("/clubs/myclubs", protect, myClubList);
router.get("/clubs/members/:clubId", memberListClubs);
router.post("/clubs/join/:clubId",protect, authorizeRoles("student"), joinClub);
router.post("/clubs/leave/:clubId", protect, authorizeRoles("student"), leaveClub);

// Admin Events routers
router.get("/events", listEvents);
router.post("/events/create",protect , authorizeRoles("clubadmin"), createEvent);
router.put("/events/edit/:eventId", protect, authorizeRoles("clubadmin"), editEvent);
router.delete("/events/delete/:eventId", protect, authorizeRoles("clubadmin"), deleteEvent);

//Admin Clubs routes
router.get("/clubs", listClubs);
router.get("/clubs/members/:clubId", protect, authorizeRoles("clubadmin"), memberListClubs);
router.post("/clubs/create",  protect, authorizeRoles("clubadmin"), createClub);
router.put("/clubs/edit/:clubId", protect, authorizeRoles("clubadmin"), editClub);
router.delete("/clubs/delete/:clubId", protect, authorizeRoles("clubadmin"), deleteClub);


// Announcements routes can be added similarly
router.get("/announcements", listAnnouncements);
router.post("/announcements/create", protect, authorizeRoles("clubadmin"), createAnnouncement);
router.put("/announcements/edit/:id", protect, authorizeRoles("clubadmin"), editAnnouncement);
router.delete("/announcements/delete/:id", protect, authorizeRoles("clubadmin"), deleteAnnouncement);

export default router;
