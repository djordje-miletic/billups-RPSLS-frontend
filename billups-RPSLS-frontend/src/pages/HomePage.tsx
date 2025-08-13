import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    let playerName = localStorage.getItem('playerName');

    if (!playerName) {
      playerName = prompt("Enter your name:");
      if (playerName && playerName.trim()) {
        localStorage.setItem('playerName', playerName.trim());
      }
    }

    if (localStorage.getItem('playerName')) {
      navigate('/game');
    }
  }, [navigate]);

  return null;
}
