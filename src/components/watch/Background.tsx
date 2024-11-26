import "./watch.css";

export const Background = ({ url }: { url: string }) => {
  return (
  <div
    className="background-image_watch"
    style={{ backgroundImage: `url(${url})` }}
    />
);
};
