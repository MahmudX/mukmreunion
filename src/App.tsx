import reunionBanner from '/reunion-banner.jpeg'
import './App.css'
import Form from './Form'

function App() {

  return (
    <div className='flex flex-col items-center'>
      <img src={reunionBanner} alt="React Logo" />
      <Form />
    </div>
  )
}

export default App


