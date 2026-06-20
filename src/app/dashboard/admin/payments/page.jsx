"use client";

import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };
    const token = getCookie("better-auth.session_token") || getCookie("__Secure-better-auth.session_token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load payments");
        return res.json();
      })
      .then((data) => {
        setPayments(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">Loading Transactions...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-6 bg-zinc-950 min-h-screen text-white">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Transaction History</h1>
        <p className="text-zinc-400 mt-1">
          Review premium founder payments, license details, and transaction IDs from Stripe Checkout.
        </p>
      </div>

      <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-zinc-800 text-sm">
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">User Email</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">Stripe Session ID / Txn ID</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">Amount Paid (USD)</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">Date Paid</th>
              <th className="py-4 px-6 bg-zinc-800/50 text-zinc-300 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-zinc-500">
                  No transactions recorded yet.
                </td>
              </tr>
            ) : (
              payments.map((pay) => {
                const payId = pay._id?.$oid || pay._id;
                return (
                  <tr key={payId} className="border-b border-zinc-850 hover:bg-zinc-800/20 transition-colors text-sm">
                    <td className="py-4 px-6 font-semibold text-zinc-200">{pay.user_email}</td>
                    <td className="py-4 px-6 font-mono text-zinc-400 text-xs truncate max-w-xs" title={pay.transaction_id}>
                      {pay.transaction_id}
                    </td>
                    <td className="py-4 px-6 text-zinc-200 font-bold">${pay.amount?.toFixed(2)}</td>
                    <td className="py-4 px-6 text-zinc-400 text-xs">{formatDate(pay.paid_at)}</td>
                    <td className="py-4 px-6">
                      <Chip size="sm" variant="flat" color="success" className="font-bold">
                        {pay.payment_status || "Paid"}
                      </Chip>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
