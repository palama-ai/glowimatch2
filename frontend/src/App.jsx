import React from "react";
import Routes from "./Routes";
import useEventsTracker from './lib/eventsTracker';

function App() {
  // mount the events tracker (reports sessions & page views)
  useEventsTracker();

  return <Routes />;
}

export default App;
