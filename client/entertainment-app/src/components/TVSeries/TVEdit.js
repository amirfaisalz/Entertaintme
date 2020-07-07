import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useQuery, useMutation } from '@apollo/react-hooks';
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

const EDIT_TV_SERIES = gql`
  mutation EditTVSeries(
    $id: ID!
    $title: String!
    $overview: String!
    $poster_path: String!
    $popularity: Float!
    $tags: [String]!
  ) {
    editTV(
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

export default function TVEdit() {
  const { id } = useParams();
  let history = useHistory();

  // Movie By Id
  const { loading, error, data } = useQuery(TVSERIES);

  let tv = '';

  if (data) {
    data.tvSeries.map((data) => {
      if (data._id == id) {
        tv = data;
      }
    });
  }

  const [title, setTitle] = useState(tv.title);
  const [overview, setOverview] = useState(tv.overview);
  const [poster_path, setPoster_path] = useState(tv.poster_path);
  const [popularity, setPopularity] = useState(tv.popularity);
  const [tags, setTags] = useState(tv.tags);

  const [editTV] = useMutation(EDIT_TV_SERIES, {
    refetchQueries: [{ query: TVSERIES }],
  });

  const editTVBtn = (event) => {
    event.preventDefault();
    editTV({
      variables: { id, title, overview, poster_path, popularity, tags },
    });
    setTitle('');
    setOverview('');
    setPoster_path('');
    setPopularity('');
    setTags('');
    history.push('/tv');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="container">
      <h1>Edit Movie</h1>
      <form className="inputGroup" onSubmit={(event) => editTVBtn(event)}>
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
