import BaseModal from "./BaseModal";

type Props = {
  readonly title: string;
  readonly entityName?: string;
  readonly message?: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
};

export default function ConfirmationModal({
  title,
  entityName,
  message,
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
}: Props) {
  const handleConfirm = () => {
    onConfirm();
    onCancel();
  };

  return (
    <BaseModal onClose={onCancel} onConfirm={handleConfirm}>
      <div className="flex flex-col items-center text-center">
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

        <h2 className="mb-2 text-xl font-bold text-gray-800">{title}</h2>

        <p className="mb-8 text-sm text-gray-400">
          {message}
          {entityName && (
            <>
              {" "}
              <span className="font-semibold text-gray-700">{entityName}?</span>
            </>
          )}
        </p>

        <div className="flex w-full gap-4">
          <button
            autoFocus
            onClick={handleConfirm}
            className="bg-orange hover:bg-dark-orange flex-1 cursor-pointer rounded-xl py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95"
          >
            {confirmText}
          </button>

          <button
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white shadow transition-all duration-150 hover:bg-gray-700 active:scale-95"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
