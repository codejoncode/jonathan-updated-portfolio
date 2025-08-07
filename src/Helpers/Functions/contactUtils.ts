// Utility functions for Contact component testing
import { ContactForm } from "../../types";

export const contactUtils = {
  // Create email subject for contact form
  createContactSubject: (name: string) =>
    encodeURIComponent(`Portfolio Contact: Message from ${name}`),

  // Create email body for contact form
  createContactBody: (formData: ContactForm) =>
    encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}

---
Sent from Jonathan Holloway Portfolio Contact Form
    `),

  // Create complete mailto link
  createMailtoLink: (
    formData: ContactForm,
    recipientEmail: string = "jonathanjamelholloway@gmail.com",
  ) => {
    const subject = contactUtils.createContactSubject(formData.name);
    const body = contactUtils.createContactBody(formData);
    return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  },

  // Validate form data
  validateForm: (formData: ContactForm) => {
    const errors: Partial<ContactForm> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Check if form is ready to submit
  isFormReady: (formData: ContactForm) => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.message.trim() !== "" &&
      contactUtils.validateForm(formData).isValid
    );
  },
};
