"use client";
import Image from "next/image";
import About from "./components/About/About";
import BrowserRankingList from "./components/BrowserRankingList";
import Explanation from "./components/Explanation";
import Newsletter from "./components/Newsletter";
import Header from "./components/Header";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <About />
        <BrowserRankingList />
      </main>
      <Newsletter />
      <Explanation />
      <Footer />
    </>
  );
}
