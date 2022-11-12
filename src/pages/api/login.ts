// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default (_req: NextApiRequest, res: NextApiResponse): void => {
  res
    .status(200)
    .json({ id: 1, name: "John Doe", email: "johndoe@johndoe.com" });
};
