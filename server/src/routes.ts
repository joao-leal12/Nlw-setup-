
import {prisma} from './lib/prisma'
import { FastifyInstance } from 'fastify'
import {z} from 'zod'
import dayjs from 'dayjs'
import { Diamond } from 'phosphor-react'

export async function appRoutes(app : FastifyInstance) {
    const createHabitBody  = z.object({ 

        title: z.string(), 
        weekDays: z.array(  
            z.number().min(0).max(6)
            )
    })


    app.post('/habits', async (req, res) => { 
        
       const {title , weekDays}  = createHabitBody.parse(req.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({ 
            data: { 
                
                title, 
                created_at: today,
                weekDays: {
                    
                    create: weekDays.map(weekDay =>  { 

                        return { 
                            week_day: weekDay
                        }
                    })
                    
                    }
            }
        })

 
        return res.statusCode

    })


    app.get('/day', async (req) => { 

        const getDayParams = z.object({

            date: z.coerce.date() 
            //Coerce converte em date, será mandado como uma string, e convertido em data.  
        })


        const {date} = getDayParams.parse(req.query)
        const parsedDate = dayjs(date).startOf('day') //Configurando as datas para receber o inicio do dia 

        const weekDay = parsedDate.get("day") 
        //Pegando o dia somente do weekDay 
        
        //Retornar todos os hábitos possiveis daquele dia que foi marcado 
        //Hábitos que já foram completados  
        const possibleHabits = await prisma.habit.findMany({ 

            where: { 
                created_at: { 
                    lte: date, 
                },

                weekDays: { 
                    some: { 
                        week_day:weekDay
                    }

                }
            }

        })


        const day = await prisma.day.findUnique({
            where:  {

                date: parsedDate.toDate(), 
            }, 
            include :{ 

                dayHabits: true 
            }
        })


        const completedHabits = day?.dayHabits.map(dayHabit => { 

            return dayHabit.habit_id
        })

        return { 
            possibleHabits, 
            completedHabits
        }
    })

    // Completar e não completar um hábito

    app.patch('/habits/:id/toggle', async (req) => { 

        const toggleHabitParams = z.object({
            id: z.string().uuid()
        })

      const {id} = toggleHabitParams.parse(req.params)
  
        const today = dayjs().startOf('day').toDate() // Pegar o dia, descartando horas, minutos e segundos, para não atrapalhar depois, ao fazer comparação de data 


        let day = await prisma.day.findUnique({ 

            where: { 
                date: today 
            }

        })


        if(!day){ 
            day = await prisma.day.create({
                data: { 

                    date: today 
                }

            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({ 
             where: { 
                day_id_habit_id: { 
                    day_id: day.id,
                    habit_id: id 
                }
             }
        })

        if(dayHabit){ 

            await prisma.dayHabit.delete({ 

                where: { 
                    id: dayHabit.id 
                }
            })
        }else { 

            await prisma.dayHabit.create({ 
               data: { 
                    
                    day_id: day.id, 
                    habit_id: id
                }
    
            })
        }

    })
    

    app.get('/summary', async (req) => { 
        
        const summary = await prisma.$queryRaw`

            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                        cast(count(*) as float )
                    FROM day_habits DH
                    WHERE DH.day_id  = D.id 
                ) as completed, 
                (
                    SELECT cast(count(*) as float ) 
                    FROM habit_week_days HWD 
                    JOIN habits H
                    ON H.id = HWD.habit_id
                    WHERE 
                        HWD.week_day = cast( strftime('%W', D.date/1000.0, 'unixepoch') as int ) 
                        AND H.created_at <= D.date 

                ) as amount 
            FROM days D 
        `

        return summary
    })
}