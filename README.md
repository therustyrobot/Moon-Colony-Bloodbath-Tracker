A responsive, touch-friendly resource companion app designed for the board game Moon Colony Bloodbath. Built with React and Tailwind CSS, this application replaces physical tokens with a streamlined digital dashboard, perfect for a tablet placed in the center of the playing area.

## Features

* Table-Optimized UI: A 4-quadrant split-screen layout designed to be accessible from all sides of the table.
* Head-to-Head Orientation: Top sectors are rotated 180° for players sitting across the table, while bottom sectors face the near side.
* Resource Management: Tracks People, Money, and Food with massive, easy-to-hit touch targets designed for quick interaction.
* Player Configuration: Supports 2, 3, or 4 player setups. Unused sectors are visually disabled/grayed out.
* Visual Themes: Switch seamlessly between a gritty Sci-Fi Dark Mode and a clean High-Contrast Light Mode.
* Digital Rules Reference: Includes a built-in Quickstart guide tab for easy rule lookups during play.

## Tech Stack

* React 19
* Tailwind CSS
* Lucide React Icons

## Usage

Open the app on a tablet or large phone, place it in the middle of your game table, select the number of players, and start the bloodbath!

# Built using Google AI Studio

View app in AI Studio: https://ai.studio/apps/drive/1Dzm_gJeEoP4OxzMzZWrF68_XQjesRR_C

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`