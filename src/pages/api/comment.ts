import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    console.log("Reading");
    return await ReadTournaments(req, res);
  } else if (req.method === "POST") {
    console.log("Posting");
    return await CreateTournament(req, res);
  } else if (req.method === "DELETE") {
    console.log("Deleting");
    return await DeleteTournament(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function ReadTournaments(req: NextApiRequest, res: NextApiResponse) {
  try {
    const comments = await prisma.comment.findMany();
    return res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user stats" });
  }
}

async function CreateTournament(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const comment = await prisma.comment.create({
      data: {
        text: body.comment,
        userName: body.userName,
        tournamentId: body.tournamentID,
        userId: body.userID,
      },
    });
    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating tournament" });
  }
}

async function DeleteTournament(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const deleteComment = await prisma.comment.delete({
      where: {
        id: body.id,
      },
    });
    console.log(deleteComment);
    return res.status(200).json(deleteComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting comment from the DB" });
  }
}
