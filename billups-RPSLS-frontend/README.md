# React + TypeScript + Vite

Application name: Rock Paper Scissors Lizard Spock game - part that you can see
Application type: React web app
Application tech stack: React, Node.js v22.18.0, TypeScript
Application requirements: Node.js v22.18.0
This is front end part of application Rock Paper Scissors Lizard Spock. This application is written in React and it serves as visual part of game implementation.
When you login to application you need to enter your player name. Player name is stored in state so if you want user with another name use diferent brwoser. Application started with docker commands will be hosted at http://localhost:5173/home.
App have two parts, play against computer and play against oponent. When playing against computer you will be offered choices and ping API which will simulate computer response.
Second part of app is play against oponent. When you join room you'll need to wait for oponent and then play one againt another.

Docker run:

docker build -t billups-rpsls-fe .
docker run -p 5173:5173 -v "%cd%:/app" -v /app/node_modules billups-rpsls-fe

Navigate to: http://localhost:5173/Home