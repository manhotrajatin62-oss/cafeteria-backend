import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable, { type TableColumn } from "react-data-table-component";
import type { Customer, FieldConfig, View, WalletRecord } from "../types.ts";
import { WALLET_DATA } from "../data.ts";
import GenericForm from "../../../components/GenericForm.tsx";
import DeleteModal from "../../../components/DeleteModal.tsx";
import { FaTrash } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import user from "../../../assets/user.jpg";
import { IoClose, IoSearch } from "react-icons/io5";
import {
  deleteCustomer,
  fetchAllCustomers,
  updateCustomer,
} from "../../../api/customersApi.ts";
import Loader from "../../../ui/Loader.tsx";
import { registerUser } from "../../../api/authApi.ts";
import {registerSchema} from "../../../../../backend/validations/authValidation.ts"

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #d1d5dc",
      borderTop: "1px solid #d1d5dc",
      borderLeft: "1px solid #d1d5dc",
    },
  },
  headCells: {
    style: {
      color: "#94a3b8",
      fontSize: "14px",
      fontWeight: "700",
      paddingLeft: "16px",
      paddingRight: "16px",
      borderRight: "1px solid #d1d5dc",
    },
  },
  rows: {
    style: {
      minHeight: "68px",
      borderBottom: "1px solid #d1d5dc",
      borderLeft: "1px solid #d1d5dc",
      "&:hover": { backgroundColor: "#fff7ed" },
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      borderRight: "1px solid #d1d5dc",
    },
  },
};

const customerFields: FieldConfig<Customer>[] = [
  {
    key: "name",
    label: "Full Name",
    placeholder: "Enter Full Name",
    type: "text",
  },
  {
    key: "email",
    label: "Email",
    placeholder: "Enter Email Address",
    type: "text",
  },
  {
    key: "orders",
    label: "Orders",
    placeholder: "Enter Order Count",
    type: "number",
    required: false,
  },
  {
    key: "pendingBill",
    label: "Pending Bill",
    placeholder: "Enter Pending Bill",
    type: "number",
    required: false,
  },
  {
    key: "wallet",
    label: "Wallet",
    placeholder: "Enter Wallet Balance",
    type: "number",
    required: false,
  },
];

const walletColumns: TableColumn<WalletRecord>[] = [
  {
    name: "S No.",
    width: "90px",
    sortable: true,
    grow: 0,
    center: true,
    cell: (_row, index) => (
      <span className="text-sm font-semibold">{index + 1}.</span>
    ),
  },
  {
    name: "Name",
    selector: (r) => r.employeeName,
    sortable: true,
    center: true,
    cell: (r) => (
      <span className="text-sm font-semibold">{r.employeeName}</span>
    ),
  },
  {
    name: "Payment",
    selector: (r) => r.payment,
    sortable: true,
    center: true,
    cell: (r) => <span className="text-sm font-semibold">{r.payment}</span>,
  },
  {
    name: "Wallet Balance",
    selector: (r) => r.walletBalance,
    sortable: true,
    center: true,
    cell: (r) => (
      <span className="text-sm font-semibold">{r.walletBalance}</span>
    ),
  },
  {
    name: "Date",
    selector: (r) => r.date,
    sortable: true,
    center: true,
    cell: (r) => <span className="text-sm font-semibold">{r.date}</span>,
  },
  {
    name: "Time",
    selector: (r) => r.time,
    center: true,
    cell: (r) => <span className="text-sm font-semibold">{r.time}</span>,
  },
];

export default function CustomerTable() {
  // states
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>("table");
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [walletSearch, setWalletSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"userList" | "walletHistory">(
    "userList",
  );

  const customerColumns: TableColumn<Customer>[] = [
    {
      name: "S No.",
      width: "90px",
      grow: 0,
      center: true,
      sortable: true,
      cell: (_row, index) => (
        <span className="text-sm font-semibold">{index + 1}.</span>
      ),
    },
    {
      name: "Name",
      sortable: true,
      minWidth: "200px",
      sortFunction: (a, b) => a.name.localeCompare(b.name),
      grow: 1.5,
      cell: (row) => (
        <div className="flex items-center gap-3 py-2">
          <img
            draggable="false"
            src={row.image === "user" ? user : row.image}
            alt={row.name}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="text-sm font-semibold">{row.name}</span>
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      center: true,
      minWidth: "220px",
      cell: (row) => <span className="text-sm font-semibold">{row.email}</span>,
    },
    {
      name: "Orders",
      selector: (row) => row.orders ?? 0,
      sortable: true,
      minWidth: "50px",
      center: true,
      cell: (row) => (
        <span className="text-sm font-semibold">{row.orders ?? 0}</span>
      ),
    },
    {
      name: "Pending Bill",
      selector: (row) => row.pendingBill,
      sortable: true,
      center: true,
      minWidth: "140px",
      cell: (row) => (
        <span className="text-sm font-semibold">₹ {row.pendingBill}</span>
      ),
    },
    {
      name: "Wallet",
      selector: (row) => row.wallet,
      sortable: true,
      minWidth: "80px",
      center: true,
      cell: (row) => (
        <span className="text-sm font-semibold">₹ {row.wallet}</span>
      ),
    },
    {
      name: "Action",
      minWidth: "160px",
      center: true,
      ignoreRowClick: true,
      cell: (row) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setEditTarget(row);
              setView("edit");
            }}
            className="flex cursor-pointer items-center gap-1 text-sm font-medium text-green-500 transition hover:text-green-600"
          >
            <MdModeEdit size={18} /> Edit
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="text-orange hover:text-dark-orange flex cursor-pointer items-center gap-1 text-sm font-medium transition"
          >
            <FaTrash size={15} /> Delete
          </button>
        </div>
      ),
    },
  ];

  function findConflict(
    data: Omit<Customer, "_id">,
    excludeId?: string | number,
  ): string | null | undefined {
    if (!rows) return;

    const inName = (data.name ?? "").toLowerCase().trim();
    const inEmail = (data.email ?? "").toLowerCase().trim();
    for (const row of rows) {
      if (excludeId !== undefined && row._id === excludeId) continue;
      if (inName !== "" && row.name.toLowerCase().trim() === inName)
        return "name";
      if (inEmail !== "" && row.email.toLowerCase().trim() === inEmail)
        return "email";
    }
    return null;
  }

  async function handleAddSubmit(data: Omit<Customer, "_id">) {
    const conflict = findConflict(data);
    if (conflict) {
      toast.error(`A customer with this ${conflict} already exists.`);
      return;
    }

    try {
      await registerUser(data.name, data.email);

      toast.success("Customer added successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add customer");
    }

    setView("table");
  }

  async function handleEditSubmit(data: Omit<Customer, "_id">) {
    if (!editTarget) return;

    const conflict = findConflict(data, editTarget._id);
    if (conflict) {
      toast.error(`Another customer with this ${conflict} already exists.`);
      return;
    }

    try {
      const res = await updateCustomer(editTarget._id, data);
      // setRows((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));

      toast.success("Customer updated successfully");

      setEditTarget(null);
      setView("table");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating customer");
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    try {
      await deleteCustomer(deleteTarget._id);

      // setRows((prev) => prev.filter((r) => r._id !== deleteTarget._id));

      toast.success(deleteTarget.name + " deleted successfully");

      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error deleting customer");
    }
  }

  // search filter logic
  const filteredUsers = (() => {
    if (!rows) return [];
    const q = userSearch.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q),
    );
  })();

  const filteredWallet = (() => {
    const q = walletSearch.toLowerCase().trim();
    if (!q) return WALLET_DATA;
    return WALLET_DATA.filter((r) => r.employeeName.toLowerCase().includes(q));
  })();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await fetchAllCustomers();
        const formatted = res.data.data.map((u: any) => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          image: u.image ?? user,
          orders: u.ordersCount ?? 0,
          wallet: u.wallet?.balance ?? 0,
          pendingBill: u.wallet?.pendingBill ?? 0,
        }));

        setRows(formatted);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        toast.error(
          error.response?.data?.message ||
            "Error occurred while fetching customers",
        );
      }
    };

    fetchCustomers();
  }, []);

  // render add customer form component
  if (view === "add") {
    return (
      <div className="min-h-screen">
        <div>
          <GenericForm<Customer>
            title="Add Customer"
            fields={customerFields}
            defaultImage={user}
            onBack={() => setView("table")}
            onSubmit={handleAddSubmit}
            schema={registerSchema}
          />
        </div>
      </div>
    );
  }

  // render edit customer form component
  if (view === "edit" && editTarget) {
    return (
      <div className="min-h-screen">
        <div>
          <GenericForm<Customer>
            title="Edit Customer"
            fields={customerFields}
            initial={editTarget}
            defaultImage={user}
            onBack={() => {
              setEditTarget(null);
              setView("table");
            }}
            onSubmit={handleEditSubmit}
            schema={registerSchema}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h1 className="text-xl font-bold text-gray-800">Customers</h1>

        <button
          onClick={() => setView("add")}
          className="bg-orange hover:bg-dark-orange cursor-pointer rounded-lg px-5 py-3 text-sm font-semibold text-white shadow transition-all duration-150 active:scale-95"
        >
          + Add Customer
        </button>
      </div>

      <div className="mx-6 mb-6 min-h-100 rounded-lg border border-gray-300 bg-white">
        {/* Tab switcher */}
        <div className="flex gap-1 border-b border-gray-100 px-6 pt-4">
          <button
            onClick={() => setActiveTab("userList")}
            className={`-mb-px cursor-pointer border-b-2 px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "userList"
                ? "border-orange text-orange"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            User List
          </button>

          <button
            onClick={() => setActiveTab("walletHistory")}
            className={`-mb-px cursor-pointer border-b-2 px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "walletHistory"
                ? "border-orange text-orange"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Wallet History
          </button>
        </div>

        {/* users table data */}
        {activeTab === "userList" && (
          <div className="p-6">
            <div className="mb-5 flex justify-end">
              <div className="border-orange flex w-65 items-center gap-2 overflow-hidden rounded-full border bg-white px-3 py-1.5">
                <input
                  type="text"
                  id="search-users"
                  name="search-users"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                />
                {userSearch && (
                  <button
                    onClick={() => setUserSearch("")}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    <IoClose size={20} />
                  </button>
                )}
                <IoSearch className="text-orange cursor-pointer" size={20} />
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : (
              <DataTable
                columns={customerColumns}
                data={filteredUsers}
                customStyles={customStyles}
                pagination
                paginationPerPage={10}
                highlightOnHover
                responsive
                noDataComponent={
                  <div className="py-12 text-sm font-semibold text-gray-400">
                    No customers found.
                  </div>
                }
              />
            )}
          </div>
        )}

        {/* wallet history component */}
        {activeTab === "walletHistory" && (
          <div className="p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              {/* download button */}
              <button className="bg-orange hover:bg-dark-orange cursor-pointer rounded-lg px-5 py-2 text-sm font-semibold text-white shadow transition active:scale-95">
                Download Excel
              </button>

              {/* search field */}
              <div className="border-orange flex w-65 items-center gap-2 overflow-hidden rounded-full border bg-white px-3 py-1.5">
                <input
                  type="text"
                  name="search-wallet"
                  id="search-wallet"
                  placeholder="Search users..."
                  value={walletSearch}
                  onChange={(e) => setWalletSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                />
                {walletSearch && (
                  <button
                    onClick={() => setWalletSearch("")}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    <IoClose size={20} />
                  </button>
                )}
                <IoSearch className="text-orange cursor-pointer" size={20} />
              </div>
            </div>

            <DataTable
              columns={walletColumns}
              data={filteredWallet}
              customStyles={customStyles}
              pagination
              paginationPerPage={10}
              highlightOnHover
              responsive
              noDataComponent={
                <div className="py-12 text-sm font-semibold text-gray-400">
                  No wallet history found.
                </div>
              }
            />
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          entityName={deleteTarget.name}
          entityLabel="Customer"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
