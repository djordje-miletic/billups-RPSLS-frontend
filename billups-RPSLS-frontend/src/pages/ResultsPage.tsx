import React, { useEffect, useState } from "react";
import { endpoints } from "./apiConfig";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	CircularProgress,
	Box
} from "@mui/material";

interface ScoreResponse {
	playerName: string;
	result: string;
}

interface ResultsPageProps {
  refreshTrigger?: number; // Optional prop to trigger refresh
}

export default function ResultsPage({ refreshTrigger }: ResultsPageProps) {
	const [scores, setScores] = useState<ScoreResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [playerName, setPlayerName] = useState<string>("");
	const [playerScores, setPlayerScores] = useState<ScoreResponse[]>([]);
	const [playerLoading, setPlayerLoading] = useState(false);
	const [playerError, setPlayerError] = useState<string | null>(null);

	const fetchScores = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(endpoints.getRecentResults);
			if (!response.ok) throw new Error("Network response was not ok");
			const data: ScoreResponse[] = await response.json();
			setScores(data.slice(0, 10)); // Only show 10 results
			setPlayerName(data.length > 0 ? data[0].playerName : "");
		} catch (err) {
			setError("Failed to load scores");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const fetchPlayerScores = async (player: string) => {
		if (!player) {
			setPlayerScores([]);
			return;
		}
		setPlayerLoading(true);
		setPlayerError(null);
		try {
			const response = await fetch(
				endpoints.getRecentResultsByPlayer(player)
			);
			if (!response.ok) throw new Error("Network response was not ok");
			const data: ScoreResponse[] = await response.json();
			setPlayerScores(data.slice(0, 10)); // Only show 10 results
		} catch (err) {
			setPlayerError("Failed to load player scores");
			console.error(err);
		} finally {
			setPlayerLoading(false);
		}
	};

	useEffect(() => {
		fetchScores();
	}, [refreshTrigger]);

	useEffect(() => {
		if (playerName) fetchPlayerScores(playerName);
	}, [playerName, refreshTrigger]);

	const handleRefresh = async (player: string) => {
		await fetch(endpoints.deletePlayerData(player), {
			method: "DELETE",
		});
		fetchScores();
		fetchPlayerScores(player);
	};

	const renderTable = (
		title: string,
		rows: ScoreResponse[],
		loadingState: boolean,
		errorState: string | null
	) => (
		<div>
			<Typography variant="h6" sx={{ mb: 1 }}>
				{title}
			</Typography>
			{loadingState && <CircularProgress size={24} />}
			{errorState && <Typography color="error">{errorState}</Typography>}
			{!loadingState && !errorState && (
				<TableContainer component={Paper} sx={{ mb: 3 }}>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Player</TableCell>
								<TableCell>Result</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.length === 0 ? (
								<TableRow>
									<TableCell colSpan={2} align="center">
										No results
									</TableCell>
								</TableRow>
							) : (
								rows.map(({ playerName, result }, index) => (
									<TableRow key={index}>
										<TableCell>{playerName}</TableCell>
										<TableCell>{result}</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</div>
	);

	return (
		<div>
			{renderTable("Recent Results", scores, loading, error)}
			{renderTable(
				`Recent Results for Player: ${playerName || "None selected"}`,
				playerScores,
				playerLoading,
				playerError
			)}
			<Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
				<Button
					variant="contained"
					onClick={() => handleRefresh(playerName)}
				>
					Refresh Tables
				</Button>
			</Box>
		</div>
	);
}
