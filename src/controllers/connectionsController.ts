import { Request, Response } from 'express'

import db from '../database/connection'

class ConnectionsController {
  async index (req: Request, res: Response) {
    try {
      const totalConnections = await db('connections').count('* as total')
      const total = totalConnections[0]
  
      return res.status(200).json({ total })
    } catch (error) {
      return res.status(500).json({
        error: 'Unexpected error while getting connections total'
      })
    }
  }

  async create (req: Request, res: Response) {
    const {
      user_id,
    } = req.body
  
    const trx = await db.transaction()
  
    try {
      await trx('connections').insert({
        user_id
      })
  
      await trx.commit()
  
      return res.status(201).send()
    } catch (error) {
      console.log(error)
      trx.rollback()
  
      return res.status(500).json({
        error: 'Unexpected error while creating new connection'
      })
    } 
  }
}

export default ConnectionsController
