import Home from "./pages/Home/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss"

function App() {

  return (
    <>
      <Router>
          <Routes>
            <Route element={<Home/>} path='*' exact />
          </Routes>
      </Router>
    </>
  )
}

export default App
