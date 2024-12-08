import "../css/watch.css";

export const Background = ({ url }: { url: string }) => {

  console.log(url);

  return (
  <div
    className="background-image_watch"
    style={{ backgroundImage: `url(${url})` }}
    />
);
};
