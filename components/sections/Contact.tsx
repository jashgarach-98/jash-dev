"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Send, Mail, Linkedin, Youtube, Instagram } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

interface FormState {
  name: string;
  email: string;
  message: string;
}

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
}) {
  return (
    <div className="animated-input-wrapper">
      <label
        htmlFor={id}
        className="block mb-2 text-xs uppercase tracking-[0.15em] text-foreground/40 font-mono"
      >
        {label}
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
          className="animated-input resize-none"
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
          className="animated-input"
          autoComplete={type === "email" ? "email" : "on"}
        />
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
  const [submitted, setSubmitted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Rotating stamp parallax
  const stampRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, message } = formState;
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(
      `Hi Jash,\n\n${message}\n\nBest,\n${name}\n${email}`
    );
    window.location.href = `mailto:garach.jash1@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen overflow-hidden px-4 py-24 md:px-8 md:py-32 flex flex-col justify-center"
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
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
        >
          <span className="section-tag">Get in Touch</span>
          <h2 className="mt-4 text-[clamp(2.8rem,8vw,6.5rem)] font-bold leading-[1.0] tracking-tight text-balance">
            Let&apos;s build{" "}
            <span className="text-accent">together.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-foreground/60 leading-relaxed">
            Looking for an Android or Flutter developer who cares about clean
            delivery and real-world usability? Let&apos;s talk.
          </p>
        </motion.div>

        {/* ── Grid: Form + Social ── */}
        <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-8"
              id="contact-form"
            >
              <AnimatedInput
                id="contact-name"
                label="Your Name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Jash Garach"
                required
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
              />

              <div className="flex items-center gap-4">
                <MagneticButton
                  type="submit"
                  className="flex h-12 items-center gap-2 rounded-full bg-accent px-7 text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                  strength={20}
                  aria-label="Send message"
                >
                  <Send size={15} />
                  {submitted ? "Sent! Opening email…" : "Send Message"}
                </MagneticButton>

                <p className="text-xs text-foreground/40 leading-tight">
                  Opens your default
                  <br />
                  email client
                </p>
              </div>
            </form>
          </motion.div>

          {/* Social links + stamp */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-col justify-between gap-10"
          >
            {/* Direct links */}
            <div>
              <p className="mb-6 text-xs uppercase tracking-[0.18em] text-foreground/40 font-mono">
                Find me on
              </p>
              <div className="flex flex-col gap-3">
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
                      className="group flex items-center gap-4 rounded-xl border border-border bg-surface/40 px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:border-accent hover:bg-accent/5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground/50 transition-all duration-300 group-hover:border-accent group-hover:text-accent group-hover:bg-accent/10">
                        <Icon size={18} />
                      </div>
                      <span className="font-medium text-foreground/70 transition-colors duration-300 group-hover:text-foreground">
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
            <div className="flex justify-center md:justify-start">
              <motion.div
                style={{ rotate: stampRotate }}
                className="relative h-32 w-32"
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent text-accent font-bold text-sm">
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
          className="mt-24 flex flex-col gap-3 border-t border-border pt-8 md:flex-row md:items-center md:justify-between"
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
