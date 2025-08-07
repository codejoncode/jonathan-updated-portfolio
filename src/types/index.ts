// TypeScript interfaces for the application

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  deploymentUrl?: string; // Keep optional since not all projects have live demos
  status?:
    | "Live & Active"
    | "Code Showcase"
    | "Backend Focus"
    | "Full-Stack Demo"
    | "Advanced Features";
  technicalFocus?: string[];
  codeHighlights?: string[];
  learningOutcomes?: string;
  features: string;
  technologies: string[];
  category: "REACT" | "FULLSTACK" | "BACKEND";
  gifPlay?: string;
  planUrl?: string;
}

export interface Blog {
  id: number;
  title: string;
  message: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  id: number;
  title: string;
  url: string;
  description?: string;
}

export interface User {
  id?: number;
  username: string;
  email?: string;
  token?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Redux State Interfaces
export interface ProjectState {
  projects: Project[];
  soloProject: Project | null;
  loading: boolean;
  error: string | null;
}

export interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;
}

export interface LectureState {
  lectures: Lecture[];
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  projectReducer: ProjectState;
  blogReducer: BlogState;
  lecturesReducer: LectureState;
  authReducer: AuthState;
}

// Component Props Interfaces
export interface ThemeProps {
  darkBlack: string;
  lightBlack: string;
  grey: string;
  lighterBlue: string;
  anotherBlue: string;
}

export interface ModalProps {
  modalOpen: boolean;
  currentModal: string | null;
  handleOpen: (modal: string) => void;
  handleClose: () => void;
}
