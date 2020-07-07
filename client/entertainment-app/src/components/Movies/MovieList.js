import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import swal from 'sweetalert';

// Apollo Client
import { useQuery } from '@apollo/react-hooks';
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

const DELETE = gql`
  mutation DeleteMovie($id: ID!) {
    deleteMovie(_id: $id) {
      msg
    }
  }
`;

export default function MovieList() {
  let history = useHistory();
  const [deleteMovie] = useMutation(DELETE, {
    refetchQueries: [{ query: MOVIES }],
  });

  // Apollo Client
  const { loading, error, data } = useQuery(MOVIES);

  const addBtn = (event) => {
    event.preventDefault();
    history.push('/movies/add');
  };

  const detailBtn = (event, _id) => {
    event.preventDefault();
    history.push('/movies/' + _id);
  };

  const editBtn = (event, id) => {
    event.preventDefault();
    history.push('/movies/edit/' + id);
  };

  const deleteBtn = (event, id) => {
    event.preventDefault();
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, this data will never comeback',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteMovie({ variables: { id } });
        swal('Movie has been deleted!', {
          icon: 'success',
        });
      } else {
        swal('Delete is canceled');
      }
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div className="container">
      <div className="addGroup">
        <h1>Movie List</h1>
        <button onClick={(event) => addBtn(event)} className="addBtn">
          Add Movie
        </button>
      </div>
      <div className="cardGroup">
        {data.movies &&
          data.movies.map((movie) => {
            return (
              <div key={movie._id} className="card">
                <h3>{movie.title}</h3>
                <img src={movie.poster_path} alt="poster" />
                <div className="buttonGroup">
                  <button onClick={(event) => detailBtn(event, movie._id)}>
                    See Detail
                  </button>
                  <button onClick={(event) => editBtn(event, movie._id)}>
                    Edit Movie
                  </button>
                  <button onClick={(event) => deleteBtn(event, movie._id)}>
                    Delete Movie
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
