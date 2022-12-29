import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
if(req.method === 'GET') {
  console.log("Reading")
  return await ReadingQuordleStats(req, res)
} else if(req.method === 'POST'){
  console.log("Posting")
  return await CreatingQuordleStats(req, res)
} else if(req.method === 'PUT'){
  console.log("Updating") 
  return await UpdateQuordleStats(req, res)
} else if(req.method === 'DELETE'){
  console.log("Deleting")
  return await DeleteQuordleStats(req, res)
} else {
  return res.status(405).json({message: "Method not allowed"})
}
}

async function ReadingQuordleStats(req:NextApiRequest, res:NextApiResponse){
  try{
    const stats = await prisma.quordleStats.findMany()
    console.log("Quordle Stats: ", stats)
    return res.status(200).json(stats)
  } catch(error){
    res.status(500).json({error:"Error fetching user stats"})
  }
}

async function CreatingQuordleStats(req:NextApiRequest, res:NextApiResponse) {
  const body = req.body;
  try{
    const stats = await prisma.quordleStats.create({
      data:{
        userEmail: body.user,
        wins: body.wins,
        losses: body.losses,
        totalScore: body.totalScore
      }
    })
    return res.status(200).json(stats)
  }catch(error){
    console.log(error)
    res.status(500).json({error:"Error posting stats to database"})
  }
}

async function UpdateQuordleStats(req:NextApiRequest, res:NextApiResponse){
  const body = req.body;
  try{
    const stats = await prisma.quordleStats.update({
      where: {userEmail: body.user},
      data: {
        wins: body.wins,
        losses: body.losses,
        totalScore: body.totalScore
      }
    })
    return res.status(200).json(stats)
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"Error updating stats"})
  }
}

async function DeleteQuordleStats(req: NextApiRequest, res: NextApiResponse){
  const body = req.body;
  try{
    const deleteStats = await prisma.quordleStats.delete({
      where: {
        userEmail: body
      }
    })
    console.log(deleteStats)
    return res.status(200).json(deleteStats);
  } catch(error) {
    console.log(error)
    res.status(500).json({error: "Error deleting stats from the DB"})
  }
}