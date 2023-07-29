import { Document, Schema, Model, model, Types } from "mongoose";
export { NoteModel, Note };

interface Note {
  userId: unknown;
  title: string;
  body: string;
  createdTime?: Date;
  editedTime?: Date;
}
interface NoteDocument extends Document, Note {}

const noteSchema: Schema<NoteDocument> = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "user", // Reference the User collection
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  editedTime: {
    type: Date,
    default: Date.now,
  },
});

const NoteModel: Model<NoteDocument> = model<NoteDocument>("Note", noteSchema);
