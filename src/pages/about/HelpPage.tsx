import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "../main/Background";
import PrimarySearchAppBar from "../shared/TopNavBar";
import DataTable from "./DataTable";
import { Media } from "../../models/Movie";
import { fetchTopRatedMovies } from "../../services/MediaService";
import { Footer } from "../shared/Footer";
import { openModal } from "../shared/modals/modal-utils";
import "./about.css";
import {
  ChevronDown,
  Clapperboard,
  LifeBuoy,
  Mail,
  MonitorPlay,
  Search,
  Server,
  Sparkles,
  Trophy,
  UserPlus,
} from "lucide-react";

const HELP_CARDS = [
  {
    icon: Search,
    title: "Find something to watch",
    copy: "Use the search page to look up any movie or series. Switch between All, Movies and Series with the filter under the search bar.",
  },
  {
    icon: MonitorPlay,
    title: "Start streaming",
    copy: "Open any title and hit play. For series, pick the season and episode from the episode list below the player.",
  },
  {
    icon: Server,
    title: "Switch servers",
    copy: "If a stream will not load or buffers, use the server selector on the watch page to try a different source.",
  },
  {
    icon: UserPlus,
    title: "Save your progress",
    copy: "Create a free account to keep a watchlist, track what you have already seen, and pick up where you left off.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is MoviePlus free to use?",
    answer:
      "Yes. Browsing, searching and streaming are completely free, and no payment details are ever required.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No, you can watch without signing up. An account only adds extras such as your watchlist, favourites and continue-watching history across devices.",
  },
  {
    question: "A video will not play or keeps buffering. What should I do?",
    answer:
      "Open the server selector on the watch page and choose another source, since availability varies between servers. Refreshing the page or disabling an ad blocker for the player usually clears the rest.",
  },
  {
    question: "Why can I not find a specific title?",
    answer:
      "Very new or very obscure releases can be missing from our catalogue. Try searching a shorter version of the name, switch the filter to All, and if it is still missing let us know and we will look into adding it.",
  },
  {
    question: "How do I watch a specific episode of a series?",
    answer:
      "Open the series and use the season dropdown and episode carousel underneath the player to jump straight to the episode you want.",
  },
  {
    question: "Which devices are supported?",
    answer:
      "MoviePlus runs in any modern browser, so it works on desktop, tablet and mobile. The layout adapts automatically to your screen size.",
  },
];

const HelpPage: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isActive = true;

    fetchTopRatedMovies()
      .then((items) => {
        if (isActive) setMedias(items);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const openContactModal = () => openModal("contactModalWindow");

  return (
    <>
      <Background url="https://github.com/Lukka14/Lukka14.github.io/blob/master/public/assets/movieplus-full-bg.png?raw=true" />

      <PrimarySearchAppBar onClick={() => {}} displaySearch={false} />

      <main className="container py-4 py-lg-5 help-page-shell">
        <section className="help-panel help-hero p-4 p-lg-5 mb-4">
          <div className="help-hero-inner">
            <div className="help-badge mb-3">
              <LifeBuoy size={16} />
              Help center
            </div>
            <h1 className="help-title mb-3">How can we help?</h1>
            <p className="help-copy mb-0">
              Everything you need to get the most out of MoviePlus &mdash; from finding
              a title to fixing a stream that will not start.
            </p>

            <div className="help-hero-actions">
              <button
                type="button"
                className="help-btn"
                onClick={() => navigate("/multiSearch")}
              >
                <Search size={17} />
                Browse the catalogue
              </button>
              <button
                type="button"
                className="help-btn help-btn--ghost"
                onClick={openContactModal}
              >
                <Mail size={17} />
                Contact us
              </button>
            </div>
          </div>
        </section>

        <section className="help-panel p-4 p-lg-5 mb-4">
          <div className="help-section-kicker mb-2">
            <Sparkles size={16} />
            Getting started
          </div>
          <h2 className="help-section-title mb-4">The basics in four steps</h2>

          <div className="row g-3">
            {HELP_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div className="col-12 col-sm-6 col-xl-3" key={card.title}>
                  <div className="help-card">
                    <span className="help-card-icon">
                      <Icon size={21} />
                    </span>
                    <h3 className="help-card-title">{card.title}</h3>
                    <p className="help-card-copy">{card.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="help-panel p-4 p-lg-5 mb-4">
          <div className="help-section-kicker mb-2">
            <Clapperboard size={16} />
            Frequently asked
          </div>
          <h2 className="help-section-title mb-4">Questions and answers</h2>

          <div className="row g-lg-3">
            {FAQ_ITEMS.map((item) => (
              <div className="col-12 col-lg-6" key={item.question}>
                <details className="help-faq-item">
                  <summary className="help-faq-question">
                    <span>{item.question}</span>
                    <ChevronDown size={18} className="help-faq-icon" />
                  </summary>
                  <p className="help-faq-answer">{item.answer}</p>
                </details>
              </div>
            ))}
          </div>
        </section>

        <section className="help-panel p-4 p-lg-5 mb-4">
          <div className="help-section-kicker mb-2">
            <Trophy size={16} />
            Still undecided?
          </div>
          <h2 className="help-section-title mb-2">Top 100 highest rated movies</h2>
          <p className="help-copy mb-4">
            Our most acclaimed titles, ranked. Select any row to start watching.
          </p>

          <DataTable mediaList={medias} isLoading={isLoading} />
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HelpPage;
