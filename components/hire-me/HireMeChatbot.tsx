"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, AlertCircle, ArrowRight, Mail } from "lucide-react";
import { useHireMe } from "@/context/HireMeContext";
import { HIRE_ME_CONFIG } from "@/config/hireMeConfig";

interface FormState {
  name: string;
  email: string;
  mobile: string;
  details: string;
  submittedAt: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export default function HireMeChatbot() {
  const { isOpen, closeHireMe } = useHireMe();

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    mobile: "",
    details: "",
    submittedAt: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const botcheckRef = useRef<HTMLInputElement>(null);
  const lastSubmitTimeRef = useRef<number>(0);

  // Focus first input when opened & manage body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 150);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeHireMe();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeHireMe]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate Name
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    // Validate Email
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    // Mobile Number and Share your details are strictly optional
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions while in flight
    if (status === "submitting") return;

    // Validate form fields
    if (!validate()) return;

    // Honeypot spam protection
    if (botcheckRef.current?.checked) {
      setStatus("success");
      return;
    }

    // Submission cooldown (5 seconds between attempts)
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 5000) {
      setErrorMessage("Please wait a few seconds before submitting again.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const submittedTimestamp = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const emailBody = `New Hire Me Enquiry
────────────────────────
Name: ${formData.name.trim()}
Email: ${formData.email.trim()}
Mobile Number: ${formData.mobile.trim() || "Not provided"}
Share Your Details: ${formData.details.trim() || "Not provided"}
────────────────────────
Source: Portfolio Website
Submitted: ${submittedTimestamp}`;

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        "Mobile Number": formData.mobile.trim() || "Not provided",
        "Share Your Details": formData.details.trim() || "Not provided",
        _subject: `New Hire Me Enquiry — ${formData.name.trim()}`,
        _template: "table",
        _captcha: "false",
      };

      const res = await fetch(HIRE_ME_CONFIG.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && (data.success === "true" || data.success === true)) {
        lastSubmitTimeRef.current = Date.now();
        setStatus("success");
      } else {
        lastSubmitTimeRef.current = Date.now();
        setErrorMessage(
          data.message ||
            "Something went wrong while sending your enquiry. Please try again or contact me directly by email."
        );
        setStatus("error");
      }
    } catch {
      lastSubmitTimeRef.current = Date.now();
      setErrorMessage(
        "Something went wrong while sending your enquiry. Please try again or contact me directly by email."
      );
      setStatus("error");
    }
  };

  const handleResetAndClose = () => {
    closeHireMe();
    // Reset state after animation completes
    setTimeout(() => {
      setStatus("idle");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        details: "",
        submittedAt: "",
      });
      setErrors({});
      setErrorMessage("");
    }, 300);
  };

  const handleTryAgain = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-end md:justify-end md:p-6 pointer-events-auto">
          {/* Backdrop on mobile / scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeHireMe}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm md:bg-background/20"
            aria-hidden="true"
          />

          {/* Chatbot Window */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hire-me-title"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex w-full flex-col max-h-[92vh] md:max-h-[640px] md:w-[420px] rounded-t-3xl md:rounded-3xl border border-border bg-surface/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-surface/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                {/* JG Avatar Emblem */}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-bold text-xs text-background font-mono shadow-sm">
                  JG
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      id="hire-me-title"
                      className="text-sm font-semibold text-foreground tracking-tight"
                    >
                      Jash Garach
                    </h2>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-foreground/50 leading-none mt-0.5">
                    Available for projects
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeHireMe}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground/60 transition-all duration-200 hover:border-accent hover:text-foreground hover:bg-accent/10 active:scale-95"
                aria-label="Close Hire Me popup"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Introduction bubble from Jash */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/15 border border-accent/20 text-accent font-mono text-[10px] font-bold">
                  JG
                </div>
                <div className="flex flex-col gap-1 max-w-[88%]">
                  <div className="rounded-2xl rounded-tl-sm border border-border bg-surface/80 p-3.5 text-xs sm:text-sm text-foreground/90 leading-relaxed shadow-sm">
                    Hi! Interested in working together? Share your details below
                    and I&apos;ll make sure Jash receives your enquiry.
                  </div>
                  <span className="text-[10px] font-mono text-foreground/40 pl-1">
                    Just now
                  </span>
                </div>
              </div>

              {/* Status Views: Success, Error, or Form */}
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-center space-y-3"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <CheckCircle2 size={24} />
                  </div>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    Thanks for reaching out! Your enquiry has been sent
                    successfully. Jash will get back to you soon.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="inline-flex h-9 items-center justify-center rounded-xl bg-accent px-5 text-xs font-semibold text-background transition-opacity hover:opacity-90 active:scale-95"
                  >
                    Close
                  </button>
                </motion.div>
              ) : status === "error" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 space-y-3"
                >
                  <div className="flex items-start gap-2.5 text-red-500">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm leading-relaxed text-foreground/90">
                      {errorMessage ||
                        "Something went wrong while sending your enquiry. Please try again or contact me directly by email."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleTryAgain}
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-accent px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90 active:scale-95"
                    >
                      Try Again
                    </button>
                    <a
                      href={`mailto:${HIRE_ME_CONFIG.RECIPIENT_EMAIL}`}
                      className="text-xs font-mono text-accent hover:underline flex items-center gap-1"
                    >
                      <Mail size={12} /> Contact via email
                    </a>
                  </div>
                </motion.div>
              ) : null}

              {/* Form (visible during idle, submitting, or if retry clicked) */}
              {status !== "success" && (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-3.5 pt-1"
                >
                  {/* Invisible Honeypot Spam Field */}
                  <input
                    ref={botcheckRef}
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name Field */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="hire-me-name"
                      className="text-[11px] uppercase tracking-[0.15em] text-foreground/70 font-mono font-medium"
                    >
                      Name <span className="text-accent">*</span>
                    </label>
                    <input
                      ref={firstInputRef}
                      id="hire-me-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "hire-me-name-error" : undefined}
                      className="w-full rounded-xl border border-border bg-surface/50 px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground/30 backdrop-blur-sm transition-all duration-300 focus:border-accent focus:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                    {errors.name && (
                      <p
                        id="hire-me-name-error"
                        role="alert"
                        className="text-[11px] font-mono text-red-400 pl-0.5"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="hire-me-email"
                      className="text-[11px] uppercase tracking-[0.15em] text-foreground/70 font-mono font-medium"
                    >
                      Email <span className="text-accent">*</span>
                    </label>
                    <input
                      id="hire-me-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "hire-me-email-error" : undefined}
                      autoComplete="email"
                      className="w-full rounded-xl border border-border bg-surface/50 px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground/30 backdrop-blur-sm transition-all duration-300 focus:border-accent focus:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                    {errors.email && (
                      <p
                        id="hire-me-email-error"
                        role="alert"
                        className="text-[11px] font-mono text-red-400 pl-0.5"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number Field (Optional) */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="hire-me-mobile"
                      className="text-[11px] uppercase tracking-[0.15em] text-foreground/70 font-mono font-medium"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="hire-me-mobile"
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      autoComplete="tel"
                      className="w-full rounded-xl border border-border bg-surface/50 px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground/30 backdrop-blur-sm transition-all duration-300 focus:border-accent focus:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  {/* Share your details Field (Optional) */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="hire-me-details"
                      className="text-[11px] uppercase tracking-[0.15em] text-foreground/70 font-mono font-medium"
                    >
                      Share your details
                    </label>
                    <textarea
                      id="hire-me-details"
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="Tell me a little about your project, requirements, or anything you'd like to discuss..."
                      rows={3}
                      className="w-full rounded-xl border border-border bg-surface/50 px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground/30 backdrop-blur-sm transition-all duration-300 focus:border-accent focus:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                    />
                  </div>

                  {/* Direct Email Fallback */}
                  <div className="pt-0.5">
                    <a
                      href={`mailto:${HIRE_ME_CONFIG.RECIPIENT_EMAIL}`}
                      className="group inline-flex items-center gap-1.5 text-xs font-mono text-foreground/60 hover:text-accent transition-colors duration-200"
                    >
                      <span>Prefer email? Contact me directly</span>
                      <ArrowRight
                        size={12}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </a>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-background transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Send size={15} />
                      {status === "submitting" ? "Sending..." : "Send Enquiry"}
                    </button>
                  </div>

                  {/* Privacy Message */}
                  <p className="text-[11px] text-foreground/45 leading-relaxed text-center pt-1 font-mono">
                    By submitting this form, you agree that the information
                    provided may be used to contact you regarding your enquiry.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
