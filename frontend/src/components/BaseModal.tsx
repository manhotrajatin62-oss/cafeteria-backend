import { useEffect, useState, type ReactNode } from "react";

type Props = {
  readonly children: ReactNode;
  readonly onClose: () => void;
  readonly onConfirm?: () => void;
};

export default function BaseModal({ children, onClose, onConfirm }: Props) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));

    // lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // keyboard handler
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose(onClose);
      }

      if (e.key === "Enter" && onConfirm) {
        onConfirm();
      }
    };

    globalThis.addEventListener("keydown", handleKey);

    return () => {
      cancelAnimationFrame(raf);
      globalThis.removeEventListener("keydown", handleKey);

      // restore scroll
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  function handleClose(callback?: () => void) {
    setClosing(true);
    setVisible(false);

    setTimeout(() => {
      callback?.();
    }, 300);
  }

  return (
    <button
      className="fixed inset-0 z-99 flex items-center justify-center"
      style={{
        backgroundColor:
          visible && !closing ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: "background-color 300ms ease",
      }}
      onClick={() => handleClose(onClose)}
    >
      <button
        className="mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl"
        style={{
          opacity: visible && !closing ? 1 : 0,
          transform:
            visible && !closing ? "translateY(0px)" : "translateY(-20px)",
          transition: "opacity 300ms ease, transform 300ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </button>
    </button>
  );
}
