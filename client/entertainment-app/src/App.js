import React from 'react';
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
import {
  MovieList,
  MovieDetail,
  MovieEdit,
  AddMovie,
  TVList,
  TVDetail,
  AddTVSeries,
  TVEdit
} from './components';
import './App.css';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <nav className="navbar">
          <Link className="link" to="/">
            Movies
          </Link>
          <Link className="link" to="/tv">
            TV Series
          </Link>
        </nav>
        <Switch>
          <Route path="/" component={MovieList} exact />
          <Route path="/movies/add" component={AddMovie} exact />
          <Route path="/movies/:id" component={MovieDetail} exact />
          <Route path="/movies/edit/:id" component={MovieEdit} exact />

          <Route path="/tv" component={TVList} exact />
          <Route path="/tv/add" component={AddTVSeries} exact />
          <Route path="/tv/:id" component={TVDetail} exact />
          <Route path="/tv/edit/:id" component={TVEdit} exact />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}
