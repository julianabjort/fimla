import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    console.log("Reading");
    return await ReadingWordleStats(req, res);
  } else if (req.method === "POST") {
    console.log("Posting");
    return await CreatingWordleStats(req, res);
  } else if (req.method === "PUT") {
    console.log("Updating");
    return await UpdateWordleStats(req, res);
  } else if (req.method === "DELETE") {
    console.log("Deleting");
    return await DeleteWordleStats(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function ReadingWordleStats(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stats = await prisma.wordleStats.findMany();
    console.log("Wordle Stats: ", stats);
    return res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user stats" });
  }
}

async function CreatingWordleStats(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const stats = await prisma.wordleStats.create({
      data: {
        userEmail: body.user,
        wins: body.wins,
        losses: body.losses,
        totalScore: body.totalScore,
      },
    });
    return res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error posting stats to database" });
  }
}

async function UpdateWordleStats(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const stats = await prisma.wordleStats.update({
      where: { userEmail: body.user },
      data: {
        wins: body.wins,
        losses: body.losses,
        totalScore: body.totalScore,
      },
    });
    return res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating stats" });
  }
}

async function DeleteWordleStats(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const deleteStats = await prisma.wordleStats.delete({
      where: {
        userEmail: body,
      },
    });
    console.log(deleteStats);
    return res.status(200).json(deleteStats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting stats from the DB" });
  }
}
