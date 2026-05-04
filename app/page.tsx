"use client";

import { useEffect, useMemo, useState } from "react";

type Invoice = {
  id: number;
  title: string;
  total: number | string;
  status: "PAID" | "UNPAID";
};

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PAID" | "UNPAID">("ALL");

  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

  async function fetchInvoices() {
    const res = await fetch("/api/invoices");

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    setInvoices(data);
  }

  async function createInvoice() {
    if (!title || !total) return;

    await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, total: Number(total) }),
    });

    setTitle("");
    setTotal("");
    fetchInvoices();
    showToast("Invoice created");
  }

  async function deleteInvoice(id: number) {
    const res = await fetch("/api/invoices", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const data = await res.json();
      showToast(data.message);
      return;
    }

    fetchInvoices();
    showToast("Deleted");
  }

  async function toggleStatus(
    id: number,
    current: "PAID" | "UNPAID"
  ) {
    await fetch("/api/invoices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: current === "PAID" ? "UNPAID" : "PAID",
      }),
    });

    fetchInvoices();
    showToast("Updated");
  }

  function logout() {
    document.cookie = "token=; Max-Age=0; path=/";
    window.location.href = "/login";
  }

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch = inv.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchFilter =
        filter === "ALL" || inv.status === filter;

      return matchSearch && matchFilter;
    });
  }, [invoices, search, filter]);

  const totalRevenue = invoices.reduce(
    (sum, i) => sum + Number(i.total),
    0
  );

  const paidRevenue = invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + Number(i.total), 0);

  const unpaidRevenue = invoices
    .filter((i) => i.status === "UNPAID")
    .reduce((sum, i) => sum + Number(i.total), 0);

  const paidPercent =
    totalRevenue === 0
      ? 0
      : (paidRevenue / totalRevenue) * 100;

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition ${
          sidebarOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-40"
          onClick={() => setSidebarOpen(false)}
        />

        <div
          className={`absolute left-0 top-0 h-full w-64 bg-black text-white p-6 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="mb-6 text-white"
          >
            ✖ Close
          </button>

          <h1 className="text-xl font-bold">Finvo</h1>
        </div>
      </div>

      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:flex flex-col w-64 bg-black text-white p-6">
        <h1 className="text-xl font-bold mb-8">Finvo</h1>
        <p className="text-gray-300">Dashboard</p>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h1 className="text-xl md:text-2xl font-bold">
            Dashboard
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Revenue Overview
          </p>

          <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${paidPercent}%` }}
            />
          </div>

          <div className="flex justify-between mt-2 text-sm">
            <span>
              Paid: Rp {paidRevenue.toLocaleString("id-ID")}
            </span>
            <span>
              Unpaid: Rp {unpaidRevenue.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            className="border p-3 rounded w-full"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-3 rounded"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "ALL" | "PAID" | "UNPAID")
            }
          >
            <option value="ALL">All</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </div>

        {/* FORM */}
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-2">
          <input
            className="border p-3 rounded w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            inputMode="numeric"
            className="border p-3 rounded md:w-40"
            placeholder="Total"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />

          <button
            onClick={createInvoice}
            className="bg-black text-white px-4 py-3 rounded hover:scale-105 transition"
          >
            Add
          </button>
        </div>

        {/* LIST */}
        {filteredInvoices.length === 0 ? (
          <div className="bg-white p-4 rounded shadow text-center text-gray-500">
            No data found.
          </div>
        ) : (
          <div className="space-y-4 md:space-y-3">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:justify-between hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold">{inv.title}</p>
                  <p className="text-gray-500 text-sm">
                    Rp{" "}
                    {Number(inv.total).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    onClick={() =>
                      toggleStatus(inv.id, inv.status)
                    }
                    className={`px-3 py-2 rounded text-sm ${
                      inv.status === "PAID"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {inv.status}
                  </button>

                  {inv.status !== "PAID" && (
                    <button
                      onClick={() =>
                        deleteInvoice(inv.id)
                      }
                      className="px-3 py-2 bg-gray-200 rounded text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}