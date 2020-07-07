import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const MOVIES = gql`
  {
    movies {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`;

const ADD_MOVIE = gql`
  mutation AddMovie(
    $title: String!
    $overview: String!
    $poster_path: String!
    $popularity: Float!
    $tags: [String]!
  ) {
    addMovie(
      title: $title
      overview: $overview
      poster_path: $poster_path
      popularity: $popularity
      tags: $tags
    ) {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`;

export default function AddMovie() {
  let history = useHistory();

  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [poster_path, setPoster_path] = useState('');
  const [popularity, setPopularity] = useState('');
  const [tags, setTags] = useState([]);

  // Apollo Client

  const [addMovie] = useMutation(ADD_MOVIE, {
    update(cache, { data: { addMovie } }) {
      const { movies } = cache.readQuery({ query: MOVIES });
      cache.writeQuery({
        query: MOVIES,
        data: { movies: movies.concat([addMovie]) },
      });
    },
  });

  // Apollo Client End

  const addMovieBtn = (event) => {
    event.preventDefault();
    addMovie({ variables: { title, overview, poster_path, popularity, tags } });
    setTitle('');
    setOverview('');
    setPoster_path('');
    setPopularity('');
    setTags('');
    history.push('/');
  };

  return (
    <div className="container">
      <h1>Add Movie</h1>
      <form className="inputGroup" onSubmit={addMovieBtn}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          type="text"
          autoComplete="off"
          placeholder="Title"
        />
        <input
          value={overview}
          onChange={(event) => setOverview(event.target.value)}
          type="text"
          autoComplete="off"
          placeholder="Overview"
        />
        <input
          value={poster_path}
          onChange={(event) => setPoster_path(event.target.value)}
          type="text"
          autoComplete="off"
          placeholder="Poster path"
        />
        <input
          value={popularity}
          onChange={(event) => setPopularity(Number(event.target.value))}
          type="number"
          autoComplete="off"
          placeholder="Popularity"
        />
        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          type="text"
          autoComplete="off"
          placeholder="Tags"
        />
        <input type="submit" className="editBtn" />
      </form>
    </div>
  );
}
