import ResultsPage from "./ResultsPage";
import React from "react";
import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function GamePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
      }}
    >
      {/* Left section for buttons */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Select Game Mode</h1>
        <Stack spacing={2} direction="column" sx={{ maxWidth: 250 }}>
            <Button
              variant="contained"
              color="primary"
              size="small" // ✅ smaller button
              sx={{ fontSize: "0.85rem", padding: "4px 10px" }}
              onClick={() => navigate("/computer")}
            >
            Play Against Computer
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            size="small" // ✅ smaller button
            sx={{ fontSize: "0.85rem", padding: "4px 10px" }}
            onClick={() => navigate("/opponent")}
          >
            Play Against Opponent
          </Button>
        </Stack>
      </div>

      {/* Right section for results */}
      <div
        style={{
          width: "400px",
          borderLeft: "1px solid #ccc",
        }}
      >
        <ResultsPage />
      </div>
    </div>
  );
}
