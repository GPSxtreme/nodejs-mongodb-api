const router = require("express").Router();
import { addNote, getNotes, deleteNote } from "../controller/noteController";
import { AuthUtils } from "../utils/authUtils";
export { router };

router.post("/addNote", AuthUtils.preAuthChecker, addNote);
router.get("/getNotes", AuthUtils.preAuthChecker, getNotes);
router.get("/deleteNote", AuthUtils.preAuthChecker, deleteNote);
