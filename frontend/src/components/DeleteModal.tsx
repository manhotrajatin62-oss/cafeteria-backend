import { useEffect, useState } from "react";

interface DeleteModalProps {
  readonly entityName: string;
  readonly entityLabel: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export default function DeleteModal({
  entityName,
  entityLabel,
  onConfirm,
  onCancel,
}: DeleteModalProps) {

  // states
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleClose(callback: () => void) {
    setClosing(true);
    setVisible(false);
    setTimeout(callback, 300);
  }

  return (

    // dark overlay
    <button
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor:
          visible && !closing ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: "background-color 300ms ease",
      }}
      onClick={() => handleClose(onCancel)}
    >

      {/* delete modal body */}
      <button
        className="mx-4 flex w-full max-w-md flex-col items-center rounded-xl bg-white p-8 text-center shadow-2xl"
        style={{
          opacity: visible && !closing ? 1 : 0,
          transform:
            visible && !closing ? "translateY(0px)" : "translateY(-20px)",
          transition: "opacity 300ms ease, transform 300ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Warning Icon */}
        <div className="mb-4">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <polygon
              points="28,6 52,48 4,48"
              fill="none"
              stroke="#F97316"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <text
              x="28"
              y="42"
              textAnchor="middle"
              fontSize="22"
              fill="#F97316"
              fontWeight="bold"
            >
              !
            </text>
          </svg>
        </div>

        {/* delete text */}
        <h2 className="mb-2 text-xl font-bold text-gray-800">
          Delete This {entityLabel}?
        </h2>
        <p className="mb-8 text-sm text-gray-400">
          Are you sure, You want to delete{" "}
          <span className="font-semibold text-gray-600">{entityName}?</span>
        </p>

        {/* yes and no buttons */}
        <div className="flex w-full gap-4">
          <button
            onClick={() => handleClose(onConfirm)}
            className="flex-1 rounded-xl bg-orange cursor-pointer py-3 text-sm font-semibold text-white shadow transition-all duration-150 hover:bg-dark-orange active:scale-95"
          >
            Yes
          </button>
          <button
            onClick={() => handleClose(onCancel)}
            className="flex-1 rounded-xl bg-gray-900 cursor-pointer py-3 text-sm font-semibold text-white shadow transition-all duration-150 hover:bg-gray-700 active:scale-95"
          >
            No
          </button>
        </div>
      </button>
    </button>
  );
}
