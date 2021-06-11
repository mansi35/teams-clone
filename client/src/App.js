import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext.js';
// import PrivateRoute from './PrivateRoute.js';
import ScheduleMeeting from './pages/ScheduleMeeting/ScheduleMeeting';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            {/*<PrivateRoute path="/requests" component={Requests} />*/}
            <Route path="/calendar">
              <ScheduleMeeting />
            </Route>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
