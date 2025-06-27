import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  CircularProgress,
  Skeleton,
  Button,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import futuristicBg from "../assets/futuristic-bg.jpg";

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 191, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 191, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(0, 191, 255, 0.3); }
`;

const backgroundPulse = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const RootContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(rgba(10, 25, 47, 0.8), rgba(0, 0, 50, 0.8)), url(${futuristicBg}) center center / cover no-repeat fixed`,
  backgroundSize: 'cover',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(0, 191, 255, 0.05), rgba(138, 43, 226, 0.05))',
    animation: `${backgroundPulse} 20s ease infinite`,
    backgroundSize: '200% 200%',
    zIndex: 1,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(25, 25, 70, 0.7)',
  backdropFilter: 'blur(8px)',
  borderRadius: theme.shape.borderRadius * 2,
  border: '1px solid rgba(0, 191, 255, 0.2)',
  color: 'white',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '150px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
  '&:hover': {
    transform: 'translateY(-5px) scale(1.02)',
    boxShadow: '0 0 30px rgba(0, 191, 255, 0.7)',
  },
}));

const StyledCardActionArea = styled(CardActionArea)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const ChooseRole = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <RootContainer>

      {/* 🔙 Back Button */}
      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "orange",
          borderColor: "orange",
          zIndex: 5,
          '&:hover': {
            borderColor: "orange",
            color: "orange",
          },
        }}
      >
        ← Back
      </Button>

      <Container maxWidth="md" sx={{ zIndex: 3, position: 'relative' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'calc(100vh - 160px)',
              color: 'white',
            }}
          >
            <CircularProgress color="inherit" size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" color="inherit">
              Loading Analytics Matrix...
            </Typography>
            <Grid container spacing={4} justifyContent="center" mt={4}>
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="rectangular" width="100%" height={150} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="rectangular" width="100%" height={150} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <>
            <Typography
              variant="h3"
              gutterBottom
              align="center"
              fontWeight={700}
              sx={{
                mb: 6,
                textShadow: '0 0 15px rgb(230, 117, 20)',
                background: 'linear-gradient(to right, #ff9100, #ff5722)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Choose Your Portal
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <StyledCard>
                  <StyledCardActionArea onClick={() => navigate("/investor-search")}>
                    <CardContent sx={{ py: 3, px: 2 }}>
                      <Typography variant="h5" align="center" fontWeight={600}>
                        Investor <br />
                        <span
                          style={{
                            fontSize: '0.8em',
                            opacity: 0.7,
                            display: 'block',
                            marginTop: '5px',
                          }}
                        >
                          (Explore Startups)
                        </span>
                      </Typography>
                    </CardContent>
                  </StyledCardActionArea>
                </StyledCard>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <StyledCard>
                  <StyledCardActionArea onClick={() => navigate("/company-form")}>
                    <CardContent sx={{ py: 3, px: 2 }}>
                      <Typography variant="h5" align="center" fontWeight={600}>
                        Company <br />
                        <span
                          style={{
                            fontSize: '0.8em',
                            opacity: 0.7,
                            display: 'block',
                            marginTop: '5px',
                          }}
                        >
                          (Enter Your Dashboard)
                        </span>
                      </Typography>
                    </CardContent>
                  </StyledCardActionArea>
                </StyledCard>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </RootContainer>
  );
};

export default ChooseRole;
