import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from './PrivateRoute.js';
import Header from './components/Header/Header'
import ScheduleMeeting from './pages/ScheduleMeeting/ScheduleMeeting';
import Auth from "./components/Auth/Auth.jsx";
import CreateRoom from './pages/VideoRoom/CreateRoom';
import Room from './pages/VideoRoom/Room';
import Github from './pages/Github/Github';

function App() {
    return (
        <div className="App">
        <Router>
            <Header />
            <Switch>
                <PrivateRoute path="/calendar" exact component={ScheduleMeeting} />
                <Route path="/auth" exact component={Auth} />
                <Route path="/" exact component={CreateRoom} />
                <Route path="/room/:roomID" component={Room} />
                <PrivateRoute path="/git" exact component={Github} />
            </Switch>
        </Router>
        </div>
    );
}

export default App;
