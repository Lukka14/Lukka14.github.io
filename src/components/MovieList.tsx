import { MovieListProps } from "../models/Movie";
import "../css/App.css";

{/* <div class="container text-center">
  <div class="row">
    <div class="col">
      Column
    </div>
    <div class="col">
      Column
    </div>
    <div class="col">
      Column
    </div>
  </div>
</div> */}

export const MovieList = ({ movies }: MovieListProps) => {
  return (
    <div className="container">
        <ul className="row row-cols-5">
          {movies.map((movie) => (
            <li key={movie.id} className="col no-bullets" >
              <div className="movie">
                <img src={"https://image.tmdb.org/t/p/w300"+movie.poster_path} alt={movie.title} className="img-fluid"/>
                <h3>{movie.title}</h3>
                <p>{movie.release_date}</p>
                <p>{movie.vote_average}</p>
              </div>
            </li>
          ))}
        </ul>
    </div>
  );
};


