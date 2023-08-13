import { Note, NoteModel } from "../models/noteModel";

export { NoteServices };

class NoteServices {
  static async handleAddNote(note: Note) {
    const newNote = new NoteModel(note);
    await newNote.save();
    return newNote.id!;
  }

  static async handleGetUserNoteDocs(userId: string) {
    return NoteModel.find({ userId });
  }
  static async handleDeleteNote(todoId: string) {
    const note = await NoteModel.findByIdAndDelete(todoId);
    return note;
  }
  static async handleUpdateNote(note: Note, noteId: string) {
    return await NoteModel.findByIdAndUpdate(
      { _id: noteId },
      { $set: note },
      { new: true }
    );
  }
}
