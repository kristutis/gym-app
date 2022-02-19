import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/Navbar'
import logo from './logo.svg'
import Home from './pages/home/Home'

const routes = [
  {
    path: '/',
    component: Home,
  },
] as RouteProps[]

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          {routes.map((route, index) => (
            <Route
              key={index}
              exact
              path={route.path}
              component={route.component}
            />
          ))}
        </Switch>
      </Router>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  )
}

interface RouteProps {
  path: string
  component: () => JSX.Element
}

export default App
