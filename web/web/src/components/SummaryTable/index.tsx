import { HabitDay } from "../HabitDay"
import { generateDatesFromYearsBeginning } from "../../utils/generate-dates-from-years-beginning"
const weekDays = ['D','S','T','Q','Q','S','S']

const summaryDates = generateDatesFromYearsBeginning();

const minimunSummaryDatesSize = 18 * 7 
const amountOfDaysToFill = minimunSummaryDatesSize - summaryDates.length;  

export const SummaryTable = () => {
  return (
    <div className="w-full flex">
        <div className="grid grid-rows-7 grid-flow-row gap-3">
          {weekDays.map((weekDay, index ) => ( 

            <div 
            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center" key={`${weekDay}-${index}`}>
                
                {weekDay}
            
            </div>

          ))}
        </div>
        <div className="grid grid-rows-7 grid-flow-col gap-3"> 
           {summaryDates.map(summaryDate => <HabitDay key={summaryDate.toString()}/>)}

           {amountOfDaysToFill > 0 && Array.from({length: amountOfDaysToFill}).map((_, i) => { 
                return (
                <div 
                key={i} 
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed "/>
                )
           })}
        </div>
    </div>
  )  
}