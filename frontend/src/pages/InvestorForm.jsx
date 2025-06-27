import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CssBaseline,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SelectCountry from "react-select";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import investorBg from "../assets/info-enter-bg.jpg";

countries.registerLocale(enLocale);
const countryOptions = Object.entries(countries.getNames("en", { select: "official" })).map(
  ([code, name]) => ({
    value: code,
    label: name,
  })
);

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

const Background = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: `linear-gradient(rgba(0, 0, 50, 0.7), rgba(0, 0, 50, 0.7)), url(${investorBg}) center/cover no-repeat`,
  zIndex: -1,
});

const GlassCard = styled(Paper)(({ theme }) => ({
  backdropFilter: "blur(12px)",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: theme.spacing(3),
  boxShadow: "0 8px 32px 0 rgba(0, 191, 255, 0.4)",
  color: "#fff",
  padding: theme.spacing(4),
  border: "1px solid rgba(255, 255, 255, 0.2)",
}));

const InvestorSearch = () => {
  const [sector, setSector] = useState("");
  const [funding, setFunding] = useState("");
  const [employees, setEmployees] = useState("");
  const [country, setCountry] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("Investor Filters:", {
      sector,
      funding,
      employees,
      country: country?.label || "",
    });
    // TODO: Fetch matching companies
  };

  return (
    <>
      <CssBaseline />
      <Background />
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
        <GlassCard>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
            Find Companies to Invest In
          </Typography>

          <Grid container spacing={3} mt={1} direction="column">
            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel sx={{ color: "#fff" }}>Sector</InputLabel>
                <Select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  sx={{ color: "#fff" }}
                >
                  {sectors.map((item, i) => (
                    <MenuItem key={i} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel sx={{ color: "#fff" }}>Funding Range</InputLabel>
                <Select
                  value={funding}
                  onChange={(e) => setFunding(e.target.value)}
                  sx={{ color: "#fff" }}
                >
                  {fundingRanges.map((item, i) => (
                    <MenuItem key={i} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth variant="filled">
                <InputLabel sx={{ color: "#fff" }}>Employee Range</InputLabel>
                <Select
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  sx={{ color: "#fff" }}
                >
                  {employeeRanges.map((item, i) => (
                    <MenuItem key={i} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <SelectCountry
                options={countryOptions}
                value={country}
                onChange={setCountry}
                isClearable
                placeholder="Select or type a country..."
                styles={{
                  control: (base) => ({ ...base, backgroundColor: "rgba(255,255,255,0.1)", color: "#fff" }),
                  menu: (base) => ({ ...base, backgroundColor: "#1e1e2f", color: "#fff" }),
                  singleValue: (base) => ({ ...base, color: "#fff" }),
                  input: (base) => ({ ...base, color: "#fff" }),
                  placeholder: (base) => ({ ...base, color: "#ccc" }),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  fontWeight: "bold",
                  bgcolor: "#00bcd4",
                  color: "white",
                  '&:hover': { bgcolor: "#008ba3" },
                }}
                onClick={handleSubmit}
              >
                Search Companies
              </Button>
            </Grid>
          </Grid>
        </GlassCard>
      </Container>
    </>
  );
};

export default InvestorSearch;
