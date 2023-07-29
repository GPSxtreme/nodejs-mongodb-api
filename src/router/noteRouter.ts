const router = require("express").Router();
import { addNote, getNotes, deleteNote } from "../controller/noteController";
export { router };

router.post("/addNote", addNote);
router.get("/getNotes", getNotes);
router.get("/deleteNote", deleteNote);
