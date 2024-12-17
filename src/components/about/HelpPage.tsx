import React, { useState } from "react";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/SearchMUI_EXPERIMENTAL";
import DataTable from "./DataTable";
import Breadcrumb from "./BreadCrumb";
import { Media } from "../../models/Movie";
import { fetchOnlyMovies, fetchDiscoverMovies, fetchTopRatedMovies } from "../../services/MediaService";
import CenteredH1 from "../main/CenteredText";

const HelpPage: React.FC = () => {

  const [medias, setMedias] = useState<Media[]>([]);


  if(medias.length === 0){
    fetchTopRatedMovies().then(setMedias).catch((err) => console.error(err));
  }

  return (
    <>
      <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />
      <PrimarySearchAppBar onClick={() => {}} displaySearch={false} />
      {/* <CenteredH1>Search ANY Movies!</CenteredH1> */}
      <Breadcrumb></Breadcrumb>
      <CenteredH1>Don't know what to watch? here's top 100 Most Popular/Rated Movies:</CenteredH1>
      <DataTable mediaList={medias} />
    </>
  );
};

export default HelpPage;
