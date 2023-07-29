import { Request, Response } from "express";
import { NoteServices } from "../services/noteServices";
import { Note } from "../models/noteModel";
import { AuthUtils, check_is_auth_return } from "../utils/authUtils";
export { addNote, getNotes, deleteNote };

const addNote = async (req: Request, res: Response) => {
  try {
    const note: Note = req.body;
    const userAuthCheck: check_is_auth_return =
      AuthUtils.checkIfAuthenticated(req);
    if (userAuthCheck[0]) {
      note.userId = userAuthCheck[1];
      await NoteServices.handleAddNote(note).then((_) => {
        return res
          .status(200)
          .json({ status: true, message: "Successfully added note" });
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "User not authenticated" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: `failed adding the notes , ${error}` });
  }
};

const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const isAuthenticated: check_is_auth_return =
      AuthUtils.checkIfAuthenticated(req);
    if (isAuthenticated[0]) {
      await NoteServices.handleGetUserNoteDocs(userId).then((docs) => {
        return res.status(200).json({
          status: true,
          message: "Successfully fetched notes",
          todos: docs,
        });
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "User not authenticated" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: `failed fetching notes, ${error}` });
  }
};

const deleteNote = async (req: Request, res: Response) => {
  try {
    const noteId = req.query.noteId as string;
    const isAuthenticated: check_is_auth_return =
      AuthUtils.checkIfAuthenticated(req);
    if (isAuthenticated[0]) {
      await NoteServices.deleteNote(noteId).then((doc) => {
        return res.status(200).json({
          status: true,
          message: "Successfully deleted note",
          note: doc,
        });
      });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "User not authenticated" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: `failed deleting note, ${error}` });
  }
};
