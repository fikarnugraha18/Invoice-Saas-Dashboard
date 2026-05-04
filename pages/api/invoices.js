import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export default async function handler(req, res) {
  let userId;

  try {
    userId = getUserId(req);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(invoices);
  }

  if (req.method === "POST") {
    const { title, total } = req.body;

    const invoice = await prisma.invoice.create({
      data: {
        title,
        total: Number(total),
        status: "UNPAID",
        userId: userId,
      },
    });

    return res.json(invoice);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      await prisma.invoice.delete({
        where: {
          id,
          userId,
        },
      });

      return res.json({ message: "deleted" });
    } catch (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  if (req.method === "PUT") {
    const { id, status } = req.body;

    try {
      const updated = await prisma.invoice.update({
        where: {
          id,
          userId,
        },
        data: { status },
      });

      return res.json(updated);
    } catch (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}