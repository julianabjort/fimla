import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    return await addUserName(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function addUserName(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const userName = await prisma.userInfo.update({
      where: { id: body.id },
      data: { username: body.userName, dob: body.dob, location: body.location },
    });
    console.log(userName);
    return res.status(200).json(userName);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error deleting from database", success: false });
  }
}
