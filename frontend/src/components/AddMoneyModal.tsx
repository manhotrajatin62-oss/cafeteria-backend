import { useEffect, useState } from "react";
import { addMoneyToWallet } from "../api/walletApi";
import toast from "react-hot-toast";

type Props = {
  readonly userId: string;
  readonly onClose: () => void;
};

export default function AddMoneyModal({ userId, onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleClose(callback?: () => void) {
    setClosing(true);
    setVisible(false);
    setTimeout(() => {
      callback?.();
    }, 300);
  }

  async function handleSubmit() {
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);

    try {
      await addMoneyToWallet({
        userId,
        amount: Number(amount),
      });
      handleClose(onClose);
      toast.success(`₹ ${Number(amount)} added to wallet successfully`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error occurred while adding money",
      );
    }

    setLoading(false);
  }

  return (
    <button
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor:
          visible && !closing ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        transition: "background-color 300ms ease",
      }}
      onClick={() => handleClose(onClose)}
    >
      <button
        className="mx-4 flex w-full max-w-md flex-col rounded-xl bg-white p-8 shadow-2xl"
        style={{
          opacity: visible && !closing ? 1 : 0,
          transform:
            visible && !closing ? "translateY(0px)" : "translateY(-20px)",
          transition: "opacity 300ms ease, transform 300ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-xl font-bold text-gray-800">
          Add Money to Wallet
        </h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="focus:border-orange mb-6 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
        />

        <div className="flex w-full gap-4">
          <button
            onClick={() => handleClose(onClose)}
            className="flex-1 cursor-pointer rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white shadow transition-all duration-150 hover:bg-gray-700 active:scale-95"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange hover:bg-dark-orange flex-1 cursor-pointer rounded-xl py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Money"}
          </button>
        </div>
      </button>
    </button>
  );
}
