import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectDocument extends Document {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], required: true },
    githubUrl: { type: String, required: false },
    liveUrl: { type: String, required: false },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema);
