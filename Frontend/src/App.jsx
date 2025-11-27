import React from "react"
import Login from "./Component/Login"
import { BrowserRouter } from "react-router-dom"
import Routers from "./Routes/Routers"

function App() {

  return (

    <BrowserRouter>
      <Routers/>
    </BrowserRouter>
  )
}

export default App
