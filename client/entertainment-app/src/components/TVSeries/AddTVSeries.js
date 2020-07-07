import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const TVSERIES = gql`
  {
    tvSeries {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`;

const ADD_TV_SERIES = gql`
  mutation AddTVSeries(
    $title: String!
    $overview: String!
    $poster_path: String!
    $popularity: Float!
    $tags: [String]!
  ) {
    addTV(
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

export default function AddTVSeries() {
  let history = useHistory();

  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [poster_path, setPoster_path] = useState('');
  const [popularity, setPopularity] = useState('');
  const [tags, setTags] = useState([]);

  // Apollo Client

  const [addTV] = useMutation(ADD_TV_SERIES, {
    update(cache, { data: { addTV } }) {
      const { tvSeries } = cache.readQuery({ query: TVSERIES });
      cache.writeQuery({
        query: TVSERIES,
        data: { tvSeries: tvSeries.concat([addTV]) },
      });
    },
  });

  // Apollo Client End

  const addTVSeriesBtn = (event) => {
    event.preventDefault();
    addTV({ variables: { title, overview, poster_path, popularity, tags } });
    setTitle('');
    setOverview('');
    setPoster_path('');
    setPopularity('');
    setTags('');
    history.push('/tv');
  };

  return (
    <div className="container">
      <h1>Add TV Series</h1>
      <form className="inputGroup" onSubmit={addTVSeriesBtn}>
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
