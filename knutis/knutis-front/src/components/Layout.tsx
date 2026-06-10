import { Box, Button, Container, Typography } from "@mui/material";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const onCreatePage = location.pathname === "/create";

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(244, 249, 241, 0.82)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              textDecoration: "none",
              color: "text.primary",
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <RestaurantRoundedIcon sx={{ fontSize: 19 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontSize: 22, lineHeight: 1 }}
            >
              Knutis
            </Typography>
          </Box>

          {!onCreatePage && (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => navigate("/create")}
            >
              New potluck
            </Button>
          )}
        </Container>
      </Box>

      <Container
        component="main"
        maxWidth="lg"
        sx={{ flex: 1, width: "100%", py: { xs: 4, md: 7 } }}
      >
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            Knutis — built for one good table.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
