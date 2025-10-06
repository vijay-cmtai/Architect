// src/components/BlackScreenshotGuard.jsx
import { useEffect, useState } from "react";

const BlackScreenshotGuard = ({ children }) => {
  const [isBlocking, setIsBlocking] = useState(false);

  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => e.preventDefault();

    // Detect print screen or common screenshot shortcuts
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // Block Print Screen key
      if (key === "printscreen") {
        setIsBlocking(true);
        setTimeout(() => setIsBlocking(false), 800);
      }

      // Block Cmd+Shift+3/4 (Mac) and Ctrl+P (Print)
      if (
        (e.metaKey && e.shiftKey && (key === "3" || key === "4")) ||
        (e.ctrlKey && key === "p")
      ) {
        e.preventDefault();
        setIsBlocking(true);
        setTimeout(() => setIsBlocking(false), 800);
      }
    };

    // Optional: detect screen capture tools using visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsBlocking(true);
        setTimeout(() => setIsBlocking(false), 800);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  return (
    <div className="relative">
      {children}
      {isBlocking && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "black",
            zIndex: 99999,
            opacity: 1,
            transition: "opacity 0.3s ease",
          }}
        ></div>
      )}
    </div>
  );
};

export default BlackScreenshotGuard;