import { useState } from "react"
import MainSection from "./components/MainSection"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  const [showNavbar ,setShowNavbar]= useState(false);
  return (
    <div>
      <Navbar toggleNavbar={() => setShowNavbar(!showNavbar)}/>
      <MainSection showNavbar={showNavbar}/>
      <Footer />
    </div>
  )
}

export default App
