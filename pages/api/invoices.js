import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

function getUserId(req) {
  const cookie = req.headers.cookie;

  if (!cookie) return null;

  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // GET
  if (req.method === "GET") {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(invoices);
  }

  // CREATE
  if (req.method === "POST") {
    const { title, total } = req.body;

    if (!title || !total || isNaN(total)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    try {
      const invoice = await prisma.invoice.create({
        data: {
          title,
          total: Number(total),
          status: "UNPAID",
          userId,
        },
      });

      return res.json(invoice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // DELETE (PROFESSIONAL RULE)
  if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id },
      });

      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      if (invoice.status === "PAID") {
        return res.status(400).json({
          message: "Paid invoice cannot be deleted",
        });
      }

      await prisma.invoice.delete({
        where: { id },
      });

      return res.json({ message: "deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // UPDATE STATUS
  if (req.method === "PUT") {
    const { id, status } = req.body;

    try {
      const updated = await prisma.invoice.update({
        where: { id },
        data: { status },
      });

      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}