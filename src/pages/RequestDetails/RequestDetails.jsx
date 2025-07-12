import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";

const RequestDetails = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Request Details (Mock)
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Overview" />
        <Tab label="More Info" />
      </Tabs>

      {tab === 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography>Overview content: This is a mock request.</Typography>
        </Box>
      )}

      {tab === 1 && (
        <Box sx={{ mt: 2 }}>
          <Typography>More Info: Mock extra request data.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default RequestDetails;
