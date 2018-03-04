import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../constants/routes';

const Navigation = () =>
  <div>
    <ul>
      <li><Link to={routes.GAME}>Game</Link></li>
      <li><Link to={routes.HOME}>Home</Link></li>
      <li><Link to={routes.SEARCH}>Search for a game</Link></li>
    </ul>
  </div>

export default Navigation;