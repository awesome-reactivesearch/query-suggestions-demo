import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ReactiveBase } from "@appbaseio/reactivesearch";
import "marketplace-footer/build/static/css/index.css";

import Results from "./main";

const App = () => (
    <ReactiveBase
      app="movie-app_reindexed_2"
      credentials="7CmMBPU4o:4ac08f4e-f8aa-4481-9257-bb5444964366"
      url="https://arc-cluster-dc-test-2-b5c555.searchbase.io"
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