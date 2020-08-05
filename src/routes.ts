import express from 'express'

import db from './database/connection'
import convertHourToMinutes from './utils/convertHourToMinutes'

const routes = express.Router()

interface ScheduleItem {
  week_day: number,
  from: string,
  to: string
}

routes.post('/classes', async (req, res) => {
  const {
    name,
    avatar,
    bio,
    whatsapp,
    subject,
    cost,
    schedule
  } = req.body

  const trx = await db.transaction()

  try {
    const insertedUsersIds = await trx('users').insert({
      name,
      avatar,
      bio,
      whatsapp
    })

    const user_id = insertedUsersIds[0]

    const insertedClassesIds = await trx('classes').insert({
      subject,
      cost,
      user_id
    })

    const class_id = insertedClassesIds[0]

    const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
      return {
        week_day: scheduleItem.week_day,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to),
        class_id
      }
    })

    await trx('class_schedule').insert(classSchedule)

    await trx.commit()

    return res.status(201).send()
  } catch (error) {
    console.log(error)
    trx.rollback()

    return res.status(500).json({
      error: 'Unexpected error while creating new class'
    })
  } 
})

export default routes
