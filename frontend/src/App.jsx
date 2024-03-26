import Home from "./pages/Home/Home"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss"
import { Provider } from "react-redux";
import store from "./utils/store";

function App() {

  return (
    <>
    <Provider store={store}>
      <Router>
          <Routes>
            <Route element={<Home/>} path='*' exact />
          </Routes>
      </Router>
    </Provider>
    </>
  )
}

export default App
