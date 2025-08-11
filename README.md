# Mini Learning Website

A simple, modern web application for learning with user authentication, video content, a quiz, and clickstream tracking. All user interactions are logged to a CSV file on the server.

## Features

- **User Registration & Login**: Secure, tabbed interface for easy switching.
- **Course Page**: Displays a YouTube video and a normal HTML5 video.
- **Quiz**: Quick quiz with instant feedback.
- **Clickstream Tracking**: All significant user actions (login, logout, video events, quiz attempts, etc.) are logged to `clickstream.csv` on the server.
- **Modern UI**: Responsive and visually appealing design.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)

### Installation

1. Clone or download this repository.
2. Open a terminal in the project directory.
3. Install dependencies:

   ```
   npm install
   ```

### Running the Server

Start the server with:

```
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Usage

- Register a new user or log in with existing credentials.
- Explore the course page, watch videos, and try the quiz.
- All your actions are tracked and saved in `clickstream.csv` in the project root.

## Project Structure

```
learning-website/
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── course.png
│   └── logo.png
├── clickstream.csv
├── server.js
├── package.json
└── README.md
```

## Notes

- This project is for educational/demo purposes. User data is stored in memory and is not persistent.
- Clickstream data is stored in CSV format for easy analysis.
