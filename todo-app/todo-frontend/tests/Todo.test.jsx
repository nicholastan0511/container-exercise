import { render, screen } from '@testing-library/react' 
import Todo from '../src/Todos/Todo'

test('renders content', () => {
  const todo = {
    "text": "Bababoi",
    "done": false
  }
  
    render(<Todo todo={todo} doneInfo='doneInfo' notDoneInfo='notDoneInfo' />)

    screen.debug()

    const element = screen.getByText('Bababoi')
    expect(element).toBeDefined()
})