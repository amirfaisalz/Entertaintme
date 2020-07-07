import React from 'react';
import { useParams } from 'react-router-dom';

// Apollo Client
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const TV_BY_ID = gql`
  query TVSeries($id: ID!) {
    tvSeriesById(_id: $id) {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`;

export default function TVDetail() {
  const { id } = useParams();

  // Apollo Client
  const { loading, error, data } = useQuery(TV_BY_ID, {
    variables: { id: id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  // Apollo Client End

  const { title, overview, poster_path, popularity, tags } = data.tvSeriesById;

  return (
    <div className="container">
      <div className="detail">
        <div className="poster">
          <img src={poster_path} alt="poster" />
        </div>
        <div className="data">
          <h1>{title}</h1>
          <div className="genre">
            <h3>
              genre : {tags[0]}, {tags[1]}
            </h3>
            <h3>|</h3>
            <h3>Rating: {popularity}</h3>
          </div>
          <div className="overview">
            <p className="overTitle">OVERVIEW:</p>
            <p className="overParag">{overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
