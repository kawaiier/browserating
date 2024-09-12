import About from "./components/About";
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
          macOS Browser Performance Ranking
        </h2>
      </header>
      <main className="container mx-auto px-4 py-8">
        <About />
        <BrowserRankingList />
      </main>
      <Explanation />
      <footer className="text-center text-sm p-8">
        <p>
          developed by{" "}
          <a href="kawaiier.dev" className="font-bold" target="_blank">
            kawaiier
          </a>
        </p>
        <p>
          <a
            href="https://github.com/kawaiier/browserating"
            className="text-gray-400"
            target="_blank"
          >
            source code
          </a>
        </p>
      </footer>
    </>
  );
}
