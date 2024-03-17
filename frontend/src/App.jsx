import Home from "./pages/Home/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
