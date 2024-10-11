"use client"
import { fetchStoresLocations } from "@/ai/tools";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await fetchStoresLocations(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-20 flex items-center align-middle flex-col">
      <h1>Haku</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Syötä hakusana"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Haetaan..." : "Hae"}
        </button>
      </form>

      {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
    </div>
  );
}
