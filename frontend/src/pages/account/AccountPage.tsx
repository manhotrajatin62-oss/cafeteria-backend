import React, { useState, useRef } from "react";
import AccountTables from "./AccountTables";
import { FiUser } from "react-icons/fi";
import { MdBarChart, MdDelete } from "react-icons/md";
import { IoIosExit, IoIosWallet } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../../store/useLogin";
import toast from "react-hot-toast";

export interface OrderRecord {
  id: number;
  date: string;
  orderId: string;
  employeeId: string;
  employeeName: string;
  status: "confirmed" | "pending" | "cancelled";
  totalAmount: number;
}

export interface WalletRecord {
  id: number;
  payment: number;
  walletBalance: number;
  date: string;
  time: string;
}

export default function AccountPage() {
  const { setShowLogin, setOtp, setShowOtpPage } = useLogin();

  // states
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRemoveImage() {
    setProfileImage(null);
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
    setShowLogin(true);
    setShowOtpPage(false);
    setOtp("");
    toast.success("Logout successful");
  }

  return (
    <div className="min-h-screen">
      <div className="flex w-full items-center justify-between px-8 pt-4">
        <h1 className="text-xl font-bold text-gray-800">Account Details</h1>

        <button
          onClick={handleLogout}
          className="bg-orange hover:bg-dark-orange flex cursor-pointer items-center gap-3 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95"
        >
          <IoIosExit size={25} /> Logout
        </button>
      </div>

      {/* employee info component */}
      <div className="m-8 mb-6 rounded-lg border border-gray-300 bg-white p-8 shadow">
        <div className="flex flex-col gap-15 md:flex-row">
          {/* image upload  */}
          <div className="relative flex shrink-0 flex-col items-center gap-4">
            {/* Avatar circle */}
            <div className="flex h-60 w-60 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser className="text-gray-400" size={70} />
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              id="file"
              name="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="border-orange text-orange cursor-pointer rounded-lg border-2 px-5 py-2 text-sm font-semibold transition hover:bg-orange-50"
            >
              Choose a file
            </button>

            {profileImage && (
              <button
                onClick={handleRemoveImage}
                className="bg-orange hover:bg-dark-orange absolute top-3 right-6 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-white"
              >
                <MdDelete size={20} color="white" />
              </button>
            )}
          </div>

          {/* Right: Info fields */}
          <div className="flex-1">
            <h2 className="text-orange mb-1 text-xl font-bold">
              {isAdmin ? "Admin Info" : "Employee Info"}
            </h2>
            <div className="mb-5 border-b-2 border-gray-800" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Name */}
              <div className="rounded-lg border border-gray-300 p-4">
                <p className="mb-1 text-xs text-gray-400">Name</p>
                <p className="font-semibold text-gray-800">Akashdeep Singh</p>
              </div>

              {/* Email */}
              <div className="rounded-lg border border-gray-300 p-4">
                <p className="mb-1 text-xs text-gray-400">Email ID</p>
                <p className="font-semibold text-gray-800">
                  SinghAkashdeep1@Seasiaconnect.Com
                </p>
              </div>
            </div>

            {/* pending bill, wallet */}
            {!isAdmin && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 rounded-lg border border-gray-300 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                    <MdBarChart size={25} color="white" />
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-gray-400">Pending Bill</p>
                    <p className="font-semibold text-gray-800">₹15.00</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border border-gray-300 p-4">
                  <div className="bg-orange flex h-10 w-10 items-center justify-center rounded-full">
                    <IoIosWallet size={22} color="white" />
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-gray-400">Wallet</p>
                    <p className="font-semibold text-gray-800">₹0.00</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* table component */}
      {!isAdmin && <AccountTables />}
    </div>
  );
}
