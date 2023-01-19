
import {prisma} from './lib/prisma'
import { FastifyInstance } from 'fastify'
import {z} from 'zod'
import dayjs from 'dayjs'

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
    
}