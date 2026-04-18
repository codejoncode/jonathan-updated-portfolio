import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Header,
  Message,
  Grid,
} from "semantic-ui-react";
import {
  textPrimary,
  textAccent,
  glassmorphismBorder,
} from "../Helpers/Colors/colors";
import { ContactForm } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// To activate: sign up at https://formspree.io, create a form pointed at
// jonathanholloway.ail@gmail.com, then replace YOUR_FORM_ID below with the
// ID from your dashboard (e.g. "xpwzgkbd").
// ─────────────────────────────────────────────────────────────────────────────
const FORMSPREE_ID = "xrerkpez";
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

interface ContactProps {
  modalOpen?: boolean;
  currentModal?: string | null;
  handleOpen?: (modal: string) => void;
  handleClose?: () => void;
  darkBlack?: string;
  lightBlack?: string;
  grey?: string;
  lighterBlue?: string;
  anotherBlue?: string;
}

const Contact: React.FC<ContactProps> = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        const data = await res.json();
        setError(data?.errors?.[0]?.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      data-testid="contact-container"
      style={{ padding: "40px 0", minHeight: "70vh" }}
    >
      <Grid centered>
        <Grid.Column width={10}>
          <Header
            as="h1"
            textAlign="center"
            style={{ color: textAccent, marginBottom: "30px" }}
            className="gradient-text"
            data-testid="contact-title"
          >
            Get In Touch
          </Header>

          <Header
            as="h3"
            textAlign="center"
            style={{ color: textPrimary, marginBottom: "40px" }}
            data-testid="contact-subtitle"
          >
            I'd love to hear from you! Send me a message and I'll get back to
            you soon.
          </Header>

          {isSubmitted && (
            <Message
              success
              className="glass-card"
              data-testid="contact-success-message"
              style={{
                background: "rgba(57, 255, 20, 0.08)",
                color: textPrimary,
                border: `1px solid rgba(57, 255, 20, 0.3)`,
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}
            >
              <Message.Header data-testid="contact-success-header">
                Message sent!
              </Message.Header>
              <p data-testid="contact-success-body">
                Thanks for reaching out — I'll get back to you shortly.
              </p>
            </Message>
          )}

          {error && (
            <Message
              negative
              data-testid="contact-error-message"
              style={{
                background: "rgba(255, 107, 53, 0.08)",
                color: textPrimary,
                border: `1px solid rgba(255, 107, 53, 0.3)`,
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}
            >
              <Message.Header>Failed to send</Message.Header>
              <p>{error}</p>
            </Message>
          )}

          <Form
            onSubmit={handleSubmit}
            className="glass-card"
            data-testid="contact-form"
            style={{
              padding: "2rem",
              background: "rgba(255, 255, 255, 0.1)",
              border: glassmorphismBorder,
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              marginBottom: "30px",
            }}
          >
            <Form.Field required>
              <label style={{ color: textAccent, fontWeight: "600" }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="glass-input"
                data-testid="contact-name-input"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: textPrimary,
                  border: glassmorphismBorder,
                  borderRadius: "8px",
                  padding: "12px",
                  backdropFilter: "blur(10px)",
                }}
              />
            </Form.Field>

            <Form.Field required>
              <label style={{ color: textAccent, fontWeight: "600" }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="glass-input"
                data-testid="contact-email-input"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: textPrimary,
                  border: glassmorphismBorder,
                  borderRadius: "8px",
                  padding: "12px",
                  backdropFilter: "blur(10px)",
                }}
              />
            </Form.Field>

            <Form.Field required>
              <label style={{ color: textAccent, fontWeight: "600" }}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project or just say hello!"
                rows={6}
                required
                className="glass-input"
                data-testid="contact-message-input"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: textPrimary,
                  border: glassmorphismBorder,
                  borderRadius: "8px",
                  padding: "12px",
                  backdropFilter: "blur(10px)",
                  resize: "vertical",
                }}
              />
            </Form.Field>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="modern-button"
                data-testid="contact-submit-button"
                style={{
                  background: "linear-gradient(135deg, var(--cyan-primary), var(--blue-primary))",
                  color: "white",
                  padding: "12px 30px",
                  fontSize: "1.1em",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "600",
                }}
              >
                {isLoading ? "Sending…" : "Send Message"}
              </Button>
            </div>
          </Form>

          <div
            className="glass-card"
            data-testid="contact-social-section"
            style={{
              textAlign: "center",
              marginTop: "50px",
              padding: "30px",
              border: glassmorphismBorder,
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Header
              as="h4"
              style={{ color: textAccent }}
              data-testid="contact-social-title"
            >
              Other Ways to Connect
            </Header>
            <div style={{ marginBottom: "15px" }}>
              <a
                href="https://www.linkedin.com/in/jonathanjholloway/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contact-linkedin-link"
                style={{
                  color: textAccent,
                  fontSize: "1.1em",
                  textDecoration: "none",
                  display: "inline-block",
                  margin: "5px 15px",
                  transition: "all 0.3s ease",
                }}
                className="social-link"
              >
                📱 LinkedIn Profile
              </a>
              <a
                href="https://github.com/codejoncode"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contact-github-link"
                style={{
                  color: textAccent,
                  fontSize: "1.1em",
                  textDecoration: "none",
                  display: "inline-block",
                  margin: "5px 15px",
                  transition: "all 0.3s ease",
                }}
                className="social-link"
              >
                💻 GitHub Profile
              </a>
            </div>
            <p
              style={{ color: textPrimary, fontSize: "1.1em", marginBottom: "5px" }}
              data-testid="contact-location"
            >
              📍 Located in Crown Point, IN, USA
            </p>
            <p
              style={{ color: textPrimary, fontSize: "0.9em", fontStyle: "italic" }}
              data-testid="contact-remote-note"
            >
              Open to remote opportunities worldwide
            </p>
          </div>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Contact;
