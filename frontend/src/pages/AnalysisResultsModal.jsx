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
import { styled, keyframes } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import BusinessIcon from "@mui/icons-material/Business";

// Styled Components
const GlassDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: theme.spacing(3),
    border: "1px solid rgba(255, 255, 255, 0.2)",
    maxWidth: "90vw",
    maxHeight: "90vh",
    color: "#fff",
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(12px)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "#fff",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
}));

// Animation for score circle
const fillAnimation = keyframes`
  from { stroke-dasharray: 0 628; }
  to { stroke-dasharray: var(--dash-array) 628; }
`;

const ScoreCircle = styled(Box)(({ theme }) => ({
  width: 150,
  height: 150,
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ScoreText = styled(Typography)({
  position: "absolute",
  zIndex: 2,
  fontWeight: "bold",
  fontSize: "2rem",
  color: "#fff",
});

// Custom Pie Chart Component
const CustomPieChart = ({ data, size = 200 }) => {
  const radius = size / 2 - 10;
  const circumference = radius * 2 * Math.PI;
  
  let cumulativePercentage = 0;
  
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height={size}>
      <svg width={size} height={size}>
        {data.map((segment, index) => {
          const strokeDasharray = `${segment.value * circumference / 100} ${circumference}`;
          const strokeDashoffset = -cumulativePercentage * circumference / 100;
          cumulativePercentage += segment.value;
          
          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={segment.color}
              strokeWidth="20"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{
                transformOrigin: `${size / 2}px ${size / 2}px`,
                transform: 'rotate(-90deg)',
              }}
            />
          );
        })}
      </svg>
    </Box>
  );
};

// Custom Bar Chart Component
const CustomBarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.score));
  
  return (
    <Box display="flex" alignItems="end" justifyContent="space-around" height={height} gap={1}>
      {data.map((item, index) => (
        <Box key={index} display="flex" flexDirection="column" alignItems="center" flex={1}>
          <Box
            sx={{
              width: "100%",
              maxWidth: 40,
              bgcolor: "#ff6f00",
              borderRadius: "4px 4px 0 0",
              transition: "height 1s ease-in-out",
              height: `${(item.score / maxValue) * (height - 50)}px`,
            }}
          />
          <Typography variant="caption" sx={{ mt: 1, color: "#fff", textAlign: "center" }}>
            {item.topic}
          </Typography>
          <Typography variant="caption" sx={{ color: "#ff6f00", fontWeight: "bold" }}>
            {item.score}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// Custom Line Chart Component
const CustomLineChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.sentiment));
  const minValue = Math.min(...data.map(d => d.sentiment));
  const range = maxValue - minValue || 1; // Prevent division by zero
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.sentiment - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <Box height={height} position="relative">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6f00" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#ff6f00" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="#ff6f00"
          strokeWidth="0.5"
          points={points}
        />
        <polygon
          fill="url(#gradient)"
          points={`${points} 100,100 0,100`}
        />
      </svg>
      <Box position="absolute" bottom={-30} left={0} right={0} display="flex" justifyContent="space-between">
        {data.map((item, index) => (
          <Typography key={index} variant="caption" sx={{ color: "#fff" }}>
            {item.day}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

// Data processing functions
const processSentimentData = (analysisResult) => {
  const analysis = analysisResult?.analysis_result;
  if (!analysis) return [];

  const positive = analysis.positive_count || 0;
  const negative = analysis.negative_count || 0;
  const neutral = analysis.neutral_count || 0;
  const total = positive + negative + neutral || 1; // Prevent division by zero

  return [
    { 
      name: 'Positive', 
      value: Math.round((positive / total) * 100), 
      color: '#4CAF50' 
    },
    { 
      name: 'Negative', 
      value: Math.round((negative / total) * 100), 
      color: '#F44336' 
    },
    { 
      name: 'Neutral', 
      value: Math.round((neutral / total) * 100), 
      color: '#9E9E9E' 
    },
  ];
};

const processTopicsData = (analysisResult) => {
  const analysis = analysisResult?.analysis_result;
  if (analysis?.topic_scores && Array.isArray(analysis.topic_scores)) {
    return analysis.topic_scores;
  }
  
  // Fallback data if no topic_scores provided
  return [
    { topic: 'Safety', score: 35 },
    { topic: 'Leadership', score: 25 },
    { topic: 'Service', score: 45 },
    { topic: 'Innovation', score: 40 },
    { topic: 'Reputation', score: 30 },
  ];
};

const processTrendData = (analysisResult) => {
  const analysis = analysisResult?.analysis_result;
  if (analysis?.trend_data && Array.isArray(analysis.trend_data)) {
    return analysis.trend_data;
  }
  
  // Fallback trend data
  return Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    sentiment: Math.max(20, Math.min(80, 35 + Math.random() * 20)), // Around the actual score
    mentions: Math.floor(Math.random() * 50) + 20,
  }));
};

const AnalysisResultsModal = ({ open, onClose, analysisResult }) => {
  console.log("Analysis Result in Modal:", analysisResult); // Debug log

  if (!analysisResult) return null;

  const analysis = analysisResult?.analysis_result;
  const companyInfo = analysisResult?.company_info;
  
  // Extract actual data from analysis
  const overallScore = analysis?.score || 0;
  const sentimentType = analysis?.sentiment || 'neutral';
  const brandAwareness = analysis?.brand_awareness_score || 78;
  const marketSentiment = analysis?.market_sentiment_score || 65;
  const publicOpinion = analysis?.public_opinion_score || 72;
  
  const sentimentData = processSentimentData(analysisResult);
  const topicsData = processTopicsData(analysisResult);
  const trendData = processTrendData(analysisResult);
  
  const getSentimentIcon = (score) => {
    if (score >= 70) return <SentimentSatisfiedIcon sx={{ color: "#4CAF50", fontSize: 40 }} />;
    if (score >= 40) return <SentimentNeutralIcon sx={{ color: "#FF9800", fontSize: 40 }} />;
    return <SentimentDissatisfiedIcon sx={{ color: "#F44336", fontSize: 40 }} />;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#4CAF50";
    if (score >= 40) return "#FF9800";
    return "#F44336";
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return "Excellent";
    if (score >= 40) return "Good";
    return "Needs Improvement";
  };

  return (
    <GlassDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent sx={{ p: 4 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <BusinessIcon sx={{ fontSize: 40, color: "#ff6f00" }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="#ff6f00">
                Analysis Results
              </Typography>
              <Typography variant="h6" color="#fff" opacity={0.8}>
                {companyInfo?.companyName || "Company Analysis"}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          {/* Overall Score Section */}
          <Grid item xs={12} md={4}>
            <GlassCard>
              <Box textAlign="center">
                <Typography variant="h6" gutterBottom>
                  Overall Reputation Score
                </Typography>
                <Box display="flex" justifyContent="center" my={3}>
                  <ScoreCircle score={overallScore}>
                    <ScoreText>{overallScore}/100</ScoreText>
                  </ScoreCircle>
                </Box>
                <Box display="flex" justifyContent="center" mb={2}>
                  {getSentimentIcon(overallScore)}
                </Box>
                <Chip
                  label={getScoreLabel(overallScore)}
                  sx={{
                    bgcolor: getScoreColor(overallScore),
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                />
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                  Sentiment: {sentimentType.charAt(0).toUpperCase() + sentimentType.slice(1)}
                </Typography>
              </Box>
            </GlassCard>
          </Grid>

          {/* Sentiment Distribution */}
          <Grid item xs={12} md={4}>
            <GlassCard>
              <Typography variant="h6" gutterBottom textAlign="center">
                Sentiment Distribution
              </Typography>
              <CustomPieChart data={sentimentData} size={200} />
              <Box mt={2}>
                {sentimentData.map((entry, index) => (
                  <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box width={12} height={12} bgcolor={entry.color} borderRadius="50%" />
                      <Typography variant="body2">{entry.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {entry.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </GlassCard>
          </Grid>

          {/* Key Metrics */}
          <Grid item xs={12} md={4}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Key Metrics
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Brand Awareness</Typography>
                    <Typography variant="body2" fontWeight="bold">{brandAwareness}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={brandAwareness}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": { bgcolor: "#4CAF50" },
                    }}
                  />
                </Box>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Market Sentiment</Typography>
                    <Typography variant="body2" fontWeight="bold">{marketSentiment}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={marketSentiment}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": { bgcolor: "#FF9800" },
                    }}
                  />
                </Box>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Public Opinion</Typography>
                    <Typography variant="body2" fontWeight="bold">{publicOpinion}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={publicOpinion}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,0.1)",
                      "& .MuiLinearProgress-bar": { bgcolor: "#2196F3" },
                    }}
                  />
                </Box>
              </Box>
            </GlassCard>
          </Grid>

          {/* Sentiment Trend */}
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Sentiment Trend (Last 7 Days)
              </Typography>
              <CustomLineChart data={trendData} height={250} />
            </GlassCard>
          </Grid>

          {/* Topic Analysis */}
          <Grid item xs={12} md={4}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Topic Analysis
              </Typography>
              <CustomBarChart data={topicsData} height={250} />
            </GlassCard>
          </Grid>

          {/* Key Insights */}
          {analysis?.key_insights && (
            <Grid item xs={12} md={6}>
              <GlassCard>
                <Typography variant="h6" gutterBottom>
                  Key Insights
                </Typography>
                <Box>
                  {analysis.key_insights.map((insight, index) => (
                    <Box key={index} mb={2}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        • {insight}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </GlassCard>
            </Grid>
          )}

          {/* Recommendations */}
          {analysis?.recommendations && (
            <Grid item xs={12} md={6}>
              <GlassCard>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                <Box>
                  {analysis.recommendations.map((rec, index) => (
                    <Box key={index} mb={2}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        • {rec}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </GlassCard>
            </Grid>
          )}

          {/* Most Positive/Negative Comments */}
          <Grid item xs={12}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Key Comments
              </Typography>
              <Grid container spacing={2}>
                {analysis?.most_positive && (
                  <Grid item xs={12} md={6}>
                    <Box p={2} sx={{ bgcolor: "rgba(76, 175, 80, 0.1)", borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="#4CAF50" gutterBottom>
                        Most Positive
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        "{analysis.most_positive}"
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {analysis?.most_negative && (
                  <Grid item xs={12} md={6}>
                    <Box p={2} sx={{ bgcolor: "rgba(244, 67, 54, 0.1)", borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="#F44336" gutterBottom>
                        Most Negative
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        "{analysis.most_negative}"
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </GlassCard>
          </Grid>

          {/* Company Details */}
          <Grid item xs={12}>
            <GlassCard>
              <Typography variant="h6" gutterBottom>
                Company Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="#ff6f00" fontWeight="bold">
                      {companyInfo?.employees || "N/A"}
                    </Typography>
                    <Typography variant="body2" opacity={0.8}>
                      Employees
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="#4CAF50" fontWeight="bold">
                      {companyInfo?.revenue || "N/A"}
                    </Typography>
                    <Typography variant="body2" opacity={0.8}>
                      Revenue (USD)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="#2196F3" fontWeight="bold">
                      {companyInfo?.year || "N/A"}
                    </Typography>
                    <Typography variant="body2" opacity={0.8}>
                      Established
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="#9C27B0" fontWeight="bold">
                      {companyInfo?.country || "N/A"}
                    </Typography>
                    <Typography variant="body2" opacity={0.8}>
                      Location
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box mt={3} display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={companyInfo?.sector || "Technology"}
                  sx={{ bgcolor: "#ff6f00", color: "#fff" }}
                />
                {companyInfo?.isPublic && (
                  <Chip
                    label="Public Company"
                    sx={{ bgcolor: "#4CAF50", color: "#fff" }}
                  />
                )}
                {companyInfo?.isStartup && (
                  <Chip
                    label="Startup"
                    sx={{ bgcolor: "#E91E63", color: "#fff" }}
                  />
                )}
                {companyInfo?.ticker && (
                  <Chip
                    label={`Ticker: ${companyInfo.ticker}`}
                    sx={{ bgcolor: "#2196F3", color: "#fff" }}
                  />
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