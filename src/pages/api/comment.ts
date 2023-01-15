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
        const comments = await prisma.comment.findMany();
        return res.status(200).json(comments);
      } catch (error) {
        res.status(500).json({ error: "Error fetching user stats" });
      }
    case "POST":
      try {
        const comment = await prisma.comment.create({
          data: {
            text: body.comment,
            userName: body.userName,
            tournamentId: body.tournamentId,
            userEmail: body.userEmail,
          },
        });
        return res.status(200).json(comment);
      } catch (error) {
        res.status(500).json({ error: "Error creating tournament" });
      }
    case "DELETE":
      try {
        const deleteComment = await prisma.comment.delete({
          where: {
            id: body.id,
          },
        });
        return res.status(200).json(deleteComment);
      } catch (error) {
        res.status(500).json({ error: "Error deleting comment from the DB" });
      }
      break;
    default:
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}
