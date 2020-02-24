import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ReactiveBase } from "@appbaseio/reactivesearch";
import "marketplace-footer/build/static/css/index.css";

import Results from "./main";

const App = () => (
  <ReactiveBase
    app="movie-app"
    credentials="xe6N9nDRV:51ea7a8a-6354-4b5f-83e1-12dce3b7ec47"
    url="https://arc-cluster-appbase-demo-ps1pgt.searchbase.io"
    analytics={true}
    searchStateHeader
  >
    <Router>
      <Switch>
        <Route path="/" component={Results} />
      </Switch>
    </Router>
  </ReactiveBase>
);

  export default App;