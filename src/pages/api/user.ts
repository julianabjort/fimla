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
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
      } catch (error) {
        res
          .status(500)
          .json({ error: "Error deleting from database", success: false });
      }
    case "PUT":
      try {
        const updateUser = await prisma.user.update({
          where: {
            email: body.email,
          },
          data: {
            name: body.name,
          },
        });
        return res.status(200).json(updateUser);
      } catch (error) {
        res
          .status(500)
          .json({ error: "Error updating in database", success: false });
      }
    case "DELETE":
      try {
        const deleteUser = await prisma.user.delete({
          where: {
            email: body,
          },
        });
        return res.status(200).json(deleteUser);
      } catch (error) {
        res
          .status(500)
          .json({ error: "Error deleting from database", success: false });
      }
      break;
    default:
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }
}
