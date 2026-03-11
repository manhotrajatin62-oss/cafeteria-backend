import BaseModal from "./BaseModal";
import { useState } from "react";
import toast from "react-hot-toast";
import { addMoneyToWallet } from "../api/walletApi";

export default function AddMoneyModal({ userId, onClose }: any) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);

    try {
      await addMoneyToWallet({
        userId,
        amount: Number(amount),
      });

      toast.success(`₹ ${amount} added to wallet`);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add money");
    }

    setLoading(false);
  }

  return (
    <BaseModal onClose={onClose}>
      <h2 className="mb-6 text-xl font-bold text-gray-800">
        Add Money to Wallet
      </h2>

      <form onSubmit={(e: any) => e.preventDefault()}>
        <input
          autoFocus
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="focus:border-orange mb-6 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
        />

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl hover:bg-gray-700 cursor-pointer bg-gray-900 py-3 text-sm font-semibold text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange disabled:bg-light-orange hover:bg-dark-orange flex-1 cursor-pointer rounded-xl py-3 text-sm font-semibold text-white disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Money"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
