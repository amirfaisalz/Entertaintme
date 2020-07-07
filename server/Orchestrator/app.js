const { ApolloServer, gql } = require('apollo-server');
const movieUrl = 'http://localhost:3001/movies';
const tvUrl = 'http://localhost:3002/tv';
const axios = require('axios');
const redis = require('./redis');

const typeDefs = gql`
  type Movie {
    _id: ID
    title: String
    overview: String
    poster_path: String
    popularity: Float
    tags: [String]
  }

  type TVSeries {
    _id: ID
    title: String
    overview: String
    poster_path: String
    popularity: Float
    tags: [String]
  }

  type Response {
    msg: String
  }

  type Query {
    movies: [Movie]
    movieById(_id: ID!): Movie
    tvSeries: [TVSeries]
    tvSeriesById(_id: ID!): TVSeries
  }

  type Mutation {
    addMovie(
      title: String!
      overview: String!
      poster_path: String!
      popularity: Float!
      tags: [String]!
    ): Movie

    editMovie(
      _id: ID!
      title: String!
      overview: String!
      poster_path: String!
      popularity: Float!
      tags: [String]!
    ): Response

    deleteMovie(_id: ID!): Response

    addTV(
      title: String!
      overview: String!
      poster_path: String!
      popularity: Float!
      tags: [String]!
    ): TVSeries

    editTV(
      _id: ID!
      title: String!
      overview: String!
      poster_path: String!
      popularity: Float!
      tags: [String]!
    ): Response

    deleteTV(_id: ID!): Response
  }
`;

const resolvers = {
  Query: {
    // Get Movie
    movies: async () => {
      let cache = await redis.get('movies');
      if (cache) {
        return JSON.parse(cache);
      } else {
        const { data } = await axios.get(movieUrl);
        await redis.set('movies', JSON.stringify(data));
        return data;
      }
    },

    movieById: async (_, args) => {
      const { _id } = args;
      const { data } = await axios.get(`${movieUrl}/${_id}`);
      return data[0];
    },

    // Get TV Series
    tvSeries: async () => {
      let cache = await redis.get('tvSeries');
      if (cache) {
        return JSON.parse(cache);
      } else {
        const { data } = await axios.get(tvUrl);
        await redis.set('tvSeries', JSON.stringify(data));
        return data;
      }
    },

    tvSeriesById: async (_, args) => {
      const { _id } = args;
      const { data } = await axios.get(`${tvUrl}/${_id}`);
      return data[0];
    },
  },
  Mutation: {
    // Add Movie
    addMovie: async (_, args) => {
      const { title, overview, poster_path, popularity, tags } = args;
      try {
        const { data } = await axios({
          method: 'post',
          url: movieUrl,
          data: {
            title,
            overview,
            poster_path,
            popularity,
            tags,
          },
        });

        if (data) {
          const cacheMovie = await redis.get('movies');
          const cache = JSON.parse(cacheMovie);
          cache.push(data.ops[0]);
          await redis.set('movies', JSON.stringify(cache));
          return data.ops[0];
        }
      } catch (error) {
        return error.message;
      }
    },

    // Add TV Series
    addTV: async (_, args) => {
      const { title, overview, poster_path, popularity, tags } = args;
      try {
        const { data } = await axios({
          method: 'post',
          url: tvUrl,
          data: {
            title,
            overview,
            poster_path,
            popularity,
            tags,
          },
        });

        if (data) {
          const cacheTV = await redis.get('tvSeries');
          const cache = JSON.parse(cacheTV);
          cache.push(data.ops[0]);
          await redis.set('tvSeries', JSON.stringify(cache));
          return data.ops[0];
        }
      } catch (error) {
        return error.message;
      }
    },

    // Delete Movie
    deleteMovie: async (_, args) => {
      try {
        const { _id } = args;
        const cacheMovie = await redis.get('movies');
        const cache = JSON.parse(cacheMovie);

        const deleteMovie = await axios({
          method: 'delete',
          url: `${movieUrl}/${_id}`,
        });
        const { data } = deleteMovie;
        if (data) {
          const newCache = cache.filter((element) => {
            return element._id !== _id;
          });
          await redis.set('movies', JSON.stringify(newCache));
          return data;
        }
      } catch (error) {
        return error.message;
      }
    },

    // Delete TV
    deleteTV: async (_, args) => {
      try {
        const { _id } = args;
        const cacheTV = await redis.get('tvSeries');
        const cache = JSON.parse(cacheTV);

        const deleteTV = await axios({
          method: 'delete',
          url: `${tvUrl}/${_id}`,
        });
        const { data } = deleteTV;
        if (data) {
          const newCache = cache.filter((element) => {
            return element._id !== _id;
          });
          await redis.set('tvSeries', JSON.stringify(newCache));
          return data;
        }
      } catch (error) {
        return error.message;
      }
    },

    // Edit Movie
    editMovie: async (_, args) => {
      try {
        const { _id, title, overview, poster_path, popularity, tags } = args;
        const movie = {
          _id,
          title,
          overview,
          poster_path,
          popularity,
          tags,
        };

        const cacheMovie = await redis.get('movies');
        const cache = JSON.parse(cacheMovie);
        const newCache = cache.filter((element) => {
          return element._id !== _id;
        });

        const updateMovie = await axios({
          method: 'patch',
          url: `${movieUrl}/${_id}`,
          data: { title, overview, poster_path, popularity, tags },
        });
        const { data } = updateMovie;

        if (data) {
          newCache.push(movie);
          await redis.set('movies', JSON.stringify(newCache));
          return movie;
        }
      } catch (error) {
        return error.message;
      }
    },

    // Edit TV
    editTV: async (_, args) => {
      try {
        const { _id, title, overview, poster_path, popularity, tags } = args;
        const TVSeries = {
          _id,
          title,
          overview,
          poster_path,
          popularity,
          tags,
        };

        const cacheTV = await redis.get('tvSeries');
        const cache = JSON.parse(cacheTV);
        const newCache = cache.filter((element) => {
          return element._id !== _id;
        });

        const updateTV = await axios({
          method: 'patch',
          url: `${tvUrl}/${_id}`,
          data: { title, overview, poster_path, popularity, tags },
        });
        const { data } = updateTV;

        if (data) {
          newCache.push(TVSeries);
          await redis.set('tvSeries', JSON.stringify(newCache));
          return { msg: 'TV Series has been updated' };
        }
      } catch (error) {
        return error.message;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

// ========== express js ==================
//
// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;
// const cors = require('cors');

// const { connect } = require('./config/mongo.js');

// connect((error) => {
//   if (!error) {
//     app.use(cors());
//     app.use(express.urlencoded({ extended: true }));
//     app.use(express.json());
//     app.use("/", require('./routes'));

//     app.listen(PORT, (_) => {
//       console.log(`app listening port ${PORT}`);
//     });
//   }
// });
