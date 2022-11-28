import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    return await readUserInfo(req, res)
  } else if(req.method === 'POST') {
    return await createUserStats(req, res)
  } else if(req.method === 'PUT'){
    return await updateUserStats(req, res)
  } else {
    return res.status(405).json({message: "Method not allowed"})
  }
}

async function readUserInfo(req: NextApiRequest, res: NextApiResponse) {
  try{
    const userInfo = await prisma.userInfo.findMany()
    console.log(userInfo)
    return res.status(200).json(userInfo)
  }catch(error){
    console.log(error)
    res.status(500).json({error: "Error reading from the userinfo database", success: false})
  }
}

async function createUserStats(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try{
    const newUsername = await prisma.userInfo.create({
      data:{
        userEmail: body.user,
        username: body.username,
        score: body.score
      }
    })
    console.log(newUsername)
    return res.status(200).json(newUsername)
  }catch(error){
    console.log(error)
    res.status(500).json({error: "Error posting to database", success: false})
  }
}

async function updateUserStats(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try{
    const updateStats = await prisma.userInfo.update({
      where: {id: body.id},
      data: {
        username: body.username,
        score: body.score
      }
    })
    console.log(updateStats)
    return res.status(200).json(updateStats);
  } catch (error){
    console.log(error)
    res.status(500).json({error: "Error deleting from database", success: false})
  }
}