import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../config/Config";
import { Media } from "../../models/Movie";


// WIP: This component is not yet finished

export function MediaCard({ media }: { media: Media }): JSX.Element {
    const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={media.posterUrl}
        title={media.title}
        component="img"
        onClick={() =>
            navigate(
              RoutePaths.WATCH + `?id=${media.id}&m=${media.mediaType}&s=${1}&e=${1}`
            )
          }
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {media.overview}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Watch</Button>
        <Button size="small">Add to favorites</Button>
      </CardActions>
    </Card>
  );
}
