import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./App.css";
import LandingPage from "./Components/LandingPage";
import HomePage from "./Components/HomePage";
import NavBar from "./Components/Header/NavBar";
import Lectures from "./Components/Skills/Lectures";
import ResumePage from "./Components/ResumePage/ResumePage";
import Projects from "./Components/Projects/Projects";
import ProjectDetails from "./Components/Projects/ProjectDetails";
import {
  darkBlack,
  lightBlack,
  grey,
  lighterBlue,
  anotherBlue,
} from "./Helpers/Colors/colors";
import Footer from "./Components/Footer/Footer";
import Contact from "./Components/Contact";
import SignIn from "./Components/Admin/SignIn";
import DisplayBlogs from "./Components/Admin/DisplayBlogs";
import BlogPage from "./Components/Admin/BlogPage";
import Blog from "./Components/Blog";

// TypeScript interfaces
interface AppState {
  modalOpen: boolean;
  currentModal: string | null;
  columnCount: number;
  activeItem: string;
  projectsDisplay: any[];
}

const App: React.FC = () => {
  const navigate = useNavigate();

  // State using hooks
  const [state, setState] = useState<AppState>({
    modalOpen: false,
    currentModal: null,
    columnCount: 5,
    activeItem: "ALL",
    projectsDisplay: [],
  });

  // Event handlers
  const handleOpen = (currentModal: string) => {
    setState((prev) => ({ ...prev, modalOpen: true, currentModal }));
  };

  const handleClose = () => {
    setState((prev) => ({ ...prev, modalOpen: false, currentModal: null }));
  };

  const goToProjectPage = (id: number) => {
    navigate(`/project/${id}`);
  };

  const { modalOpen, currentModal, columnCount } = state;

  return (
    <div className="main">
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<SignIn />} />
        <Route path="/admin/blogs" element={<DisplayBlogs />} />
        <Route path="/admin/blog/:id" element={<BlogPage />} />
        <Route path="/create" element={<BlogPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/lectures" element={<Lectures />} />
        <Route path="/blog" element={<Blog />} />
        <Route
          path="/contact"
          element={
            <Contact
              modalOpen={modalOpen}
              handleClose={handleClose}
              handleOpen={handleOpen}
              currentModal={currentModal}
              darkBlack={darkBlack}
              lightBlack={lightBlack}
              grey={grey}
              lighterBlue={lighterBlue}
              anotherBlue={anotherBlue}
            />
          }
        />
        <Route
          path="/projects"
          element={
            <Projects
              columnCount={columnCount}
              goToProjectPage={goToProjectPage}
              darkBlack={darkBlack}
              lightBlack={lightBlack}
              grey={grey}
              lighterBlue={lighterBlue}
              anotherBlue={anotherBlue}
            />
          }
        />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
