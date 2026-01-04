
# Hanoi Tower Game

A modern, interactive web version of the classic Tower of Hanoi puzzle. Play, compete, and learn with a beautiful UI, leaderboard, and smart features!

---

## 🚩 Features

- **Classic Hanoi Tower gameplay**: Move all discs to another tower, obeying the rules.
- **Multiple disc options**: Choose 3–8 discs, or use the spinning wheel for a random challenge.
- **Drag & drop or click-to-move**: Intuitive controls for all devices.
- **Auto Solve (Hint)**: Get a 5-move hint from any current state (one use per game).
- **Leaderboard**: Online ranking by moves and time, filterable by disc count.
- **Dark/White mode**: Switchable UI themes.
- **Mobile-friendly**: Responsive design.
- **Persistent state**: Game progress and settings are saved locally.

---

## 🕹️ How to Play

1. **Enter your name** on the home page.
2. **Choose disc count** (manual or spin for random).
3. **Move discs** between towers (drag or click).
4. **Win** by moving all discs to another tower in the fewest moves.
5. **Check your rank** on the leaderboard!

### Rules

- Only one disc can be moved at a time.
- No larger disc may be placed on a smaller one.

---

## 🏆 Leaderboard

- Results are submitted online and ranked by:
	- Number of moves (ascending)
	- Time (ascending)
- Filter leaderboard by disc count for fair comparison.

---

## 🤖 Auto Solve

- Use the "Auto Solve" button for a 5-move hint from your current state.
- Only available once per game.

---

## 🌗 Dark/White Mode

- Click the toggle button (top right) to switch between dark and white (light) themes.
- Your preference is saved for next time.

---

## 🚀 Getting Started

No installation needed!  
Visit the deployed site to play the game:

> https://hanoitower-woody.vercel.app/

---

## 📂 Project Structure

- `hanoitower/index.html` — Home, disc selection, leaderboard
- `hanoitower/game.html` — Main game interface
- `hanoitower/game.js` — Game logic, drag & drop, auto solve, leaderboard submit
- `hanoitower/spin.html` — Spinning wheel for random disc selection
- `hanoitower/spin.js` — Wheel logic
- `hanoitower/style.css` — All styles, including dark/white mode

---

## 💡 Development Ideas

- Add user accounts and personal stats
- More game modes (timed, challenge, etc.)
- Achievements and unlockable themes
- Multiplayer or versus mode
- Educational step-by-step solver

---

## 📜 License

MIT License

---
