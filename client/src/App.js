import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext.js';
// import PrivateRoute from './PrivateRoute.js';
import Header from './components/Header/Header'
import ScheduleMeeting from './pages/ScheduleMeeting/ScheduleMeeting';
import Auth from "./components/Auth/Auth.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
          <Switch>
            {/*<PrivateRoute path="/requests" component={Requests} />*/}
            <Route path="/calendar" exact component={ScheduleMeeting} />
            <Route path="/auth" exact component={Auth} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
