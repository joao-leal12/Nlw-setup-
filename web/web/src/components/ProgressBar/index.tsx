interface IProgressBarProps { 

    progress?:number
    
}

export const ProgressBar = ({progress = 0 } : IProgressBarProps) => {
  return (
    <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
        <div
        className="h-3 rounde-xl bg-violet-600 transition-all"
        role="progressbar"
        aria-label="Progresso de Hábitos completados nesse dia "
        aria-valuenow={progress}
        style={{width: `${progress}%`}}

        />
    </div>
  )
}
