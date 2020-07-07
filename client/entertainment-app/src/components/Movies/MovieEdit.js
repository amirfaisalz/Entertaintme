import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
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

const EDIT_MOVIE = gql`
  mutation EditMovie(
    $id: ID!
    $title: String!
    $overview: String!
    $poster_path: String!
    $popularity: Float!
    $tags: [String]!
  ) {
    editMovie(
      _id: $id
      title: $title
      overview: $overview
      poster_path: $poster_path
      popularity: $popularity
      tags: $tags
    ) {
      msg
    }
  }
`;

export default function MovieEdit() {
  const { id } = useParams();
  let history = useHistory();

  // Movie By Id
  const { loading, error, data } = useQuery(MOVIES);

  let movie = '';

  if (data) {
    data.movies.map((data) => {
      if (data._id == id) {
        movie = data;
      }
    });
  }

  const [title, setTitle] = useState(movie.title);
  const [overview, setOverview] = useState(movie.overview);
  const [poster_path, setPoster_path] = useState(movie.poster_path);
  const [popularity, setPopularity] = useState(movie.popularity);
  const [tags, setTags] = useState(movie.tags);

  const [editMovie] = useMutation(EDIT_MOVIE, {
    refetchQueries: [{ query: MOVIES }],
  });

  const editMovieBtn = (event) => {
    event.preventDefault();
    editMovie({
      variables: { id, title, overview, poster_path, popularity, tags },
    });
    setTitle('');
    setOverview('');
    setPoster_path('');
    setPopularity('');
    setTags('');
    history.push('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="container">
      <h1>Edit Movie</h1>
      <form className="inputGroup" onSubmit={(event) => editMovieBtn(event)}>
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
          defaultValue={poster_path}
          onChange={(event) => setPoster_path(event.target.value)}
          type="text"
          autoComplete="off"
          placeholder="Poster path"
        />
        <input
          defaultValue={popularity}
          onChange={(event) => setPopularity(Number(event.target.value))}
          type="number"
          autoComplete="off"
          placeholder="Popularity"
        />
        <input
          defaultValue={tags}
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
