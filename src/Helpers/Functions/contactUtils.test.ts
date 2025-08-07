import { contactUtils } from "./contactUtils";

describe("Contact Utils", () => {
  describe("createContactSubject", () => {
    it("creates encoded subject with name", () => {
      const result = contactUtils.createContactSubject("John Doe");
      const decoded = decodeURIComponent(result);
      expect(decoded).toBe("Portfolio Contact: Message from John Doe");
    });
  });

  describe("validateForm", () => {
    it("validates empty form correctly", () => {
      const result = contactUtils.validateForm({
        name: "",
        email: "",
        message: "",
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe("Name is required");
      expect(result.errors.email).toBe("Email is required");
      expect(result.errors.message).toBe("Message is required");
    });

    it("validates complete form correctly", () => {
      const result = contactUtils.validateForm({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello there!",
      });

      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it("validates invalid email correctly", () => {
      const result = contactUtils.validateForm({
        name: "John Doe",
        email: "invalid-email",
        message: "Hello there!",
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe("Please enter a valid email address");
    });
  });

  describe("isFormReady", () => {
    it("returns false for incomplete form", () => {
      const result = contactUtils.isFormReady({
        name: "John",
        email: "",
        message: "Test",
      });
      expect(result).toBe(false);
    });

    it("returns true for complete valid form", () => {
      const result = contactUtils.isFormReady({
        name: "John Doe",
        email: "john@example.com",
        message: "Test message",
      });
      expect(result).toBe(true);
    });
  });
});
