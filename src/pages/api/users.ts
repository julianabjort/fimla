import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import account from '../user/account'
import { userAgent } from 'next/server'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    return await findUser(req, res)
  } else if(req.method === 'POST') {
    console.log("POSTING")  
  } else {
    return res.status(405).json({message: "Method not allowed"})
  }
}

async function findUser(req: NextApiRequest, res: NextApiResponse) {
  // const email = req.body
  try{
    const users = await prisma.user.findMany()
    console.log(users)
    return res.status(200).json(users)
  }catch(error){
    console.log(error)
    res.status(500).json({error: "Error reading from the database", success: false})
  }
}

