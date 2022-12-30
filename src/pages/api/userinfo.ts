import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return await readUserInfo(req, res);
  } else if (req.method === "POST") {
    return await addUserInfo(req, res);
  } else if (req.method === "PUT") {
    return await updateUserInfo(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
async function readUserInfo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userInfo = await prisma.userInfo.findMany();
    console.log("Wordle Stats: ", userInfo);
    return res.status(200).json(userInfo);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error reading from database", success: false });
  }
}
async function addUserInfo(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const userInfo = await prisma.userInfo.create({
      data: {
        userId: body.userId,
        username: body.userName,
        userDob: body.userDob,
        userLocation: body.userLocation,
      },
    });
    console.log(userInfo);
    return res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error adding to database", success: false });
  }
}

async function updateUserInfo(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const userInfo = await prisma.userInfo.update({
      where: {
        userId: body.userId,
      },
      data: {
        username: body.userName,
        userDob: body.userDob,
        userLocation: body.userLocation,
      },
    });
    console.log(userInfo);
    return res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error adding to database", success: false });
  }
}
