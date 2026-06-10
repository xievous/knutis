import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { deletePotluck, getAllPotlucks } from "../api/potlucks";
import { type Potluck } from "../types/potluck";

const gridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 2.5,
};

export default function Home() {
  const navigate = useNavigate();

  const [potlucks, setPotlucks] = useState<Potluck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPotlucks();
        setPotlucks(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id?: number) => {
    e.stopPropagation();
    if (!id) return;
    if (!confirm("Delete this potluck? This can't be undone.")) return;

    try {
      await deletePotluck(id);
      setPotlucks((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Box sx={{ maxWidth: 640, mb: { xs: 4, md: 6 } }}>
        <Typography variant="overline" color="primary">
          Your table
        </Typography>
        <Typography variant="h3" sx={{ mt: 0.5, mb: 1.5 }}>
          Build your potluck.
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 18 }}>
          Plan a gathering, line up the dishes, and keep track of who brings
          what — all on one quiet page.
        </Typography>
      </Box>

      {loading && (
        <Box sx={gridSx}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={148}
              sx={{ borderRadius: "16px" }}
            />
          ))}
        </Box>
      )}

      {!loading && error && (
        <Card sx={{ p: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Couldn't load your potlucks.
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Make sure the backend is running, then try again.
            </Typography>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && potlucks.length === 0 && (
        <Card
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
            borderStyle: "dashed",
            bgcolor: "transparent",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "grid",
              placeItems: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <AddRoundedIcon />
          </Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            No potlucks yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Start your first gathering and add the dishes you're planning.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/create")}>
            Create your first potluck
          </Button>
        </Card>
      )}

      {!loading && !error && potlucks.length > 0 && (
        <Box sx={gridSx}>
          {potlucks.map((potluck) => (
            <Card
              key={potluck.id}
              onClick={() => navigate(`/potluck/${potluck.id}`)}
              sx={{
                cursor: "pointer",
                transition:
                  "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  borderColor: "primary.light",
                  boxShadow: "0 12px 28px rgba(31, 122, 69, 0.10)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontSize: 20, wordBreak: "break-word" }}
                  >
                    {potluck.title}
                  </Typography>
                  <IconButton
                    size="small"
                    aria-label={`Delete ${potluck.title}`}
                    onClick={(e) => handleDelete(e, potluck.id)}
                    sx={{ color: "text.secondary", mt: -0.5, mr: -0.5 }}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                    mb: 0.75,
                  }}
                >
                  <EventOutlinedIcon sx={{ fontSize: 17 }} />
                  <Typography variant="body2">
                    {potluck.date || "Date to be decided"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "text.secondary",
                  }}
                >
                  <PlaceOutlinedIcon sx={{ fontSize: 17 }} />
                  <Typography variant="body2">
                    {potluck.location || "Location to be decided"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
