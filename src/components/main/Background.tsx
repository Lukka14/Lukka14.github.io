import "./main.css";

export const Background = ({ url }: { url: string }) => {
  return (
  <div
    className="background-image_main"
    style={{ backgroundImage: `url(${url})` }}
    />
);
};
