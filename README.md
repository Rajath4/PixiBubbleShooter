# Pixi.js Bubble Shooter Game

This is a Bubble Shooter game built using [Pixi.js](https://pixijs.com/) and TypeScript. The project is set up with Webpack for bundling and development.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Build](#build)
- [Project Structure](#project-structure)
- [License](#license)

## Installation

To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/Rajath4/PixiBubbleShooter.git
cd PixiBubbleShooter
npm run setup
```

This will install all the necessary dependencies as listed in the `package.json` file.

## Usage

### Running the Game Locally

To run the game in development mode with live reloading:

```bash
npm start
```

This will start a development server at `http://localhost:8000` (or another available port) and open the game in your default browser.

### Building the Game for Production

To build the project for production:

```bash
npm run build:prod
```

The optimized build will be created in the `dist` directory.

## Development

### Project Structure

- **src/**: Contains the source files for the project.
  - **script/**: The TypeScript files for the game logic.
  - **assets/**: Game assets like images and sounds.
  - **index.html**: The main HTML file for the game.
  - **styles.css**: CSS styles for the game.
- **dist/**: The output directory for the built files.
- **webpack.config.js**: Webpack configuration file.
- **tsconfig.json**: TypeScript configuration file.

### Available Scripts

- **`npm run setup`**: Installs the necessary dependencies.
- **`npm run clean`**: Removes the `dist` directory.
- **`npm start`**: Runs the development server with live reloading.
- **`npm run build`**: Builds the project in development mode.
- **`npm run build:prod`**: Builds the project in production mode, with optimizations.

### Technologies Used

- **Pixi.js**: A 2D rendering engine for creating interactive graphics and animations.
- **TypeScript**: A statically typed superset of JavaScript.
- **Webpack**: A module bundler for JavaScript applications.
- **GSAP**: A powerful JavaScript animation library.
