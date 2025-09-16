import mongoose, { Schema, Document } from "mongoose";

export interface IFormSubmissionEmployee extends Document {
  data: Record<string, any>; // Merged form data
  publicId: string;          // Public view token
  createdAt: Date;
}

const FormSubmissionSchema = new Schema<IFormSubmissionEmployee>(
  {
    data: { type: Schema.Types.Mixed, required: true },
    publicId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.FormSubmissionEmployee ||
  mongoose.model<IFormSubmissionEmployee>("FormSubmissionEmployee", FormSubmissionSchema);

