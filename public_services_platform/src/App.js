import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useAuth } from "./auth";
import Navbar from "./components/Navbar";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Profile } from "./components/Profile";
import { Confirmation } from "./components/Confirmation";
import { Users } from "./components/Users";
import { Create_Tasks } from "./components/Create_Tasks";
import { Campaigns } from "./components/Campaigns";
import { Aqi } from "./components/Aqi";
import { PH } from "./components/PH";
import { Reset } from "./components/Reset";
import { ResetEmail } from "./components/ResetEmail";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [logged] = useAuth();
  return <Route {...rest} render={(props) => (logged ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/reset">
            <ResetEmail />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/aqi">
            <Aqi />
          </Route>
          <Route path="/ph">
            <PH />
          </Route>
          <Route path="/finalize">
            <Confirmation />
          </Route>
          <Route path="/reset_email">
            <Reset />
          </Route>
          <PrivateRoute path="/create_tasks" component={Create_Tasks} />
          <PrivateRoute path="/users" component={Users} />
          <PrivateRoute path="/campaigns" component={Campaigns} />
          <PrivateRoute path="/profile" component={Profile} />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// function Secret() {
//   const [message, setMessage] = useState('')

//   useEffect(() => {
//     authFetch("/api/protected").then(response => {
//       if (response.status === 401){
//         setMessage("Sorry you aren't authorized!")
//         return null
//       }
//       return response.json()
//     }).then(response => {
//       if (response && response.message){
//         setMessage(response.message)
//       }
//     })
//   }, [])
//   return (
//     <h2>Secret: {message}</h2>
//   )
// }
