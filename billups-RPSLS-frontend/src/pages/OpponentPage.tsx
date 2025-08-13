import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { endpoints } from "./apiConfig";
import ResultsPage from "./ResultsPage";

interface ChoicesResponse {
  id: number;
  name: string;
}

interface RoundHistory {
  playerChoice: number;
  opponentChoice: number | null;
  result: string;
}

export default function OpponentPage() {
  const [playerName, setPlayerName] = useState<string>("Unknown");
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [status, setStatus] = useState("Not connected");
  const [choices, setChoices] = useState<ChoicesResponse[]>([]);
  const [loadingChoices, setLoadingChoices] = useState(false);
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [roundHistory, setRoundHistory] = useState<RoundHistory[]>([]);
  const [currentMove, setCurrentMove] = useState<number | null>(null);
  const [resultsRefresh, setResultsRefresh] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("playerName") || "Unknown";
    setPlayerName(storedName);
  }, []);

  const joinGame = async () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(endpoints.gameHub, { withCredentials: false })
      .withAutomaticReconnect()
      .build();

    hubConnection.on("WaitingForOpponent", () => {
      setStatus("Waiting for opponent...");
    });

    hubConnection.on("GameStarted", async (message: string) => {
      setStatus(message);
      await fetchChoices();
    });

    hubConnection.on("RoundResult", (round: RoundHistory) => {
      setRoundResult(round.result);

      setRoundHistory((prev) => {
        return [...prev, round].slice(-5);
      });

      setCurrentMove(null);

      setResultsRefresh((prev) => prev + 1);
    });

    hubConnection.on("WaitingForOpponentMove", () => {
      setRoundResult("Waiting for opponent's move...");
    });

    try {
      await hubConnection.start();
      setConnection(hubConnection);
      setStatus("Joining game...");
    } catch (err) {
      console.error(err);
      setStatus("Failed to connect");
    }
  };

  const fetchChoices = async () => {
    setLoadingChoices(true);
    try {
      const response = await fetch(endpoints.getChoices);
      if (!response.ok) throw new Error("Failed to fetch choices");
      const data: ChoicesResponse[] = await response.json();
      setChoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChoices(false);
    }
  };

  const playChoice = async (choiceId: number) => {
    if (!connection) return;

    setCurrentMove(choiceId);

    await connection.invoke("SendMove", {
      Player: choiceId,
      PlayerName: playerName,
    });

    setRoundResult("Move sent. Waiting for opponent...");
  };

  const returnToMain = () => {
    connection?.stop();
    setConnection(null);
    setChoices([]);
    setStatus("Not connected");
    setRoundResult(null);
    setRoundHistory([]);
    setCurrentMove(null);
    navigate("/");
  };

  const getChoiceName = (id: number | null) => {
    if (id === null) return "Unknown";
    const choice = choices.find((c) => c.id === id);
    return choice ? choice.name : `Unknown (${id})`;
  };

  return (
    <Box sx={{ display: "flex", gap: 4, padding: 2, alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
            Playing against the real opponent as {playerName}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
                variant="outlined"
                color="secondary"
                onClick={returnToMain}
            >
                Return to Game Page
            </Button>

            {!connection && (
                <Button
                variant="contained"
                color="primary"
                onClick={joinGame}
                >
                Join Game
                </Button>
            )}
            </Box>

        <Typography sx={{ mt: 2 }}>{status}</Typography>
        {roundResult && (
          <Typography sx={{ mt: 1, color: "green" }}>{roundResult}</Typography>
        )}

        {loadingChoices && <CircularProgress sx={{ mt: 2 }} />}

        {choices.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 2, width: 400 }}>
                <Table size="small">
                <TableHead>
                    <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Play</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {choices.map((choice) => (
                    <TableRow key={choice.id}>
                        <TableCell>{choice.id}</TableCell>
                        <TableCell>{choice.name}</TableCell>
                        <TableCell>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => playChoice(choice.id)}
                        >
                            Play
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        )}

        {roundHistory.length > 0 && (
            <TableContainer component={Paper} sx={{ mt: 2, width: 400 }}>
                <Typography variant="subtitle1" sx={{ m: 1 }}>
                Last 5 Rounds
                </Typography>
                <Table size="small">
                <TableHead>
                    <TableRow>
                    <TableCell>Player Choice</TableCell>
                    <TableCell>Opponent Choice</TableCell>
                    <TableCell>Result</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roundHistory.map((round, index) => (
                    <TableRow key={index}>
                        <TableCell>{getChoiceName(round.playerChoice)}</TableCell>
                        <TableCell>{getChoiceName(round.opponentChoice)}</TableCell>
                        <TableCell>{round.result}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            )}
        </Box>

        <Box sx={{ width: 400 }}>
            <ResultsPage refreshTrigger={resultsRefresh} />
        </Box>
    </Box>
  );
}
