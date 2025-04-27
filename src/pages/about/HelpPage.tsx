import React, { useState } from "react";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import DataTable from "./DataTable";
import Breadcrumb from "./BreadCrumb";
import { Media } from "../../models/Movie";
import { fetchTopRatedMovies } from "../../services/MediaService";
import CenteredH1 from "../shared/CenteredText";
import Modal from "./ContactModalWindow";

const HelpPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (medias.length === 0) {
    fetchTopRatedMovies()
      .then(setMedias)
      .catch((err) => console.error(err));
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />

      <PrimarySearchAppBar onClick={() => {}} displaySearch={false} />

      <Breadcrumb />

      <CenteredH1>
        Don't know what to watch? Here's the Top 100 Most Popular/Rated Movies:
      </CenteredH1>

      <DataTable mediaList={medias} />

      <div style={{ marginTop: "30px" }}>
        <CenteredH1>
          Could not find what you were searching for? <br></br>
          Want to get notfied when the new movies are added? Click the button
          below!:
        </CenteredH1>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={openModal}
          className="btn btn-primary btn-lg"
          style={{ marginBottom: "20px" }}
        >
          Notify Me
        </button>
      </div>

      {isModalOpen && <Modal onClose={closeModal} />}
    </>
  );
};

export default HelpPage;
