
import dayjs from "dayjs"
import { useEffect, useState} from "react"
import { api } from "../../lib/axios"
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from "phosphor-react"

interface IHabisList {
    date : Date 
    onCompletedChanges: (completed : number) => void 
}



export interface IHabitsPossible{ 
    possibleHabits: Array<{  
        id: string;
        title: string;
        created_at: string;  
    }>
    completedHabits: string[]
}
export const HabitsList = ({date, onCompletedChanges} : IHabisList ) => {
    const [habitsPossible , setHabitsPossible ] = useState<IHabitsPossible>()
    const isDateIsPast = dayjs(date).endOf('day').isBefore(new Date())


    async  function handleToggleHabit(habitId : string) { 
        //Problema aqui no completedhabist, pois ele pode ser undefined 
          await api.patch(`/habits/${habitId}/toggle`)
      
          const isHabitAlreadyCompleted = habitsPossible!.completedHabits?.includes(habitId)
      
          let completedHabits: string[] =  []; 
          
          if(isHabitAlreadyCompleted){ 
            completedHabits = habitsPossible!.completedHabits.filter(id => id  !== habitId)
          }else{
            completedHabits = [...habitsPossible!.completedHabits, habitId]
          }
          setHabitsPossible({ 
            possibleHabits: habitsPossible!.possibleHabits, 
            completedHabits, 
          })
        

          onCompletedChanges(completedHabits.length)

        }


    useEffect(() => { 
       api.get('/day', { 
        params: { 
            date: date.toISOString()
        }
       }).then(response => setHabitsPossible(response.data))
    }, [])
    
    

    return (
        <div className="mt-3 flex flex-col gap-3">
            {habitsPossible?.possibleHabits.map((habit) =>
               <Checkbox.Root 
               className="flex items-center gap-3 group"
               checked={habitsPossible?.completedHabits?.includes(habit.id)}
               disabled={isDateIsPast}
               onCheckedChange={() => handleToggleHabit(habit.id)}
               key={habit.id}
           >   
               <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
                   <Checkbox.Indicator> 
                       <Check size={20} className="text-white"/> 
                   </Checkbox.Indicator> 
               </div>
     
                 <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                     {habit.title}
                 </span>
             </Checkbox.Root>
            
          
          )}
            
        </div>
    )
}
