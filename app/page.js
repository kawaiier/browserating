import About from "./components/About";
import BrowserCard from "./components/BrowserCard";
import BrowserRankingList from "./components/BrowserRankingList";

export default function Home() {
  return (
    <>
      <header className="pt-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          macOS Browser Performance Ranking
        </h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        <About />
        <BrowserRankingList />
      </main>
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
