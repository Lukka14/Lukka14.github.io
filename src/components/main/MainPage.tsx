import React, { useState } from "react";
import { Media, MediaType } from "../../models/Movie";
import { fetchMedia } from "../../services/MediaService";
import { MovieList } from "./MovieList";
import Signature from "../../tmp/Signature";
import WIP from "../../tmp/WIP";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "./SearchMUI_EXPERIMENTAL";
import MovieCarousel from "./MovieCarousel";


const MainPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);

  const handleSearch = (query: string) => {
    fetchMedia(query)
      .then(setMedias)
      .catch((err) => console.error(err));
  };

  const mediaList: Media[] = [
    new Media({
      id: 1005331,
      title: "Carry-On",
      posterUrl: "https://image.tmdb.org/t/p/original/sjMN7DRi4sGiledsmllEw5HJjPy.jpg",
      backDropUrl: "https://image.tmdb.org/t/p/original/rhc8Mtuo3Kh8CndnlmTNMF8o9pU.jpg",
      overview: "An airport security officer races to outsmart a mysterious traveler forcing him to let a dangerous item slip onto a Christmas Eve flight.",
      releaseDate: "2024-12-05",
      mediaType: MediaType.MOVIE,
      rating: 7.0,
      genreList: ["Action", "Mystery", "Thriller"],
      originalLanguage: "en"
    }),
    new Media({
      id: 845781,
      title: "Red One",
      posterUrl: "https://image.tmdb.org/t/p/original/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg",
      backDropUrl: "https://image.tmdb.org/t/p/original/bHkn3yuOFdu5LJcq67Odofhx6cb.jpg",
      overview: "After Santa Claus (codename: Red One) is kidnapped, the North Pole's Head of Security must team up with the world's most infamous tracker in a globe-trotting, action-packed mission to save Christmas.",
      releaseDate: "2024-10-31",
      mediaType: MediaType.MOVIE,
      rating: 6.9,
      genreList: ["Action", "Fantasy", "Comedy"],
      originalLanguage: "en"
    }),
    new Media({
      id: 912649,
      title: "Venom: The Last Dance",
      posterUrl: "https://image.tmdb.org/t/p/original/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
      backDropUrl: "https://image.tmdb.org/t/p/original/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
      overview: "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance.",
      releaseDate: "2024-10-22",
      mediaType: MediaType.MOVIE,
      rating: 6.772,
      genreList: ["Action", "Fantasy", "Adventure", "Thriller"],
      originalLanguage: "en"
    })
  ];
  
  
  console.log("mediaList:", mediaList);
  return (
    <>
      <Background
        url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true"
        // url="https://gcdnb.pbrd.co/images/ZvEZBJu1sgOG.png?o=1"
      />

      <PrimarySearchAppBar onClick={handleSearch} displaySearch={true} />
      <MovieCarousel mediaList={mediaList} />
      <MovieList mediaList={medias} />
      {/* <WIP></WIP> */}
      {/* <Signature /> */}
    </>
  );
};

export default MainPage;
