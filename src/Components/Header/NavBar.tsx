import React from "react";
import { Link } from "react-router-dom";
import { Image, Menu } from "semantic-ui-react";
import {
  textAccent,
  glassmorphismBorder,
} from "../../Helpers/Colors/colors";

const NavBar: React.FC = () => {
  return (
    <Menu
      stackable
      className="glass-card navbar"
      style={{
        background: "rgba(15, 15, 35, 0.9)",
        border: glassmorphismBorder,
        margin: 0,
        backdropFilter: "blur(20px)",
        borderRadius: 0,
        position: "sticky" as const,
        top: 0,
        zIndex: 1000,
        boxShadow: "0 8px 32px rgba(0, 210, 255, 0.1)",
      }}
    >
      <Menu.Item as={Link} to="/" style={{ padding: "1rem" }}>
        <Image
          src="/images/icon.png"
          size="mini"
          alt="Portfolio Logo"
          style={{
            filter: "brightness(1.2) saturate(1.5)",
            transition: "all 0.3s ease",
          }}
        />
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/home"
        className="nav-link"
        style={{ color: textAccent, transition: "all 0.3s ease", fontWeight: "500" }}
      >
        Home
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/about"
        className="nav-link"
        style={{ color: textAccent, transition: "all 0.3s ease", fontWeight: "500" }}
      >
        About
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/projects"
        className="nav-link"
        style={{ color: textAccent, transition: "all 0.3s ease", fontWeight: "500" }}
      >
        Projects
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/resume"
        className="nav-link"
        style={{ color: textAccent, transition: "all 0.3s ease", fontWeight: "500" }}
      >
        Resume
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/agile"
        className="nav-link"
        style={{ color: textAccent, transition: "all 0.3s ease", fontWeight: "500" }}
      >
        Agile / PM
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/ai-engineer"
        className="nav-link"
        style={{
          color: "#00D2FF",
          transition: "all 0.3s ease",
          fontWeight: "700",
          letterSpacing: "0.5px",
        }}
      >
        AI Engineer
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/legal-research"
        className="nav-link"
        style={{
          color: textAccent,
          transition: "all 0.3s ease",
          fontWeight: "400",
          fontSize: "0.85em",
          opacity: 0.65,
        }}
      >
        Legal Research
      </Menu.Item>
    </Menu>
  );
};

export default NavBar;
