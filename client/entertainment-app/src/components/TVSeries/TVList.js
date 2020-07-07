import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import swal from 'sweetalert';

// Apollo Client
import { useQuery } from '@apollo/react-hooks';
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

const DELETE = gql`
  mutation DeleteTV($id: ID!) {
    deleteTV(_id: $id) {
      msg
    }
  }
`;

export default function TVList() {
  let history = useHistory();
  const [deleteTV] = useMutation(DELETE, {
    refetchQueries: [{ query: TVSERIES }],
  });

  // Apollo Client
  const { loading, error, data } = useQuery(TVSERIES);

  const addBtn = (event) => {
    event.preventDefault();
    history.push('/tv/add');
  };

  const detailBtn = (event, _id) => {
    event.preventDefault();
    history.push('/tv/' + _id);
  };

  const editBtn = (event, id) => {
    event.preventDefault();
    history.push('/tv/edit/' + id);
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
        deleteTV({ variables: { id } });
        swal('SERIES has been deleted!', {
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
        <h1>TV Series List</h1>
        <button onClick={(event) => addBtn(event)} className="addBtn">Add Series</button>
      </div>
      <div className="cardGroup">
        {data.tvSeries && data.tvSeries.map((series) => {
          return (
            <div key={series._id} className="card">
              <h3>{series.title}</h3>
              <img src={series.poster_path} alt="poster" />
              <div className="buttonGroup">
                <button onClick={(event) => detailBtn(event, series._id)}>
                  See Detail
                </button>
                <button onClick={(event) => editBtn(event, series._id)}>
                  Edit Series
                </button>
                <button onClick={(event) => deleteBtn(event, series._id)}>
                  Delete Series
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
