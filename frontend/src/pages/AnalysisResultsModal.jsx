import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import BusinessIcon from "@mui/icons-material/Business";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InsightsIcon from "@mui/icons-material/Insights";
import AssessmentIcon from "@mui/icons-material/Assessment";

// Styled Components
const GlassDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: "linear-gradient(135deg, rgba(30, 30, 50, 0.9), rgba(20, 20, 40, 0.95))",
    backdropFilter: "blur(20px)",
    borderRadius: theme.spacing(3),
    border: "1px solid rgba(100, 100, 150, 0.3)",
    maxWidth: "95vw",
    maxHeight: "95vh",
    color: "#fff",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5)",
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: "rgba(40, 40, 60, 0.4)",
  backdropFilter: "blur(12px)",
  borderRadius: theme.spacing(2.5),
  padding: theme.spacing(3),
  border: "1px solid rgba(255, 255, 255, 0.15)",
  color: "#fff",
  boxShadow: "0 8px 32px rgba(0, 0, 30, 0.3)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

// Circular Score Component
const CircularScore = ({ score, size = 120 }) => {
  const radius = size / 2 - 10;
  const circumference = radius * 2 * Math.PI;
  const dashArray = (score * circumference) / 100;
  
  const getColor = (score) => {
    if (score >= 70) return "#4CAF50";
    if (score >= 40) return "#FF9800";
    return "#F44336";
  };

  return (
    <Box position="relative" width={size} height={size}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dashArray} ${circumference}`}
          style={{
            transformOrigin: "center",
            transform: "rotate(-90deg)",
            transition: "stroke-dasharray 1s ease-in-out",
          }}
        />
      </svg>
      <Box position="absolute" top="50%" left="50%" sx={{ transform: "translate(-50%, -50%)" }}>
        <Typography variant="h4" fontWeight="bold" color="#fff" textAlign="center">
          {Math.round(score)}
        </Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.7)" textAlign="center">
          /100
        </Typography>
      </Box>
    </Box>
  );
};

// Simple Bar Chart
const SimpleBarChart = ({ data, height = 150 }) => {
  const maxValue = Math.max(...data.map(d => d.score), 1);
  
  return (
    <Box display="flex" alignItems="end" justifyContent="space-around" height={height} gap={1}>
      {data.map((item, index) => (
        <Box key={index} display="flex" flexDirection="column" alignItems="center" flex={1}>
          <Box
            sx={{
              width: "100%",
              maxWidth: 30,
              background: "linear-gradient(to top, #ff6f00, #ff9e00)",
              borderRadius: "3px 3px 0 0",
              transition: "height 0.8s ease-in-out",
              height: `${(item.score / maxValue) * (height - 40)}px`,
              minHeight: "5px",
            }}
          />
          <Typography variant="caption" sx={{ mt: 1, color: "#fff", fontSize: "0.6rem" }}>
            {item.topic.substring(0, 8)}
          </Typography>
          <Typography variant="caption" sx={{ color: "#ff9e00", fontWeight: "bold", fontSize: "0.7rem" }}>
            {item.score}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// Simple Line Chart
const SimpleLineChart = ({ data, height = 120 }) => {
  const values = data.map(d => d.sentiment);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * 100;
    const y = 100 - ((item.sentiment - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <Box height={height} position="relative">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="#ff9e00"
          strokeWidth="2"
          points={points}
          strokeLinecap="round"
        />
        <polygon
          fill="rgba(255, 158, 0, 0.2)"
          points={`${points} 100,100 0,100`}
        />
      </svg>
    </Box>
  );
};

const AnalysisResultsModal = ({ open, onClose, analysisResult }) => {
  if (!analysisResult) return null;

  const { company_info = {}, analysis_result = {} } = analysisResult;
  
  // Extract key metrics with defaults
  const {
    score = 50,
    sentiment = 'neutral',
    confidence_level = 'medium',
    positive_count = 0,
    negative_count = 0,
    neutral_count = 0,
    brand_awareness_score = 50,
    market_sentiment_score = 50,
    public_opinion_score = 50,
    most_positive = "No positive feedback found",
    most_negative = "No negative feedback found",
    key_insights = [],
    recommendations = [],
    topic_scores = [],
    trend_data = []
  } = analysis_result;

  const getSentimentIcon = (score) => {
    if (score >= 70) return <SentimentSatisfiedIcon sx={{ color: "#4CAF50", fontSize: 32 }} />;
    if (score >= 40) return <SentimentNeutralIcon sx={{ color: "#FF9800", fontSize: 32 }} />;
    return <SentimentDissatisfiedIcon sx={{ color: "#F44336", fontSize: 32 }} />;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#4CAF50";
    if (score >= 40) return "#FF9800";
    return "#F44336";
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return "Excellent";
    if (score >= 40) return "Good";
    return "Needs Work";
  };

  // Calculate sentiment distribution
  const total = positive_count + negative_count + neutral_count || 1;
  const sentimentData = [
    { name: 'Positive', value: Math.round((positive_count / total) * 100), color: '#4CAF50' },
    { name: 'Negative', value: Math.round((negative_count / total) * 100), color: '#F44336' },
    { name: 'Neutral', value: Math.round((neutral_count / total) * 100), color: '#9E9E9E' },
  ];

  return (
    <GlassDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{ p: 4 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <BusinessIcon sx={{ fontSize: 36, color: "#ff9e00" }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="#ff9e00">
                Brand Analysis Report
              </Typography>
              <Typography variant="h6" color="#fff" sx={{ opacity: 0.9 }}>
                {company_info.companyName || "Company Analysis"}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          {/* Overall Score */}
          <Grid item xs={12} md={4}>
            <GlassCard>
              <Box textAlign="center">
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Overall Score
                </Typography>
                <CircularScore score={score} />
                <Box mt={2}>
                  {getSentimentIcon(score)}
                </Box>
                <Chip
                  label={getScoreLabel(score)}
                  sx={{
                    bgcolor: getScoreColor(score),
                    color: "#fff",
                    fontWeight: "bold",
                    mt: 1,
                  }}
                />
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                  Confidence: {confidence_level}
                </Typography>
              </Box>
            </GlassCard>
          </Grid>

          {/* Sentiment Distribution */}
          <Grid item xs={12} md={4}>
            <GlassCard>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}>
                Sentiment Split
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {sentimentData.map((item, index) => (
                  <Box key={index}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{item.name}</Typography>
                      <Typography variant="body2" fontWeight="bold">{item.value}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.value}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(255,255,255,0.1)",
                        "& .MuiLinearProgress-bar": { 
                          bgcolor: item.color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </GlassCard>
          </Grid>

          {/* Key Metrics */}
          <Grid item xs={12} md={4}>
            <GlassCard>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}>
                Key Metrics
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {[
                  { label: "Brand Awareness", value: brand_awareness_score, color: "#4CAF50" },
                  { label: "Market Sentiment", value: market_sentiment_score, color: "#FF9800" },
                  { label: "Public Opinion", value: public_opinion_score, color: "#2196F3" }
                ].map((metric, index) => (
                  <Box key={index}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{metric.label}</Typography>
                      <Typography variant="body2" fontWeight="bold">{metric.value}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={metric.value}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.1)",
                        "& .MuiLinearProgress-bar": { 
                          bgcolor: metric.color,
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </GlassCard>
          </Grid>

          {/* Trend Chart */}
          {trend_data.length > 0 && (
            <Grid item xs={12} md={6}>
              <GlassCard>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <TrendingUpIcon sx={{ color: "#ff9e00" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Sentiment Trend
                  </Typography>
                </Box>
                <SimpleLineChart data={trend_data} />
              </GlassCard>
            </Grid>
          )}

          {/* Topic Analysis */}
          {topic_scores.length > 0 && (
            <Grid item xs={12} md={6}>
              <GlassCard>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <AssessmentIcon sx={{ color: "#ff9e00" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Topic Scores
                  </Typography>
                </Box>
                <SimpleBarChart data={topic_scores} />
              </GlassCard>
            </Grid>
          )}

          {/* Key Insights */}
          {key_insights.length > 0 && (
            <Grid item xs={12} md={6}>
              <GlassCard>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                  <InsightsIcon sx={{ color: "#ff9e00" }} />
                  Key Insights
                </Typography>
                <Box sx={{ 
                  background: "rgba(255,158,0,0.05)", 
                  borderRadius: 2, 
                  p: 2,
                  borderLeft: "3px solid #ff9e00"
                }}>
                  {key_insights.slice(0, 3).map((insight, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                      • {insight}
                    </Typography>
                  ))}
                </Box>
              </GlassCard>
            </Grid>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Grid item xs={12} md={6}>
              <GlassCard>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
                  <InsightsIcon sx={{ color: "#4CAF50" }} />
                  Recommendations
                </Typography>
                <Box sx={{ 
                  background: "rgba(76,175,80,0.05)", 
                  borderRadius: 2, 
                  p: 2,
                  borderLeft: "3px solid #4CAF50"
                }}>
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                      • {rec}
                    </Typography>
                  ))}
                </Box>
              </GlassCard>
            </Grid>
          )}

          {/* Key Comments */}
          <Grid item xs={12}>
            <GlassCard>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Key Feedback
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box p={2} sx={{ 
                    bgcolor: "rgba(76, 175, 80, 0.08)", 
                    borderRadius: 2,
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                  }}>
                    <Typography variant="subtitle2" color="#4CAF50" gutterBottom sx={{ fontWeight: 600 }}>
                      Most Positive
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontStyle: "italic" }}>
                      "{most_positive}"
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box p={2} sx={{ 
                    bgcolor: "rgba(244, 67, 54, 0.08)", 
                    borderRadius: 2,
                    border: "1px solid rgba(244, 67, 54, 0.3)",
                  }}>
                    <Typography variant="subtitle2" color="#F44336" gutterBottom sx={{ fontWeight: 600 }}>
                      Most Critical
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontStyle: "italic" }}>
                      "{most_negative}"
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </GlassCard>
          </Grid>

          {/* Company Info */}
          <Grid item xs={12}>
            <GlassCard>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Company Overview
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: "CEO", value: company_info.ceo },
                  { label: "Sector", value: company_info.sector },
                  { label: "Employees", value: company_info.employees },
                  { label: "Revenue", value: company_info.revenue ? `$${company_info.revenue}` : null },
                  { label: "Founded", value: company_info.year },
                  { label: "Country", value: company_info.country }
                ].filter(item => item.value).map((item, index) => (
                  <Grid item xs={6} sm={4} md={2} key={index}>
                    <Box textAlign="center" p={1.5} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>{item.label}</Typography>
                      <Typography variant="body1" color="#ff9e00" fontWeight="bold">
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                {company_info.isPublic && (
                  <Chip label="Public Company" sx={{ bgcolor: "rgba(76,175,80,0.2)", color: "#4CAF50" }} />
                )}
                {company_info.isStartup && (
                  <Chip label="Startup" sx={{ bgcolor: "rgba(233,30,99,0.2)", color: "#E91E63" }} />
                )}
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </DialogContent>
    </GlassDialog>
  );
};

export default AnalysisResultsModal;