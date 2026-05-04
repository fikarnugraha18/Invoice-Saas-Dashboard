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

  function getToken() {
    return localStorage.getItem("token");
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

  async function fetchInvoices() {
    const token = getToken();

    const res = await fetch("/api/invoices", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    setInvoices(data);
  }

  async function createInvoice() {
    if (!title || !total) return;

    const token = getToken();

    await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        total: Number(total),
      }),
    });

    setTitle("");
    setTotal("");
    fetchInvoices();
    showToast("Invoice created");
  }

  async function deleteInvoice(id: number) {
    const token = getToken();

    const res = await fetch("/api/invoices", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
    const token = getToken();

    await fetch("/api/invoices", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
        status: current === "PAID" ? "UNPAID" : "PAID",
      }),
    });

    fetchInvoices();
    showToast("Updated");
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  useEffect(() => {
    const token = getToken();

    if (!token) {
      window.location.href = "/login";
    } else {
      fetchInvoices();
    }
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

      {toast && (
        <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      <div className="hidden md:flex flex-col w-64 bg-black text-white p-6">
        <h1 className="text-xl font-bold mb-8">Finvo</h1>
        <p className="text-gray-300">Dashboard</p>
      </div>

      <div className="flex-1 p-4 md:p-10">

        <div className="flex justify-between items-center mb-6">
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
            className="bg-black text-white px-4 py-3 rounded"
          >
            Add
          </button>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="bg-white p-4 rounded shadow text-center text-gray-500">
            No data found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between"
              >
                <div>
                  <p className="font-semibold">{inv.title}</p>
                  <p className="text-gray-500 text-sm">
                    Rp{" "}
                    {Number(inv.total).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex gap-2">
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