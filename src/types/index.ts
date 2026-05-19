export interface IProject {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface IExperience {
  _id: string;
  role: string;
  company: string;
  duration: string;
  description: string[];
  skills: string[];
}
