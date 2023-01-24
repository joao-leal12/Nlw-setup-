import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'
import { IHabitsPossible } from '../HabitsList'
import { api } from '../../lib/axios'


interface ICheck{ 

    title?: string 
    habits: IHabitsPossible
    habitId: string
    possibleDate : boolean; 
    setHabits : (value : IHabitsPossible ) => void
  }

  
  export const CheckBox = ({title, habits, habitId= '', possibleDate = false, setHabits } : ICheck ) => {
 async  function handleToggleHabit(habitId : string) { 
  //Problema aqui no completedhabist, pois ele pode ser undefined 
    await api.patch(`/habits/${habitId}/toggle`)

    const isHabitAlreadyCompleted = habits!.completedHabist?.includes(habitId)

    let completedHabist: string[] =  []; 
    
    if(isHabitAlreadyCompleted){ 

      completedHabist = habits!.completedHabist.filter(id => id  !== habitId)
    }else{
      completedHabist = [...habits?.completedHabist, habitId]
      
    }
    setHabits({ 
      possibleHabits: habits!.possibleHabits, 
      completedHabist, 
    })
  
  }
  

 
  return (
    <>
    {habits && 
        <Checkbox.Root 
          className="flex items-center gap-3 group"
          checked={habits!.completedHabist?.includes(habitId)}
          disabled={possibleDate}
          onCheckedChange={() => handleToggleHabit(habitId)}
      >   
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
              <Checkbox.Indicator> 
                  <Check size={20} className="text-white"/> 
              </Checkbox.Indicator> 
          </div>

            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                {title}
            </span>
        </Checkbox.Root>
      }
    </>
  )
}
