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
        const tournaments = await prisma.usersInTournament.findMany();
        return res.status(200).json(tournaments);
      } catch (error) {
        res.status(500).json({ error: "Error fetching user stats" });
      }
    case "POST":
      try {
        const tournament = await prisma.usersInTournament.create({
          data: {
            userEmail: body.userEmail,
            userName: body.userName,
            tournamentId: body.tournamentId,
            tournamentName: body.tournamentName,
          },
        });
        return res.status(200).json(tournament);
      } catch (error) {
        res.status(500).json({ error: "Error posting stats to database" });
      }
    case "PUT":
      try {
        const tournament = await prisma.usersInTournament.update({
          where: {
            userEmail_tournamentId: {
              userEmail: body.userEmail,
              tournamentId: body.tournamentId,
            },
          },
          data: {
            totalScore: body.totalScore,
            gamesPlayed: body.gamesPlayed,
          },
        });
        return res.status(200).json(tournament);
      } catch (error) {
        res.status(500).json({ error: "Error posting stats to database" });
      }
    case "DELETE":
      try {
        const deleteTournament = await prisma.tournaments.delete({
          where: {
            id: body.id,
          },
        });
        return res.status(200).json(deleteTournament);
      } catch (error) {
        res.status(500).json({ error: "Error deleting stats from the DB" });
      }
      break;
    default:
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}
