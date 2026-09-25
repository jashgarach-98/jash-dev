"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

interface HireMeContextType {
  isOpen: boolean;
  openHireMe: () => void;
  closeHireMe: () => void;
  toggleHireMe: () => void;
}

const HireMeContext = createContext<HireMeContextType | undefined>(undefined);

export function HireMeProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openHireMe = useCallback(() => setIsOpen(true), []);
  const closeHireMe = useCallback(() => setIsOpen(false), []);
  const toggleHireMe = useCallback(() => setIsOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({
      isOpen,
      openHireMe,
      closeHireMe,
      toggleHireMe,
    }),
    [isOpen, openHireMe, closeHireMe, toggleHireMe]
  );

  return (
    <HireMeContext.Provider value={value}>
      {children}
    </HireMeContext.Provider>
  );
}

export function useHireMe(): HireMeContextType {
  const context = useContext(HireMeContext);
  if (!context) {
    throw new Error("useHireMe must be used within a HireMeProvider");
  }
  return context;
}
