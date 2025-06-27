import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CssBaseline,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import bgImg from "../assets/info-enter-bg.jpg";
import AnalysisResultsModal from "./AnalysisResultsModal";

// 🎨 Optional: animated or image background container
const BackgroundWrapper = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  background: `url(${bgImg}) center/cover no-repeat`,
  zIndex: -1,
  filter: "brightness(0.6)", // optional: darken the bg to contrast white text
});

const GlassCard = styled(Paper)(({ theme }) => ({
  backdropFilter: "blur(12px)",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: theme.spacing(3),
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  color: "#fff",
  padding: theme.spacing(4),
  border: "1px solid rgba(255, 255, 255, 0.18)",
}));

const sectors = [
  "Technology (Tech & Software)",
  "Financial Services",
  "Healthcare",
  "Consumer Goods & Retail",
  "Manufacturing & Industrials",
  "Energy & Utilities",
  "Real Estate & Construction",
  "Media & Entertainment",
  "Transportation & Logistics",
  "Professional & Business Services",
  "Education",
  "Agriculture & Natural Resources",
  "Hospitality & Tourism",
  "Government & Public Sector",
  "Other",
];

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    sector: "",
    revenue: "",
    ceo: "",
    employees: "",
    year: "",
    ticker: "",
    links: "",
    isPublic: false,
    isStartup: false,
  });

  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.companyName.trim()) {
      setError("Company name is required");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    setError("");
    setAnalysisResult(null);

    try {
      // Make API call to backend
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data);
      console.log("Analysis Result:", data);
      
      // Show the results modal instead of just logging
      setShowResultsModal(true);
      
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(`Analysis failed: ${err.message}`);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseResultsModal = () => {
    setShowResultsModal(false);
  };

  return (
    <>
      <CssBaseline />
      <BackgroundWrapper />
      <Container maxWidth="sm" sx={{ mt: 12 }}>
        <GlassCard elevation={5}>
          <Typography variant="h4" align="center" fontWeight="bold" color="orange" gutterBottom>
            Company Information
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
          >
            <TextField 
              label="Company Name" 
              name="companyName" 
              variant="filled" 
              required 
              fullWidth 
              value={formData.companyName} 
              onChange={handleChange} 
              InputLabelProps={{ style: { color: "#fff" } }} 
              InputProps={{ style: { color: "#fff" } }}
              disabled={loading}
            />
            
            <TextField 
              label="CEO Name" 
              name="ceo" 
              variant="filled" 
              required 
              fullWidth 
              value={formData.ceo} 
              onChange={handleChange} 
              InputLabelProps={{ style: { color: "#fff" } }} 
              InputProps={{ style: { color: "#fff" } }}
              disabled={loading}
            />
            
            <TextField 
              label="Country" 
              name="country" 
              variant="filled" 
              required 
              fullWidth 
              value={formData.country} 
              onChange={handleChange} 
              InputLabelProps={{ style: { color: "#fff" } }} 
              InputProps={{ style: { color: "#fff" } }}
              disabled={loading}
            />
            
            <FormControl fullWidth variant="filled">
              <InputLabel sx={{ color: "#fff" }}>Sector</InputLabel>
              <Select
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                disabled={loading}
                sx={{
                  color: "#fff",
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                {sectors.map((sector, idx) => (
                  <MenuItem key={idx} value={sector}>
                    {sector}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField 
              label="Revenue (USD)" 
              name="revenue" 
              variant="filled" 
              required 
              fullWidth 
              value={formData.revenue} 
              onChange={handleChange} 
              InputLabelProps={{ style: { color: "#fff" } }} 
              InputProps={{ style: { color: "#fff" } }}
              disabled={loading}
            />
            
            <TextField 
              label="Number of Employees" 
              name="employees" 
              variant="filled" 
              required 
              fullWidth 
              value={formData.employees} 
              onChange={handleChange} 
              InputLabelProps={{ style: { color: "#fff" } }} 
              InputProps={{ style: { color: "#fff" } }}
              disabled={loading}
            />
            
            <TextField 
              label="Year of Establishment" 
              name="year" 
              variant="filled" 
              required 
              fullWidth 
              value={formData.year} 
              onChange={handleChange} 
              InputLabelProps={{ style: { color: "#fff" } }} 
              InputProps={{ style: { color: "#fff" } }}
              disabled={loading}
            />
            
            <TextField 
              label="Stock Ticker Symbol" 
              name="ticker" 
              variant="filled" 
              fullWidth 
              value={formData.ticker} 
              onChange={handleChange} 
              InputLabelProps={{ style: { color: "#fff" } }} 
              InputProps={{ style: { color: "#fff" } }}
              disabled={loading}
            />
            
            <TextField 
              label="Relevant Links (optional)" 
              name="links" 
              variant="filled" 
              fullWidth 
              value={formData.links} 
              onChange={handleChange} 
              InputLabelProps={{ style: { color: "#fff" } }} 
              InputProps={{ style: { color: "#fff" } }}
              disabled={loading}
            />

            {/* Toggles */}
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.isPublic} 
                  onChange={handleChange} 
                  name="isPublic" 
                  color="secondary"
                  disabled={loading}
                />
              }
              label="Are you a publicly listed company?"
              sx={{ color: "#fff" }}
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.isStartup} 
                  onChange={handleChange} 
                  name="isStartup" 
                  color="secondary"
                  disabled={loading}
                />
              }
              label="Are you a startup?"
              sx={{ color: "#fff" }}
            />

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              sx={{
                fontWeight: "bold",
                padding: "12px",
                mt: 2,
                bgcolor: "#ff6f00",
                '&:hover': { bgcolor: "#e65100" },
                '&:disabled': { bgcolor: "#666" },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1, color: "#fff" }} />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </Box>
        </GlassCard>

        {/* Snackbar for notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="error"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Results Modal */}
        <AnalysisResultsModal 
          open={showResultsModal}
          onClose={handleCloseResultsModal}
          analysisResult={analysisResult}
        />
      </Container>
    </>
  );
};

export default CompanyForm;