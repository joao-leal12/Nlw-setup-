
import { useEffect, useState} from "react"
import { api } from "../../lib/axios"
import { CheckBox } from "../CheckBox"
interface IHabisList {
    date : Date 
}



interface IHabitsPossible{ 
    possibleHabits: Array<{ 

        id: string;
        title: string 
        created_at: string 
    
    }>
    completedHabist : string[]

}
export const HabitsList = ({date} : IHabisList ) => {
    const [habitsPossible , setHabitsPossible ] = useState<IHabitsPossible | null>(null)
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
                <CheckBox key={habit.id} title={habit.title}/>
            )}
            
        </div>
    )
}
