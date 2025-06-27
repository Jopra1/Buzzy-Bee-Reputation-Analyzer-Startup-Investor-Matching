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
  Skeleton // For a more detailed loading skeleton if needed
} from "@mui/material";
import { styled, keyframes } from '@mui/system';

// Import your futuristic background image
import futuristicBg from "../assets/futuristic-bg.jpg"; // <--- IMPORTANT: Replace with your actual image path

// Keyframe for subtle glow animation on cards
const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 191, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 191, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(0, 191, 255, 0.3); }
`;

// Keyframe for background pulse animation
const backgroundPulse = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled component for the main container with background
const RootContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  // Background image with dark blue/purple overlay
  background: `linear-gradient(rgba(10, 25, 47, 0.8), rgba(0, 0, 50, 0.8)), url(${futuristicBg}) center center / cover no-repeat fixed`,
  backgroundSize: 'cover',
  '&::before': { // Subtle overlay gradient for depth
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(0, 191, 255, 0.05), rgba(138, 43, 226, 0.05))',
    animation: `${backgroundPulse} 20s ease infinite`,
    backgroundSize: '200% 200%', // For the pulsing effect
    zIndex: 1,
  },
}));

// Styled component for the cards
const StyledCard = styled(Card)(({ theme, disabled }) => ({
  background: 'rgba(25, 25, 70, 0.7)', // Dark semi-transparent blue
  backdropFilter: 'blur(8px)', // Glassmorphism effect
  borderRadius: theme.shape.borderRadius * 2, // More rounded corners
  border: '1px solid rgba(0, 191, 255, 0.2)', // Light blue border
  color: 'white',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  minHeight: '150px', // Ensure consistent height
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2, // Ensure cards are above the background pseudo-element

  '&:hover': {
    transform: disabled ? 'none' : 'translateY(-5px) scale(1.02)',
    boxShadow: disabled ? 'none' : '0 0 30px rgba(0, 191, 255, 0.7)', // Stronger glow on hover
  },
  ...(disabled && {
    opacity: 0.4, // Keep opacity slightly higher than before for disabled
    cursor: "not-allowed",
    boxShadow: 'none',
    border: '1px dashed rgba(255, 255, 255, 0.1)', // Dashed border for disabled
  }),
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
  const [loading, setLoading] = useState(true); // State for simulated loading

  useEffect(() => {
    // Simulate a network request or data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate 1.5 seconds of loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <RootContainer>
      <Container maxWidth="md" sx={{ zIndex: 3, position: 'relative' }}> {/* Ensure content is above background effects */}
        {loading ? (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 160px)', // Adjust height based on padding
            color: 'white'
          }}>
            <CircularProgress color="inherit" size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" color="inherit">Loading Analytics Matrix...</Typography>
            {/* Optional: Skeleton loading for cards */}
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
              variant="h3" // Larger title
              gutterBottom
              align="center"
              fontWeight={700}
              sx={{
                mb: 6, // More margin at bottom
                color: 'white',
                textShadow: '0 0 15px rgb(230, 117, 20)', // Glowing text
                background: 'rgb(230, 117, 20)', // Blue gradient
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Choose Your Portal
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <StyledCard disabled>
                  <CardContent sx={{ py: 3, px: 2 }}> {/* Adjust padding */}
                    <Typography variant="h5" align="center" fontWeight={600}>
                      Investor <br /> <span style={{ fontSize: '0.8em', opacity: 0.7, display: 'block', marginTop: '5px' }}>(Access Denied - Coming Soon)</span>
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size={24} sx={{ color: 'rgba(255,255,255,0.5)' }} /> {/* Subtle loading indicator for coming soon */}
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <StyledCard>
                  <StyledCardActionArea onClick={() => navigate("/company-form")}>
                    <CardContent sx={{ py: 3, px: 2 }}>
                      <Typography variant="h5" align="center" fontWeight={600}>
                        Company <br /> <span style={{ fontSize: '0.8em', opacity: 0.7, display: 'block', marginTop: '5px' }}>(Enter Your Dashboard)</span>
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