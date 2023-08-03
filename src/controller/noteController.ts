import { Request, Response } from "express";
import { NoteServices } from "../services/noteServices";
import { Note } from "../models/noteModel";
export { addNote, getNotes, deleteNote, updateNote };

const addNote = async (req: Request, res: Response) => {
  try {
    const note: Note = req.body;
    note.userId = req.userId;
    await NoteServices.handleAddNote(note).then((_) => {
      return res
        .status(200)
        .json({ success: true, message: "Successfully added note" });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: `failed adding the notes , ${error}` });
  }
};

const getNotes = async (req: Request, res: Response) => {
  try {
    await NoteServices.handleGetUserNoteDocs(req.userId!).then((docs) => {
      return res.status(200).json({
        success: true,
        message: "Successfully fetched notes",
        notes: docs,
      });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: `failed fetching notes, ${error}` });
  }
};

const deleteNote = async (req: Request, res: Response) => {
  try {
    const noteId = req.query.noteId as string;
    await NoteServices.handleDeleteNote(noteId).then((doc) => {
      return res.status(200).json({
        success: true,
        message: "Successfully deleted note",
        note: doc,
      });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: `failed deleting note, ${error}` });
  }
};
const updateNote = async (req: Request, res: Response) => {
  try {
    const updatedNote: Note = req.body;
    await NoteServices.handleUpdateNote(updatedNote, req.body._id).then(
      (note) => {
        return res.status(200).json({
          success: true,
          message: "Successfully updated the note",
          updatedNote: note,
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: `failed updating note, ${error}` });
  }
};
