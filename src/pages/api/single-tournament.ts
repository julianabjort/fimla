import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    console.log("Reading");
    return await ReadUsersInTournaments(req, res);
  } else if (req.method === "POST") {
    console.log("Posting");
    return await CreateUsersInTournament(req, res);
  } else if (req.method === "PUT") {
    console.log("Updating");
    return await UpdateUsersInTournament(req, res);
  } else if (req.method === "DELETE") {
    console.log("Deleting");
    return await DeleteTournament(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function ReadUsersInTournaments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const tournaments = await prisma.usersInTournament.findMany();
    console.log("Users in Tournaments: ", tournaments);
    return res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user stats" });
  }
}

async function CreateUsersInTournament(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  try {
    const tournament = await prisma.usersInTournament.create({
      data: {
        userEmail: body.userEmail,
        userName: body.userName,
        tournamentId: body.tournamentID,
        tournamentName: body.tournamentName,
      },
    });
    return res.status(200).json(tournament);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error posting stats to database" });
  }
}

async function UpdateUsersInTournament(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  try {
    const tournament = await prisma.usersInTournament.update({
      where: {
        userEmail_tournamentId: {
          userEmail: body.userEmail,
          tournamentId: body.tournamentID,
        },
      },
      data: {
        totalScore: body.totalScore,
        gamesPlayed: body.gamesPlayed,
      },
    });
    return res.status(200).json(tournament);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error posting stats to database" });
  }
}

async function DeleteTournament(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const deleteTournament = await prisma.tournaments.delete({
      where: {
        id: body.id,
      },
    });
    console.log(deleteTournament);
    return res.status(200).json(deleteTournament);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting stats from the DB" });
  }
}
