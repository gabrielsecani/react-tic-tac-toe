import React from 'react';
import { Route, BrowserRouter, Redirect} from 'react-router-dom';
import Loadable from 'react-loadable';
import LoadingComponent from '../components/LoadingComponent';

const LoadableGame = Loadable({
  loader: () => import('../components/Game/Game'),
  loading: LoadingComponent,
});

const LoadableSearch = Loadable({
  loader: () => import('../components/Game/Search'),
  loading: LoadingComponent,
});

const LoadableCreate = Loadable({
  loader: () => import('../components/Game/Create'),
  loading: LoadingComponent,
});


// const NotFound=()=>(<section className="App-intro">Page Not Found</section>);
// <Route path='*' component={NotFound}/>

export const routes = [
  { path: '/', exact: true, to:'search', display: '', render: ()=> (<Redirect to="search"/>) },
  { path: '/game', display: 'Play Game alone', component: LoadableGame },
  { path: '/search', display: 'Search for Game', component: LoadableSearch },
  { path: '/new', display: 'Create a Game', component: LoadableCreate },
];

export const SwitchRouting = ({AppHeader}) => (
  <BrowserRouter>
    <div className="App">
      <AppHeader/>
      <div>
      {routes.map((route,i)=>(
          <Route key={i} {...route}>
          {route.childrens?(
            <div>
            {route.childrens.map(({path, c},j)=>(<Route key={j} path={route.path+'/'+c} {...c}></Route>)) }
            </div>): ''}
          </Route>
        ))}
      </div>
    </div>
  </BrowserRouter>
  );