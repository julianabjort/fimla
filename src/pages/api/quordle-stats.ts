import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        const stats = await prisma.quordleStats.findMany();
        return res.status(200).json(stats);
      } catch (error) {
        res.status(500).json({ error: "Error fetching user stats" });
      }
    case "POST":
      try {
        const stats = await prisma.quordleStats.create({
          data: {
            userEmail: body.userEmail,
            wins: body.wins,
            losses: body.losses,
            totalScore: body.totalScore,
          },
        });
        return res.status(200).json(stats);
      } catch (error) {
        res.status(500).json({ error: "Error posting stats to database" });
      }
    case "PUT":
      try {
        const stats = await prisma.quordleStats.update({
          where: { userEmail: body.userEmail },
          data: {
            wins: body.wins,
            losses: body.losses,
            totalScore: body.totalScore,
          },
        });
        return res.status(200).json(stats);
      } catch (error) {
        res.status(500).json({ error: "Error updating stats" });
      }
    case "DELETE":
      try {
        const deleteStats = await prisma.quordleStats.delete({
          where: {
            userEmail: body,
          },
        });
        return res.status(200).json(deleteStats);
      } catch (error) {
        res.status(500).json({ error: "Error deleting stats from the DB" });
      }
      break;
    default:
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}
