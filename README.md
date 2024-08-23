# BrowseRater
BrowseRater is a Next.js web application that provides performance rankings and comparisons for macOS browsers. It uses data from Speedometer 3 benchmarks (and privacytests in the future) to give users a comprehensive view of browser performance.

## Features

- Responsive design for optimal viewing on various devices
- Display a ranking list of macOS browsers based on performance metrics

## In development

- Show detailed information for each browser, including multiple versions
- Compare browsers based on Speedometer 3 scores, privacy scores, and overall performance

## Technologies Used

- Next.js 13 (App Router)
- React
- Tailwind CSS
- JSON for data storage


## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/browsrater.git
   cd browsrater
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Data Management

Browser data is stored in `public/data/browsers.json`. To update browser information:

1. Open `public/data/browsers.json`
2. Modify the JSON data following the existing structure
3. Save the file

The application will automatically reflect the changes on the next load.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Speedometer 3 for providing benchmark data - https://browserbench.org/Speedometer3.0/
- Privacytests - https://privacytests.org/
- All browser developers for their continuous work on improving web technologies
