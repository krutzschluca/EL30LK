import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <h1>Welcome to Clinic Appointment System</h1>
          </Route>
          <Route path="/schedule">
            <h1>Schedule an Appointment</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
