import React from 'react';
import Link from 'next/link';

import Oops from '../components/Oops';

import { getMovieDetails, getImageSrc } from '../utils/apiCalls';

const Movie = ({ title, poster_path, rating, overview, genres, cast, error }) =>
  error ? (
    <Oops />
  ) : (
    <div className="movie">
      <div className="card">
        <div className="card-header">
          <div className="card-title h3 text-primary">{title}</div>
          <div className="card-subtitle text-gray">Rating - {rating}</div>
          <div className="chips">
            {genres.map(({ id, name }) => (
              <div key={id} className="chip">
                {name}
              </div>
            ))}
          </div>
        </div>
        <div className="card-image">
          <img src={getImageSrc(poster_path, 500)} alt={`Poster for ${title}`} className="img-responsive" />
        </div>
        <div className="card-body">
          <div className="card-title h4">Overview</div>
          <div className="card-subtitle">{overview}</div>
          <div className="card-title h4">Cast</div>
          <div className="cast">
            {cast.map(
              ({ credit_id, profile_path, name }) =>
                profile_path ? (
                  <figure key={credit_id} className="avatar avatar-xl tooltip" data-tooltip={name}>
                    <img src={getImageSrc(profile_path, 92)} alt={name} />
                  </figure>
                ) : null
            )}
          </div>
        </div>
        <div className="card-footer btn-group btn-group-block">
          <Link prefetch href="/">
            <button className="btn btn-primary">Back to Home</button>
          </Link>
        </div>
      </div>
    </div>
  );

Movie.getInitialProps = async ({ query: { id } }) => {
  const res = await getMovieDetails(id);
  console.log({ res });
  if (res.error || !res.original_title) return res;

  const {
    poster_path,
    overview,
    genres,
    credits: { cast },
    vote_average,
    original_title,
  } = res;

  return {
    title: original_title,
    poster_path,
    rating: vote_average,
    overview,
    genres,
    cast: cast.filter((c, i) => i < 5),
  };
};

export default Movie;
