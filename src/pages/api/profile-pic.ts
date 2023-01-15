import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const { method, body } = req;

  switch(method){
  case "PUT":
    
  try {
    const updateUser = await prisma.user.update({
      where: {
        email: body.userEmail,
      },
      data: {
        image: body.imageSrc,
      },
    });

    return res.status(200).json(updateUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating in database", success: false });
  } break;
  default:
    res.status(405).json({ message: `Method ${method} Not Allowed` });
    break;
}
}
