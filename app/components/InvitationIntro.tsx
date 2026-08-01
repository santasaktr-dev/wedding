"use client";

import { useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";

const viewedKey = "jah-smart-invitation-intro-viewed";

function getIntroMode() {
  if (typeof window === "undefined") return "default";

  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "show") return "show";
  if (params.get("intro") === "skip") return "skip";
  return window.sessionStorage.getItem(viewedKey) ? "skip" : "show";
}

export function InvitationIntro() {
  const shouldShow = useSyncExternalStore(
    () => () => undefined,
    () => getIntroMode() === "show",
    () => false,
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const isVisible = shouldShow && !isDismissed;

  useEffect(() => {
    if (!isVisible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    openButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  function finish(animated: boolean) {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(viewedKey, "true");
    }

    if (!animated) {
      setIsDismissed(true);
      return;
    }

    setIsOpening(true);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => setIsDismissed(true), reduceMotion ? 0 : 1450);
  }

  if (!isVisible) return null;

  return (
    <div
      aria-labelledby="invitation-intro-title"
      aria-modal="true"
      className={`invitation-intro ${isOpening ? "is-opening" : ""}`}
      role="dialog"
    >
      <button className="invitation-skip" onClick={() => finish(false)} type="button">
        Skip to website
      </button>
      <div className="invitation-stage">
        <div className="invitation-envelope">
          <button
            aria-label="Open invitation"
            className="invitation-envelope-trigger"
            onClick={() => finish(true)}
            ref={openButtonRef}
            type="button"
          >
            <div aria-hidden="true" className="invitation-envelope-back" />
            <div aria-hidden="true" className="invitation-letter">
              <span className="invitation-letter-kicker">The wedding of</span>
              <strong>Jah &amp; Smart</strong>
            </div>
            <div aria-hidden="true" className="invitation-flap" />
            <div aria-hidden="true" className="invitation-seal">J&amp;S</div>
          </button>
        </div>
        <div className="invitation-copy">
          <p id="invitation-intro-title">Tap the envelope to open</p>
        </div>
      </div>
    </div>
  );
}
