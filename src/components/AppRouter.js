import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './Navigation';
import Game from '../Game/Game';
import Search from '../Game/Search';

import * as routes from '../constants/routes';

const AppRouter = () =>(
  <Router>
    <Navigation />
      <hr/>

      <Route
        exact path={routes.HOME}
        component={() => <img alt="teste" />}
      />
      <Route
        exact path={routes.GAME}
        component={() => <Game />}
      />
      <Route
        exact path={routes.SEARCH}
        component={() => <Search />}
      />
  </Router>);

export default AppRouter;