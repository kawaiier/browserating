# Browserating

Browserating is a Next.js web application that provides performance rankings and comparisons for macOS, Windows, and Android browsers. It uses data from Speedometer 3 benchmarks to give users a comprehensive view of browser performance.

## Features

- Responsive design for optimal viewing on various devices
- Display a ranking list of macOS, Windows, and Android browsers based on performance metrics
- Filter browsers based on their engine
- Detailed information for each browser, including multiple versions

## Technologies Used

- Next.js 14 (App Router)
- React
- Tailwind CSS
- Chart.js for visualizations
- JSON for data storage

## Setup and Installation

1. Clone the repository:

   ```
   git clone https://github.com/kawaiier/browserating.git
   cd browserating
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

Browser data is stored in `public/data/`. To update browser information:

1. Open `android.json`, `macos-intel.json`, `macos-arm.json`, or `windows.json` in a text editor
2. Modify the JSON data following the existing structure
3. Save the file

The application will automatically reflect the changes on the next load.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Speedometer 3 for providing benchmark data - https://browserbench.org/Speedometer3.0/
- All browser developers for their continuous work on improving web technologies

## Say Thanks

If you find this project useful, please consider supporting me with a coffee.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J8TMWMG)

### Donation Addresses

- **BTC**: `bc1qfyad27catyr8rtdhhydn8ummf996kxtesuw4hr`
- **XMR**: `41zM5Hk39icMLDnbAckLpJHMwMPQKAQEADYA1AvjoZw9Y9NC7atnubrWPZKXWRbpZeGg66DkstQmA1oPZurRBcvRFbQ3PLs`
- **LTC**: `ltc1qnqldulnxsxpz4g89uklsepjeqx7cajynzyr7tc`
- **MATIC**: `0x6c056E9ccB183c08e9248eAF26160B5793221513`

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=kawaiier/browserating&type=Date)](https://star-history.com/#kawaiier/browserating&Date)
