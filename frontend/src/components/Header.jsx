import React from "react";
import { Container, Grid, Link, Stack, Button, Typography, AppBar, Toolbar, Box } from "@mui/material";
import { Twitter, Instagram, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GitHubIcon from '@mui/icons-material/GitHub';
import bgImage from "../assets/stock-bg.jpg"; // replace with your image

const Header = () => {
  const navigate = useNavigate(); // ✅ Fix added

  return (
    <Box component="header" sx={{ position: "relative" }}>
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" color="Yellow" sx={{ fontWeight: 'bold', fontSize: '1.8rem',textShadow: '0 0 10px rgba(255,215,0,0.5)' }} >
            BUZZY BEE
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
           
            <MenuIcon sx={{ display: { xs: "block", md: "none" }, color: 'white' }} />
            <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
              
                <Link
    href="https://github.com/Shivsay/Eden4_Identifier_Expected" // Replace with your actual GitHub URL
    target="_blank"
    rel="noopener"
    color="inherit"
    underline="none"
    sx={{ display: 'flex', alignItems: 'center' }}
  >
    <GitHubIcon color="inherit" />
  </Link>
             
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          height: "100vh",
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage}) center/cover no-repeat`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container>
          <Grid container direction="column" spacing={2} sx={{ maxWidth: "800px", color: "#fff" }}>
            <Grid item>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  color: '#FFD700',
                  textShadow: '0 0 10px rgba(255,215,0,0.5)',
                }}
              >
                Unlock Your Business's <br />
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: 'inherit',
                    color: '#FF8C00',
                    textShadow: '0 0 10px rgba(255,140,0,0.7)',
                  }}
                >
                  True Potential
                </Typography>
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: '#E0E0E0'
                }}
              >
                Gain deep insights into your brand's performance, understand market perception,
                and connect with the right opportunities. Our analytics empower you to make data-driven decisions and elevate your reputation.
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#FF8C00',
                    '&:hover': {
                      bgcolor: '#E07B00',
                    },
                    fontWeight: 'bold',
                    padding: '10px 25px',
                    fontSize: '1rem',
                  }}
                  onClick={() => navigate("/choose-role")} // ✅ Now it works!
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: '#FF8C00',
                    borderColor: '#FF8C00',
                    '&:hover': {
                      borderColor: '#E07B00',
                      color: '#E07B00',
                    },
                    fontWeight: 'bold',
                    padding: '10px 25px',
                    fontSize: '1rem',
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Header;
