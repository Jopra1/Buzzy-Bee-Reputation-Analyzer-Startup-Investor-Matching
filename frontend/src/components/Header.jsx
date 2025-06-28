import React, { useState } from "react";
import { Container, Grid, Link, Stack, Button, Typography, AppBar, Toolbar, Box, Dialog, DialogContent, DialogTitle, IconButton, Card, CardContent, Avatar } from "@mui/material";
import { Menu as MenuIcon, Close, LinkedIn, GitHub, Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/stock-bg.jpg";


// Import team member images
import adhithyaImg from "../assets/adhithya.jpg"; // Replace with actual path
import anandImg from "../assets/anand.jpg"; // Replace with actual path  
import joelImg from "../assets/joel.jpg"; // Replace with actual path
import shivImg from "../assets/shiv.jpg"; // Replace with actual path

const teamMembers = [
  {
    name: "Adhithya Smitha Raj",
    email: "adhithyasraj7@gmail.com",
    college: "MBCET",
    linkedin: "https://linkedin.com/in/adhithyasraj",
    github: "https://github.com/Adhithya070",
    image: adhithyaImg
  },
  {
    name: "Anand Pillai", 
    email: "pillaianand2003@gmail.com",
    college: "MBCET",
    linkedin: "https://www.linkedin.com/in/anand-pillai22",
    github: "https://github.com/anandPILLAI04",
    image: anandImg
  },
  {
    name: "Joel Prasad",
    email: "joelprasad03@gmail.com", 
    college: "MBCET",
    linkedin: "https://linkedin.com/in/joelpra/",
    github: "https://github.com/Jopra1",
    image: joelImg
  },
  {
    name: "Shiv Sanjay",
    email: "shivsa543@gmail.com",
    college: "MBCET", 
    linkedin: "https://www.linkedin.com/in/shiv-sanjay-87a638256",
    github: "https://github.com/Shivsay",
    image: shivImg
  }
];

const Header = () => {
  const navigate = useNavigate();
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleAboutClose = () => {
    setAboutOpen(false);
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" color="#FFD700" sx={{ 
              fontWeight: 'bold', 
              fontSize: '1.8rem',
              textShadow: '0 0 10px rgba(255,215,0,0.5)' 
            }}>
              BUZZY BEE
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <MenuIcon sx={{ display: { xs: "block", md: "none" }, color: 'white' }} />
            <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
              <Link
                href="https://github.com/Shivsay/Eden4_Identifier_Expected"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="none"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#E0E0E0',
                  '&:hover': { color: '#FFD700' }
                }}
              >
                <GitHub />
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
          <Grid container direction="column" spacing={3} sx={{ maxWidth: "900px" }}>
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
                  color: '#E0E0E0',
                  maxWidth: '600px'
                }}
              >
                Gain deep insights into your brand's performance, understand market perception,
                and connect with the right opportunities. Our analytics empower you to make data-driven decisions and elevate your reputation.
              </Typography>
            </Grid>
            
            <Grid item>
              <Stack direction="row" spacing={3} mt={3}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#FF8C00',
                    '&:hover': {
                      bgcolor: '#E07B00',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px rgba(255, 140, 0, 0.4)'
                    },
                    fontWeight: 'bold',
                    padding: '12px 30px',
                    fontSize: '1.1rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate("/choose-role")}
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
                      backgroundColor: 'rgba(255, 140, 0, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    fontWeight: 'bold',
                    padding: '12px 30px',
                    fontSize: '1.1rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setAboutOpen(true)}
                >
                  About Us
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* About Us Dialog */}
      <Dialog 
        open={aboutOpen} 
        onClose={handleAboutClose} 
        maxWidth="xl" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#000',
            color: 'white',
            borderRadius: '20px',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            maxHeight: '95vh',
            margin: '2.5vh auto',
            width: '95vw'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, 
          fontWeight: 'bold',
          pt: 4,
          pb: 2,
          position: 'relative'
        }}>
          {/* IDENTIFIER EXPECTED heading */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Orbitron', 'Arial Black', sans-serif",
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              color: '#FFD700',
              textAlign: 'center',
              letterSpacing: '0.1em',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
              mb: 3
            }}
          >
            IDENTIFIER EXPECTED
          </Typography>
          
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#E0E0E0',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              mb: 2
            }}
          >
            Meet Our Team
          </Typography>
          
          <IconButton 
            onClick={handleAboutClose} 
            sx={{ 
              position: 'absolute', 
              right: 16, 
              top: 16, 
              color: '#E0E0E0',
              backgroundColor: 'rgba(224, 224, 224, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                color: '#FFD700',
                transform: 'scale(1.1)'
              },
              width: 48,
              height: 48
            }}
          >
            <Close sx={{ fontSize: '1.5rem' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 4, md: 6 }, pt: 2 }}>
          {/* Team description */}
          <Typography
            variant="h6"
            sx={{
              color: '#E0E0E0',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto 4rem',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              opacity: 0.9
            }}
          >
            We are a passionate team of developers from MBCET, dedicated to creating innovative solutions 
            that help businesses unlock their true potential through data-driven insights.
          </Typography>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '16px',
                  transition: 'all 0.4s ease',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 25px 50px rgba(255, 215, 0, 0.5)',
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)'
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                    <Avatar
                      src={member.image}
                      alt={member.name}
                      sx={{ 
                        width: { xs: 80, sm: 100, md: 120 }, 
                        height: { xs: 80, sm: 100, md: 120 }, 
                        margin: '0 auto 16px',
                        border: '4px solid #FFD700',
                        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)'
                      }}
                    />
                    
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: '#E0E0E0',
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                    }}>
                      {member.name}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ 
                      color: '#FF8C00', 
                      mb: 1,
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      textShadow: '0 0 10px rgba(255, 140, 0, 0.7)'
                    }}>
                      {member.college}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ 
                      color: '#E0E0E0', 
                      mb: 2,
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      wordBreak: 'break-word',
                      opacity: 0.9
                    }}>
                      {member.email}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton 
                        href={member.linkedin} 
                        target="_blank"
                        sx={{ 
                          color: '#0077B5',
                          backgroundColor: 'rgba(0, 119, 181, 0.1)',
                          '&:hover': { 
                            backgroundColor: 'rgba(0, 119, 181, 0.2)',
                            transform: 'scale(1.2)',
                            boxShadow: '0 4px 15px rgba(0, 119, 181, 0.4)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <LinkedIn />
                      </IconButton>
                      
                      <IconButton 
                        href={member.github} 
                        target="_blank"
                        sx={{ 
                          color: '#E0E0E0',
                          backgroundColor: 'rgba(224, 224, 224, 0.1)',
                          '&:hover': { 
                            backgroundColor: 'rgba(224, 224, 224, 0.2)',
                            transform: 'scale(1.2)',
                            boxShadow: '0 4px 15px rgba(224, 224, 224, 0.4)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <GitHub />
                      </IconButton>
                      
                      <IconButton 
                        href={`mailto:${member.email}`}
                        sx={{ 
                          color: '#EF4444',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          '&:hover': { 
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            transform: 'scale(1.2)',
                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Email />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Header;