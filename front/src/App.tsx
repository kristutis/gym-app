import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import Footer from './components/footer/Footer'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import Timetable from './pages/timetable/Timetable'
import Users from './pages/users/Users'

export const DEFAULT_BACKEND_PATH = 'http://localhost:3001/api'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/timetable',
    component: Timetable,
  },
  {
    path: '/users',
    component: Users,
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
        <Footer />
      </Router>
    </div>
  )
}

interface RouteProps {
  path: string
  component: () => JSX.Element
}

export default App
