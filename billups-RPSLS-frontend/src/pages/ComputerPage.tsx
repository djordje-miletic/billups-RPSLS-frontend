import React, { useState, useEffect } from "react";
import {
	Button,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { endpoints } from "./apiConfig";
import ResultsPage from "./ResultsPage";

interface ChoicesResponse {
	id: number;
	name: string;
}

interface PlayResult {
	results: string;
	player: number;
	computer: number;
}

export default function ComputerPage() {
	const navigate = useNavigate();
	const [choices, setChoices] = useState<ChoicesResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [playHistory, setPlayHistory] = useState<PlayResult[]>([]);
	const [playerName, setPlayerName] = useState<string>("");

	// This state will trigger ResultsPage refresh
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	useEffect(() => {
		const storedName = localStorage.getItem("playerName") || "Unknown";
		setPlayerName(storedName);
	}, []);

	const fetchChoices = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(endpoints.getChoices);
			if (!response.ok) throw new Error("Network response was not ok");
			const data: ChoicesResponse[] = await response.json();
			setChoices(data);
		} catch (err) {
			setError("Failed to load choices");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const playChoice = async (playerId: number) => {
		try {
			const response = await fetch(endpoints.play, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					player: playerId,
					playerName: playerName,
				}),
			});

			if (!response.ok) throw new Error("Failed to play");
			const data: PlayResult = await response.json();

			setPlayHistory((prev) => [...prev, data].slice(-5));

			setRefreshTrigger((prev) => prev + 1);

		} catch (err) {
			console.error(err);
		}
	};

	const getChoiceName = (id: number) => {
		const choice = choices.find((c) => c.id === id);
		return choice ? choice.name : `Unknown (${id})`;
	};

	return (
		<Box sx={{ display: "flex", padding: 2, gap: 4, alignItems: "flex-start" }}>
			{/* Left side: choices and last 5 results */}
			<Box sx={{ flex: 1 }}>
				<h2>Playing against the computer as {playerName}</h2>

				<Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
					<Button variant="outlined" color="primary" onClick={() => navigate("/")}>
						Back to Game Page
					</Button>
					<Button variant="contained" color="secondary" onClick={fetchChoices}>
						Load Choices
					</Button>
				</Stack>

				{loading && <p>Loading...</p>}
				{error && <p style={{ color: "red" }}>{error}</p>}

				{choices.length > 0 && (
					<Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
						{/* Choices table */}
						<Box>
							<Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
								Pick your choice
							</Typography>

							<TableContainer component={Paper} sx={{ width: 300 }}>
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
						</Box>

						{/* Last 5 results table */}
						<Box>
							{playHistory.length > 0 && (
								<>
									<Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
										Last 5 Results
									</Typography>
									<TableContainer component={Paper} sx={{ width: 300 }}>
										<Table size="small">
											<TableHead>
												<TableRow>
													<TableCell>Player Choice</TableCell>
													<TableCell>Computer Choice</TableCell>
													<TableCell>Result</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{playHistory.map((play, index) => (
													<TableRow key={index}>
														<TableCell>{getChoiceName(play.player)}</TableCell>
														<TableCell>{getChoiceName(play.computer)}</TableCell>
														<TableCell>{play.results}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</>
							)}
						</Box>
					</Box>
				)}
			</Box>

			{/* Right side: ResultsPage with refreshTrigger */}
			<Box sx={{ width: 400 }}>
				<ResultsPage refreshTrigger={refreshTrigger} />
			</Box>
		</Box>
	);
}
