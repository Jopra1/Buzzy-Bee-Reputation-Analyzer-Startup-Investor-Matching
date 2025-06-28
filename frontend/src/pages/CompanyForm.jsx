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
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/info-enter-bg.jpg";
import AnalysisResultsModal from "./AnalysisResultsModal";

const BackgroundWrapper = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  background: `url(${bgImg}) center/cover no-repeat`,
  zIndex: -1,
  filter: "brightness(0.6)",
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

const fundingRanges = [
  "Less than 1 Cr",
  "1 - 5 Cr",
  "5 - 10 Cr",
  "10 - 50 Cr",
  "50 - 100 Cr",
  "100 - 500 Cr",
  "500 - 1000 Cr",
  "1000+ Cr",
];

const employeeRanges = [
  "Less than 10",
  "10 - 50",
  "51 - 200",
  "201 - 500",
  "501 - 1000",
  "1001 - 5000",
  "5001+",
];

const CompanyForm = () => {
  const navigate = useNavigate();

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
    pitchDeck: "", // 👈 NEW FIELD
    contactInfo: "",
    fundingRange: "",
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
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setAnalysisResult(data);
      setShowResultsModal(true);
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <BackgroundWrapper />

      <Button
        onClick={() => navigate("/choose-role")}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 100,
          bgcolor: "#ff6f00",
          color: "white",
          fontWeight: "bold",
          '&:hover': { bgcolor: "#e65100" },
        }}
      >
        ← Back
      </Button>

      <Container maxWidth="sm" sx={{ mt: 12 }}>
        <GlassCard elevation={5}>
          <Typography variant="h4" align="center" fontWeight="bold" color="orange" gutterBottom>
            Company Information
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            <TextField name="companyName" label="Company Name" variant="filled" required fullWidth value={formData.companyName} onChange={handleChange} InputLabelProps={{ style: { color: "#fff" } }} InputProps={{ style: { color: "#fff" } }} disabled={loading} />
            <TextField name="ceo" label="CEO Name" variant="filled" required fullWidth value={formData.ceo} onChange={handleChange} InputLabelProps={{ style: { color: "#fff" } }} InputProps={{ style: { color: "#fff" } }} disabled={loading} />
            <TextField name="country" label="Country" variant="filled" required fullWidth value={formData.country} onChange={handleChange} InputLabelProps={{ style: { color: "#fff" } }} InputProps={{ style: { color: "#fff" } }} disabled={loading} />

            <FormControl fullWidth variant="filled">
              <InputLabel sx={{ color: "#fff" }}>Sector</InputLabel>
              <Select name="sector" value={formData.sector} onChange={handleChange} sx={{ color: "#fff" }} disabled={loading}>
                {sectors.map((sector, idx) => (
                  <MenuItem key={idx} value={sector}>{sector}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField name="revenue" label="Revenue (USD)" variant="filled" required fullWidth value={formData.revenue} onChange={handleChange} InputLabelProps={{ style: { color: "#fff" } }} InputProps={{ style: { color: "#fff" } }} disabled={loading} />

            <FormControl fullWidth variant="filled">
              <InputLabel sx={{ color: "#fff" }}>Number of Employees</InputLabel>
              <Select name="employees" value={formData.employees} onChange={handleChange} sx={{ color: "#fff" }} disabled={loading}>
                {employeeRanges.map((range, i) => (
                  <MenuItem key={i} value={range}>{range}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField name="year" label="Year of Establishment" variant="filled" required fullWidth value={formData.year} onChange={handleChange} InputLabelProps={{ style: { color: "#fff" } }} InputProps={{ style: { color: "#fff" } }} disabled={loading} />

            {formData.isPublic && (
              <TextField name="ticker" label="Stock Ticker Symbol" variant="filled" fullWidth value={formData.ticker} onChange={handleChange} InputLabelProps={{ style: { color: "#fff" } }} InputProps={{ style: { color: "#fff" } }} disabled={loading} />
            )}

            <TextField name="links" label="Relevant Links (optional)" variant="filled" fullWidth value={formData.links} onChange={handleChange} InputLabelProps={{ style: { color: "#fff" } }} InputProps={{ style: { color: "#fff" } }} disabled={loading} />

            <FormControlLabel control={<Switch checked={formData.isPublic} onChange={handleChange} name="isPublic" color="secondary" disabled={loading} />} label="Are you a publicly listed company?" sx={{ color: "#fff" }} />
            <FormControlLabel control={<Switch checked={formData.isStartup} onChange={handleChange} name="isStartup" color="secondary" disabled={loading} />} label="Are you a startup?" sx={{ color: "#fff" }} />

            {formData.isStartup && (
              <>
                <FormControl fullWidth variant="filled">
                  <InputLabel sx={{ color: "#fff" }}>Funding Range</InputLabel>
                  <Select name="fundingRange" value={formData.fundingRange} onChange={handleChange} sx={{ color: "#fff" }} disabled={loading}>
                    {fundingRanges.map((range, i) => (
                      <MenuItem key={i} value={range}>{range}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="#fff" mb={1}>
                    Pitch Deck
                  </Typography>
                  <TextField
                    name="pitchDeck"
                    placeholder="Provide a short summary of your startup idea, product, or service."
                    multiline
                    rows={5}
                    fullWidth
                    variant="filled"
                    value={formData.pitchDeck}
                    onChange={handleChange}
                    InputLabelProps={{ style: { color: "#fff" } }}
                    InputProps={{ style: { color: "#fff" } }}
                    disabled={loading}
                  />
                </Box>

                <TextField name="contactInfo" label="Contact Email" variant="filled" fullWidth value={formData.contactInfo} onChange={handleChange} InputLabelProps={{ style: { color: "#fff" } }} InputProps={{ style: { color: "#fff" } }} disabled={loading} />
              </>
            )}

            <Button type="submit" variant="contained" color="secondary" size="large" disabled={loading} sx={{ fontWeight: "bold", padding: "12px", mt: 2, bgcolor: "#ff6f00", '&:hover': { bgcolor: "#e65100" }, '&:disabled': { bgcolor: "#666" } }}>
              {loading ? <><CircularProgress size={24} sx={{ mr: 1, color: "#fff" }} /> Analyzing...</> : "Analyze"}
            </Button>
          </Box>
        </GlassCard>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="error" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>{error}</Alert>
        </Snackbar>

        <AnalysisResultsModal open={showResultsModal} onClose={() => setShowResultsModal(false)} analysisResult={analysisResult} />
      </Container>
    </>
  );
};

export default CompanyForm;
