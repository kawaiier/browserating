"use client";
import About from "./components/About/About";
import BrowserRankingList from "./components/BrowserRankingList";
import Explanation from "./components/Explanation";

export default function Home() {
  return (
    <>
      <header className="pt-8">
        <h1 className="text-4xl font-bold mb-2 text-center text-indigo-600">
          Browserating
        </h1>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Browser Performance Ranking for macOS, Windows and Android
        </h2>
      </header>
      <main className="container mx-auto px-4 py-8">
        <About />
        <BrowserRankingList />
      </main>
      <Explanation />
      <footer className="text-center text-sm p-8 flex flex-col items-center gap-2 mt-8">
        <div className="flex flex-row gap-2">
          <a href="https://x.com/kawaiier101" className="text-gray-400 mx-auto">
            <span className="[&>svg]:h-5 [&>svg]:w-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 512 512"
              >
                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
              </svg>
            </span>
          </a>
          <a
            href="https://bsky.app/profile/kawaiier.bsky.social"
            className="text-gray-400 mx-auto"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="[&>svg]:h-5 [&>svg]:w-5">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bluesky_Logo.svg/600px-Bluesky_Logo.svg.png"
                alt="Bluesky Logo"
                className="h-5 w-5"
              />
            </span>
          </a>
        </div>
        <p className="mx-auto">
          developed by{" "}
          <a
            href="https://kawaiier.dev"
            className="font-bold mx-auto hover:text-blue-700"
            target="_blank"
          >
            kawaiier
          </a>
        </p>
        <p className="mx-auto">
          <a
            href="https://github.com/kawaiier/browserating"
            className="text-gray-400 mx-auto hover:text-blue-700"
            target="_blank"
          >
            source code
          </a>
        </p>
        <hr className="w-full my-4" />
        <div className="flex flex-col items-center text-xs text-gray-500">
          <h3 className="text-sm font-bold mb-2">Donations</h3>
          <em>Click to copy</em>
          <span
            className="font-mono cursor-pointer"
            onClick={() =>
              navigator.clipboard.writeText(
                "bc1qfyad27catyr8rtdhhydn8ummf996kxtesuw4hr"
              )
            }
          >
            BTC: bc1qfyad27catyr8rtdhhydn8ummf996kxtesuw4hr
          </span>
          <span
            className="font-mono cursor-pointer"
            onClick={() =>
              navigator.clipboard.writeText(
                "41zM5Hk39icMLDnbAckLpJHMwMPQKAQEADYA1AvjoZw9Y9NC7atnubrWPZKXWRbpZeGg66DkstQmA1oPZurRBcvRFbQ3PLs"
              )
            }
          >
            XMR:
            41zM5Hk39icMLDnbAckLpJHMwMPQKAQEADYA1AvjoZw9Y9NC7atnubrWPZKXWRbpZeGg66DkstQmA1oPZurRBcvRFbQ3PLs
          </span>
          <span
            className="font-mono cursor-pointer"
            onClick={() =>
              navigator.clipboard.writeText(
                "ltc1qnqldulnxsxpz4g89uklsepjeqx7cajynzyr7tc"
              )
            }
          >
            LTC: ltc1qnqldulnxsxpz4g89uklsepjeqx7cajynzyr7tc
          </span>
          <span
            className="font-mono cursor-pointer"
            onClick={() =>
              navigator.clipboard.writeText(
                "0x6c056E9ccB183c08e9248eAF26160B5793221513"
              )
            }
          >
            MATIC: 0x6c056E9ccB183c08e9248eAF26160B5793221513
          </span>
        </div>
      </footer>
    </>
  );
}
