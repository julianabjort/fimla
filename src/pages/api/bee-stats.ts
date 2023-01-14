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
        const stats = await prisma.spellingBeeStats.findMany();
        return res.status(200).json(stats);
      } catch (error) {
        res.status(500).json({ error: "Error fetching user stats" });
      }
    case "POST":
      try {
        const stats = await prisma.spellingBeeStats.create({
          data: {
            userEmail: body.user,
            totalScore: body.totalScore,
          },
        });
        return res.status(200).json(stats);
      } catch (error) {
        res.status(500).json({ error: "Error posting stats to database" });
      }
    case "PUT":
      try {
        const stats = await prisma.spellingBeeStats.update({
          where: { userEmail: body.user },
          data: {
            totalScore: body.totalScore,
          },
        });
        return res.status(200).json(stats);
      } catch (error) {
        res.status(500).json({ error: "Error updating stats" });
      }
    case "DELETE":
      try {
        const deleteStats = await prisma.spellingBeeStats.delete({
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
