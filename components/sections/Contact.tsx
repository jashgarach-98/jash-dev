"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Send, Mail, Linkedin, Youtube, Instagram, CheckCircle2, AlertCircle } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { HIRE_ME_CONFIG } from "@/config/hireMeConfig";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

function AnimatedInput({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  isTextarea,
  required,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder: string;
  isTextarea?: boolean;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs uppercase tracking-[0.15em] text-foreground/60 font-mono font-medium"
      >
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={5}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 backdrop-blur-sm transition-all duration-300 focus:border-accent focus:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 backdrop-blur-sm transition-all duration-300 focus:border-accent focus:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent/20"
          autoComplete={type === "email" ? "email" : "on"}
        />
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[11px] font-mono text-red-400 pl-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jash-garach-086759131",
    icon: Linkedin,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@JASHGARACH",
    icon: Youtube,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/jashgarach.tech/",
    icon: Instagram,
  },
  {
    label: "Email",
    href: "mailto:garach.jash1@gmail.com",
    icon: Mail,
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const botcheckRef = useRef<HTMLInputElement>(null);
  const lastSubmitTimeRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Rotating stamp parallax
  const stampRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formState.name.trim()) {
      newErrors.name = "Please enter your name.";
    }
    if (!formState.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formState.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }
    if (!formState.message.trim()) {
      newErrors.message = "Please enter your message.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    if (!validate()) return;

    if (botcheckRef.current?.checked) {
      setStatus("success");
      return;
    }

    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 5000) {
      setErrorMessage("Please wait a few seconds before submitting again.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const payload = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        message: formState.message.trim(),
        _subject: `New Portfolio Message from ${formState.name.trim()}`,
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
        setFormState({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        lastSubmitTimeRef.current = Date.now();
        setErrorMessage(
          data.message ||
            "Something went wrong while sending your message. Please try again or email directly."
        );
        setStatus("error");
      }
    } catch {
      lastSubmitTimeRef.current = Date.now();
      setErrorMessage(
        "Something went wrong while sending your message. Please try again or email directly."
      );
      setStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden px-4 pt-14 pb-8 md:pt-20 md:pb-10 lg:pt-24 lg:pb-12"
      aria-label="Contact Jash Garach"
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-accent opacity-[0.06] blur-[140px]" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-accent opacity-[0.04] blur-[100px]" />

      <div className="mx-auto w-full max-w-7xl">
        {/* ── Massive headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 md:mb-14"
        >
          <span className="section-tag">Get in Touch</span>
          <h2 className="mt-2 sm:mt-3 text-[clamp(2.5rem,7.5vw,5.5rem)] font-bold leading-[1.0] tracking-tight text-balance">
            Let&apos;s build{" "}
            <span className="text-accent">together.</span>
          </h2>
          <p className="mt-3.5 max-w-xl text-base sm:text-lg text-foreground/60 leading-relaxed">
            Looking for an Android or Flutter developer who cares about clean
            delivery and real-world usability? Let&apos;s talk.
          </p>
        </motion.div>

        {/* ── Grid: Form + Social ── */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-14 items-start">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-3xl border border-border bg-surface/40 p-5 sm:p-6 md:p-7 backdrop-blur-md shadow-xl transition-all duration-500">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4 sm:gap-5"
                id="contact-form"
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

                <AnimatedInput
                  id="contact-name"
                  label="Your Name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Jash Garach"
                  required
                  error={errors.name}
                />

                <AnimatedInput
                  id="contact-email"
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  error={errors.email}
                />

                <AnimatedInput
                  id="contact-message"
                  label="Your Message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, role, or idea..."
                  isTextarea
                  required
                  error={errors.message}
                />

                {/* Success feedback */}
                {status === "success" && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent/10 p-3.5 text-xs sm:text-sm text-foreground font-medium">
                    <CheckCircle2 size={18} className="text-accent shrink-0" />
                    <span>Thanks for reaching out! Your message was sent successfully.</span>
                  </div>
                )}

                {/* Error feedback */}
                {status === "error" && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs sm:text-sm text-foreground/90">
                    <AlertCircle size={18} className="text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-1">
                  <MagneticButton
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex h-11 sm:h-12 items-center gap-2 rounded-full bg-accent px-6 sm:px-7 text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                    strength={20}
                    aria-label="Send message"
                  >
                    <Send size={15} />
                    {status === "submitting" ? "Sending..." : "Send Message"}
                  </MagneticButton>

                  <p className="text-xs text-foreground/40 leading-tight">
                    Delivered directly to
                    <br />
                    my email inbox
                  </p>
                </div>
              </form>
          </div>
        </motion.div>

          {/* Social links + stamp */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col gap-6 md:gap-8 justify-start"
          >
            {/* Direct links */}
            <div>
              <p className="mb-3 md:mb-4 text-xs uppercase tracking-[0.18em] text-foreground/40 font-mono">
                Find Me On
              </p>
              <div className="flex flex-col gap-2.5">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("mailto") ? undefined : "_blank"}
                      rel={
                        link.href.startsWith("mailto")
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-surface/40 px-4 py-3 sm:px-5 sm:py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-accent hover:bg-accent/5"
                    >
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground/50 transition-all duration-300 group-hover:border-accent group-hover:text-accent group-hover:bg-accent/10">
                        <Icon size={17} />
                      </div>
                      <span className="text-sm sm:text-base font-medium text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
                        {link.label}
                      </span>
                      <span className="ml-auto text-xs text-foreground/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                        ↗
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Rotating stamp */}
            <div className="mt-1 flex justify-center md:justify-start">
              <motion.div
                style={{ rotate: stampRotate }}
                className="relative h-28 w-28 sm:h-32 sm:w-32"
                aria-hidden="true"
              >
                {/* Rotating text ring */}
                <svg
                  viewBox="0 0 120 120"
                  className="animate-spin-slow absolute inset-0"
                  aria-hidden="true"
                >
                  <defs>
                    <path
                      id="circle"
                      d="M 60,60 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    />
                  </defs>
                  <text
                    className="fill-foreground/30 text-[8px] font-mono uppercase tracking-[0.18em]"
                    style={{ fontSize: "7.5px", fontFamily: "monospace" }}
                  >
                    <textPath href="#circle">
                      ✦ Jash Garach ✦ Android · Flutter ✦ Let&apos;s Connect ✦
                    </textPath>
                  </text>
                </svg>

                {/* Center mark */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-accent text-accent font-bold text-sm">
                    JG
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Footer ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 md:mt-16 flex flex-col gap-3 border-t border-border pt-6 md:pt-8 md:flex-row md:items-center md:justify-between"
        >
          <p className="text-sm text-foreground/40">
            © {new Date().getFullYear()} Jash Garach. All rights reserved.
          </p>
          <p className="text-sm text-foreground/30">
            garach.jash1@gmail.com
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
