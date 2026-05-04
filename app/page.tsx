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
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }

  async function fetchInvoices() {
    const res = await fetch("/api/invoices", {
      method: "GET",
      credentials: "include",
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

    await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        total: Number(total),
      }),
    });

    setTitle("");
    setTotal("");
    fetchInvoices();
    showToast("Created");
  }

  async function deleteInvoice(id: number) {
    await fetch("/api/invoices", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id }),
    });

    fetchInvoices();
    showToast("Deleted");
  }

  async function toggleStatus(
    id: number,
    current: "PAID" | "UNPAID"
  ) {
    await fetch("/api/invoices", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id,
        status: current === "PAID" ? "UNPAID" : "PAID",
      }),
    });

    fetchInvoices();
    showToast("Updated");
  }

  async function logout() {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login";
  }

  useEffect(() => {
    fetchInvoices();
  }, []);

  const totalRevenue = invoices.reduce(
    (sum, i) => sum + Number(i.total),
    0
  );

  return (
    <div className="p-6">
      {toast && <div>{toast}</div>}

      <h1 className="text-2xl font-bold mb-4">Finvo</h1>

      <button onClick={logout}>Logout</button>

      <div className="my-4">
        Revenue: {totalRevenue}
      </div>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Total"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
      />

      <button onClick={createInvoice}>Add</button>

      {invoices.map((inv) => (
        <div key={inv.id}>
          {inv.title} - {inv.total} - {inv.status}

          <button onClick={() => toggleStatus(inv.id, inv.status)}>
            Toggle
          </button>

          <button onClick={() => deleteInvoice(inv.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}