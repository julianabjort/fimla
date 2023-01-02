import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    return await readUsers(req, res);
  } else if (req.method === "DELETE") {
    return await deleteUser(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
async function readUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany();
    console.log("All Users: ", users);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error deleting from database", success: false });
  }
}
async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        email: body,
      },
    });
    console.log(deleteUser);
    return res.status(200).json(deleteUser);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error deleting from database", success: false });
  }
}
