// import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import Footer from './components/footer/Footer'
import Navbar from './components/navbar/Navbar'
import ProtectedRoute from './components/protectedRoute/ProtectedRoute'
import CreateTimeTable from './pages/createTimeTable/CreateTimeTable'
import Home from './pages/home/Home'
import Timetable from './pages/timetable/Timetable'
import UserCalendar from './pages/userCalendar/UserCalendar'
import Users from './pages/users/Users'

export const DEFAULT_BACKEND_PATH = 'http://localhost:3001/api'

const commonRoutes = [
  {
    path: '/',
    component: Home,
  },
] as RouteProps[]

const protectedRoutes = [
  {
    path: '/timetable',
    component: Timetable,
  },
  {
    path: '/timetable/create',
    component: CreateTimeTable,
  },
  {
    path: '/users',
    component: Users,
  },
  {
    path: '/user-calendar',
    component: UserCalendar,
  },
] as RouteProps[]

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          {commonRoutes.map((route, index) => (
            <Route
              key={index}
              exact
              path={route.path}
              component={route.component}
            />
          ))}
          {protectedRoutes.map((route, index) => (
            <ProtectedRoute
              index={index}
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
