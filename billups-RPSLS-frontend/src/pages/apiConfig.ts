const API_BASE_URL = "https://localhost:44348";

export const endpoints = {
  getChoices: `${API_BASE_URL}/choices`,
  getRandomChoice: `${API_BASE_URL}/choice`,
  play: `${API_BASE_URL}/play`,
  getRecentResults: `${API_BASE_URL}/get10RecentResults`,
  getRecentResultsByPlayer: (playerName: string) => `${API_BASE_URL}/get10RecentResultsByPlayer/${encodeURIComponent(playerName)}`,
  deletePlayerData: (playerName: string) => `${API_BASE_URL}/resetByPlayer/${encodeURIComponent(playerName)}`,
  gameHub: `${API_BASE_URL}/gamehub`
};