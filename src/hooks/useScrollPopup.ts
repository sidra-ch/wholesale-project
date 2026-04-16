"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "wa-popup-dismissed";

export function useScrollPopup(scrollThreshold = 0.4, timeDelay = 5000) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setShow(true);
    };

    // Time-based trigger
    const timer = setTimeout(trigger, timeDelay);

    // Scroll-based trigger
    const onScroll = () => {
      const scrolled =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= scrollThreshold) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [scrollThreshold, timeDelay]);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  return { show, dismiss };
}
