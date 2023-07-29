import { Note, NoteModel } from "../models/noteModel";

export { NoteServices };

class NoteServices {
  static async handleAddNote(note: Note) {
    const newNote = new NoteModel(note);
    return newNote.save();
  }

  static async handleGetUserNoteDocs(userId: string) {
    return NoteModel.find({ userId });
  }
  static async deleteNote(todoId: string) {
    const note = await NoteModel.findByIdAndDelete(todoId);
    return note;
  }
}
