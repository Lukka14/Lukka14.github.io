import { Bug, MessageCircle } from "lucide-react";
import { DISCORD_INVITE_URL, DiscordMark } from "../shared/DiscordIcon";

export const DiscordBanner = () => (
  <section className="home-discord" aria-labelledby="home-discord-title">
    <div className="home-discord-glow" aria-hidden="true" />

    <div className="home-discord-inner">
      <span className="home-discord-mark" aria-hidden="true">
        <DiscordMark />
      </span>

      <div className="home-discord-copy">
        <p className="home-discord-kicker">Join the community</p>
        <h2 id="home-discord-title">Talk movies with us on Discord</h2>
        <p className="home-discord-text">
          Get release announcements, report a broken source or a bug, and find out what everyone is
          watching this week.
        </p>

        <ul className="home-discord-points">
          <li>
            <Bug size={14} />
            Report issues
          </li>
          <li>
            <MessageCircle size={14} />
            Direct support
          </li>
        </ul>
      </div>

      <a
        className="home-discord-cta"
        href={DISCORD_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <DiscordMark />
        Join our Discord
      </a>
    </div>
  </section>
);
