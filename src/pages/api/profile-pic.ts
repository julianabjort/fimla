import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    return await updateUser(req, res);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const updateUser = await prisma.user.update({
      where: {
        email: body.userEmail,
      },
      data: {
        image: body.imageSrc,
      },
    });
    console.log(updateUser);
    return res.status(200).json(updateUser);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error updating in database", success: false });
  }
}
