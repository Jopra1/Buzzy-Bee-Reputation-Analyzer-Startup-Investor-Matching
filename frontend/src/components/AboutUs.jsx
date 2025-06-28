import React from "react";
import { Container, Grid, Typography, Card, CardContent, Avatar, IconButton, Stack, Box } from "@mui/material";
import { LinkedIn, GitHub, Email, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
    image: adhithyaImg,
    role: "Full Stack Developer"
  },
  {
    name: "Anand Pillai",
    email: "pillaianand2003@gmail.com",
    college: "MBCET", 
    linkedin: "https://www.linkedin.com/in/anand-pillai22",
    github: "https://github.com/anandPILLAI04",
    image: anandImg,
    role: "Backend Developer"
  },
  {
    name: "Joel Prasad",
    email: "joelprasad03@gmail.com",
    college: "MBCET",
    linkedin: "https://linkedin.com/in/joelpra/", 
    github: "https://github.com/Jopra1",
    image: joelImg,
    role: "Frontend Developer"
  },
  {
    name: "Shiv Sanjay", 
    email: "shivsa543@gmail.com",
    college: "MBCET",
    linkedin: "https://www.linkedin.com/in/shiv-sanjay-87a638256",
    github: "https://github.com/Shivsay",
    image: shivImg,
    role: "Project Lead"
  }
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7))',
      backgroundColor: '#000',
      py: 8
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              position: 'absolute',
              top: 32,
              left: 32,
              color: '#FFD700',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                transform: 'scale(1.1)'
              }
            }}
          >
            <ArrowBack />
          </IconButton>

          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Orbitron', 'Arial Black', sans-serif",
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              color: '#FFD700',
              letterSpacing: '0.1em',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
              mb: 2
            }}
          >
            IDENTIFIER EXPECTED
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#E0E0E0',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              mb: 3
            }}
          >
            Meet Our Team
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#E0E0E0',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
              opacity: 0.9
            }}
          >
            We are a passionate team of developers from MBCET, dedicated to creating innovative solutions 
            that help businesses unlock their true potential through data-driven insights.
          </Typography>
        </Box>

        {/* Team Members Grid */}
        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '16px',
                transition: 'all 0.4s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 25px 50px rgba(255, 215, 0, 0.4)',
                  borderColor: '#FFD700',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)'
                }
              }}>
                <CardContent sx={{ 
                  textAlign: 'center', 
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%'
                }}>
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 3,
                      border: '4px solid #FFD700',
                      boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)'
                    }}
                  />

                  <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    color: '#E0E0E0',
                    mb: 1,
                    textAlign: 'center'
                  }}>
                    {member.name}
                  </Typography>

                  <Typography variant="subtitle1" sx={{
                    color: '#FF8C00',
                    fontWeight: 600,
                    mb: 1,
                    textShadow: '0 0 10px rgba(255, 140, 0, 0.7)'
                  }}>
                    {member.role}
                  </Typography>

                  <Typography variant="body2" sx={{
                    color: '#E0E0E0',
                    mb: 2,
                    fontWeight: 500,
                    opacity: 0.8
                  }}>
                    {member.college}
                  </Typography>

                  <Typography variant="body2" sx={{
                    color: '#E0E0E0',
                    mb: 3,
                    fontSize: '0.9rem',
                    wordBreak: 'break-all',
                    opacity: 0.9
                  }}>
                    {member.email}
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                    <IconButton
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      rel="noopener noreferrer"
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

        {/* Project Info Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Card sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{
                fontWeight: 'bold',
                color: '#FFD700',
                mb: 3,
                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
              }}>
                About Buzzy Bee
              </Typography>
              
              <Typography variant="body1" sx={{
                color: '#E0E0E0',
                lineHeight: 1.8,
                maxWidth: '800px',
                margin: '0 auto',
                opacity: 0.9
              }}>
                Buzzy Bee is an innovative business analytics platform designed to help companies 
                gain deep insights into their brand performance and market perception. Our team 
                from MBCET has developed this solution to empower businesses with data-driven 
                decision making capabilities, enabling them to unlock their true potential in 
                today's competitive market landscape.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;