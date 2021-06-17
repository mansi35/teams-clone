import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from './PrivateRoute.js';
import Header from './components/Header/Header'
import ScheduleMeeting from './pages/ScheduleMeeting/ScheduleMeeting';
import Auth from "./components/Auth/Auth.jsx";

function App() {
  return (
    <div className="App">
      <Router>
          <Header />
          <Switch>
            {/*<PrivateRoute path="/requests" component={Requests} />*/}
            <PrivateRoute path="/calendar" exact component={ScheduleMeeting} />
            <Route path="/auth" exact component={Auth} />
          </Switch>
      </Router>
    </div>
  );
}

export default App;
