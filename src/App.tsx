import reunionBanner from '/reunion-banner.jpeg'
import './App.css'
import Form from './Form'
import Footer from './Footer'

function App() {
  return (
    <>
      <div className='flex flex-col items-center p-2 noto-sans-bengali-400 bg-[#fbf002] text-green-950'>
        <img src={reunionBanner} alt="React Logo" className='rounded-md' />
        <Form />
      </div>
      <Footer />
    </>
  )
}

export default App


