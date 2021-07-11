import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from './PrivateRoute.js';
import Header from './components/Header/Header'
import ScheduleMeeting from './pages/ScheduleMeeting/ScheduleMeeting';
import Auth from "./components/Auth/Auth.jsx";
import Room from './pages/VideoRoom/Room';
import Github from './pages/Github/Github';
import Chat from './pages/Chat/Chat';
import WatchParty from './pages/WatchParty/WatchParty';
import UseAlan from './hooks/UseAlan';
import Music from './pages/Music/Music';
import Whiteboard from './pages/Whiteboard/Whiteboard';

const Alan = () => {
    UseAlan();
    return null;
}

const App = () => {
    return (
        <div className="App">
        <Router>
            <Header />
            <Alan />
            <Switch>
                <PrivateRoute path="/calendar" exact component={ScheduleMeeting} />
                <Route path="/auth" exact component={Auth} />
                <PrivateRoute path="/room/:roomId" exact component={Room} />
                <PrivateRoute path="/github" exact component={Github} />
                <PrivateRoute path="/chat/:roomId?/:type?" exact component={Chat} />
                <PrivateRoute path="/" exact component={Auth} />
                <PrivateRoute path="/watchparty/:roomId?" exact component={WatchParty} />
                <PrivateRoute path="/music" exact component={Music} />
                <PrivateRoute path="/board/:roomId?" exact component={Whiteboard} />
            </Switch>
        </Router>
        </div>
    );
}

export default App;
