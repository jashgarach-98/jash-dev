/**
 * Configuration for the "Hire Me" Chatbot / Contact Form
 *
 * Powered by FormSubmit.co:
 * - Sends submissions directly to garach.jash1@gmail.com
 * - Zero sign-up and zero API keys required
 * - The very first submission will send a one-time activation link to your inbox.
 *   Click "Activate" in that email once, and you are all set!
 */

export const HIRE_ME_CONFIG = {
  /**
   * Recipient email address where all enquiries will be delivered
   */
  RECIPIENT_EMAIL: "garach.jash1@gmail.com",

  /**
   * FormSubmit AJAX endpoint
   */
  get API_URL() {
    return `https://formsubmit.co/ajax/${this.RECIPIENT_EMAIL}`;
  },
};
