import {FormEvent, useState} from 'react'
import { Check } from "phosphor-react"
import * as Checkbox from '@radix-ui/react-checkbox'
import { api } from '../../lib/axios'
const availableWeekDays = ['Segunda', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabádo']

export const NewHabitForm = () => {

  const [title, setTitle] = useState(''); 
  const [weekDays, setWeekDays ] = useState<number[]>([])   

  function createNewHabit(e : FormEvent) { 
    e.preventDefault(); 

    if(!title || weekDays.length == 0) return 

    api.post('habits', { 
      title, 
      weekDays
    }).then(() => alert('Hábito criado com sucesso'))

    setTitle(''); 
    setWeekDays([])
  }

  function handleToggleWeekDay(weekDay: number){ 
    if(weekDays.includes(weekDay)){ 
      const weekDayWithRemovedOne = weekDays.filter(day => day !== weekDay); 
      setWeekDays(weekDayWithRemovedOne)
    }else { 
      setWeekDays([...weekDays, weekDay])
    }

  }

  return (
    <form className="w-full flex flex-col mt-6" onSubmit={createNewHabit}>
        <label htmlFor="title" className="font-semibold leading-tight">
            Qual seu comprometimento? 
        </label>

        <input 
        type="text" 
        id="title"
        placeholder="ex. Exercicios, dormir bem, etc... "
        autoFocus 
        className=" p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-900 focus:ring-offset-2 focus:ring-offset-zinc-900"
        value={title}
        onChange={e => setTitle(e.target.value)} 
        /> 


        <label className="font-semibold leading-tight mt-4" >
            Qual a recorrencia? 
        </label>
         

        <div className="flex flex-col gap-2 mt-3">
          {availableWeekDays.map((weekDay, i) => ( 

               
                <Checkbox.Root 
                  className="flex items-center gap-3 group focus:outline-none"
                  onCheckedChange={() => handleToggleWeekDay(i)}
                  checked={weekDays.includes(i)}
                  key={`${weekDay}-${i}`}
                > 
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-900 group-focus:ring-offset-2 group-focus:ring-offset-bgHabit">
                      <Checkbox.Indicator> 
                          <Check size={20} className="text-white"/> 
                      </Checkbox.Indicator> 
                  </div>

                    <span className=" text-white leading-tight">
                        {weekDay}
                    </span>
                </Checkbox.Root>


          ) )}
      </div>

        <button 
        type="submit" 
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
           <Check 
           size={20}
           weight="bold"
           />
           Confirmar.. 
        </button>
    </form>
  )
}
