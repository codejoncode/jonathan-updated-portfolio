import React, { useState } from "react";
import { Container, Form, Button, Header, Message } from "semantic-ui-react";
import {
  lighterBlue,
  darkBlack,
  anotherBlue,
} from "../../Helpers/Colors/colors";

const SignIn: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Mock authentication
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (credentials.username === "admin" && credentials.password === "admin") {
      localStorage.setItem("holloway-portfolio-token", "mock-token");
      window.location.href = "/admin/blogs";
    } else {
      setError("Invalid credentials");
    }

    setIsLoading(false);
  };

  return (
    <Container style={{ padding: "50px", maxWidth: "400px" }}>
      <Header
        as="h1"
        textAlign="center"
        style={{ color: lighterBlue, marginBottom: "30px" }}
      >
        Admin Login
      </Header>

      {error && (
        <Message
          error
          style={{
            backgroundColor: darkBlack,
            color: "#ff6b6b",
            border: "1px solid #ff6b6b",
          }}
        >
          {error}
        </Message>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label style={{ color: lighterBlue }}>Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            style={{
              backgroundColor: darkBlack,
              color: lighterBlue,
              border: `1px solid ${anotherBlue}`,
            }}
          />
        </Form.Field>

        <Form.Field>
          <label style={{ color: lighterBlue }}>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            style={{
              backgroundColor: darkBlack,
              color: lighterBlue,
              border: `1px solid ${anotherBlue}`,
            }}
          />
        </Form.Field>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            style={{
              backgroundColor: anotherBlue,
              color: darkBlack,
            }}
          >
            Sign In
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default SignIn;
