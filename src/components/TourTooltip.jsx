import { Button, Card, CardContent, CardActions, Typography, Box } from "@mui/material";

export default function TourTooltip({
  continuous,
  index,
  step,
  size,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
}) {
  return (
    <span {...tooltipProps}>
      <Card>
        <CardContent>
          {step.title && (
            <Typography gutterBottom variant="h5" component="div">
              {step.title}
            </Typography>
          )}
          {step.content}
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          {skipProps && (
            <Button {...skipProps} color="warning">
              {skipProps.title}
            </Button>
          )}
          {size > 1 && (
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography variant="caption" color="primary">
                {index + 1}/{size}
              </Typography>
            </Box>
          )}
          {index > 0 && <Button {...backProps}>{backProps.title}</Button>}
          {continuous && <Button {...primaryProps}>{primaryProps.title}</Button>}
          {!continuous && <Button {...closeProps}>{closeProps.title}</Button>}
        </CardActions>
      </Card>
    </span>
  );
}
