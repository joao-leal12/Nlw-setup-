import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '.'


describe('Header', () => { 

    it('should render correctly',  () => { 

        render(<Header/>)

        
        expect(screen.getByTitle('Logo')).toBeInTheDocument(); 
        expect(screen.getByText('Novo Habito')).toBeInTheDocument()
    })

    it('should open component correctly on click',  async () => { 

        render(<Header/>)

        const buttonNewHabit = screen.getByText('Novo Habito')
        screen.debug()
         await userEvent.click(buttonNewHabit); 
        screen.debug()
        expect( await screen.findByText('Criar Hábito')).toBeInTheDocument(); 
       
    })

})