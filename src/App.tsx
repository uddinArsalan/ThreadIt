import { useState } from "react"
import MainSection from "./components/MainSection"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  const [nav,setNav]= useState(false);
  const [userId,setUserId] = useState<string | undefined>(undefined);
  return (
    <div>
      <Navbar setUserId={setUserId} setNav={setNav}/>
      <MainSection setUserId={setUserId} userId={userId} nav={nav}/>
      <Footer />
    </div>
  )
}

export default App
