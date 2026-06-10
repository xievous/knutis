import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 8, md: 14 },
        maxWidth: 440,
        mx: "auto",
      }}
    >
      <Typography variant="overline" color="primary">
        404
      </Typography>
      <Typography variant="h3" sx={{ mt: 1, mb: 1.5 }}>
        That table isn't set.
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        The page you were looking for doesn't exist. Let's head back to your
        potlucks.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Back to home
      </Button>
    </Box>
  );
}
