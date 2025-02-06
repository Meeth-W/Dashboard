import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

function Scraper() {
  const [scrapes, setScrapes] = useState([]);
  const [selectedScrape, setSelectedScrape] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const navigate = useNavigate();

  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  useEffect(() => {
    if (!username || !password) return;
    fetchScrapes();
  }, [username, password]);

  const fetchScrapes = () => {
    fetch(`http://127.0.0.1:8000/api/v1/scrapes/fetch?username=${username}&password=${password}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setScrapes(data);
        } else {
          setError(data.message || "Failed to fetch scrapes.");
        }
      })
      .catch((error) => setError("Error fetching scrapes: " + error.message));
  };

  const handleScrape = () => {
    if (!url) return;
    if (scrapes.includes(url)) {
      setError("URL already scraped!");
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`http://127.0.0.1:8000/api/v1/scrape?username=${username}&password=${password}&url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          fetchScrapes();
          setUrl("");
        } else {
          setError(data.message || "Scraping failed.");
        }
      })
      .catch((error) => setError("Error scraping: " + error.message))
      .finally(() => setLoading(false));
  };

  const handleDelete = (scrapeUrl) => {
    fetch(`http://127.0.0.1:8000/api/v1/scrapes/delete?username=${username}&password=${password}&url=${encodeURIComponent(scrapeUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          fetchScrapes();
          setSelectedScrape(null);
        } else {
          setError(data.message || "Failed to delete scrape.");
        }
      })
      .catch((error) => setError("Error deleting scrape: " + error.message));
  };

  const handleSelectScrape = (scrapeUrl) => {
    fetch(`http://127.0.0.1:8000/api/v1/scrape?username=${username}&password=${password}&url=${encodeURIComponent(scrapeUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setSelectedScrape({ url: scrapeUrl, summary: data.summary, content: data.original });
          setShowRaw(false);
        } else {
          setError(data.message || "Failed to fetch scrape data.");
        }
      })
      .catch((error) => setError("Error fetching scrape data: " + error.message));
  };

  if (!username || !password) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center">
          <p className="text-2xl mb-4">You are not logged in!</p>
          <button onClick={() => navigate("/")} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-slate-800 p-4 overflow-y-auto">
        <button className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-md mb-4" onClick={() => setSelectedScrape(null)}>
          New Scrape
        </button>
        <div className="space-y-2">
          {scrapes.map((scrapeUrl) => (
            <div
              key={scrapeUrl}
              className={`p-2 cursor-pointer rounded-md transition duration-200 ${selectedScrape?.url === scrapeUrl ? "bg-blue-700" : "bg-slate-700 hover:bg-slate-600"}`}
              onClick={() => handleSelectScrape(scrapeUrl)}
            >
              {scrapeUrl}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        {error && <div className="mb-4 p-2 bg-red-600 text-white rounded-md">{error}</div>}
        {selectedScrape ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">{selectedScrape.url}</h1>
            <ReactMarkdown className="prose prose-invert max-w-none">
              {showRaw ? selectedScrape.content : selectedScrape.summary}
            </ReactMarkdown>
            <div className="mt-4 flex space-x-2">
              <button className="p-2 bg-red-600 hover:bg-red-700 rounded-md" onClick={() => handleDelete(selectedScrape.url)}>
                Delete Scrape
              </button>
              <button
                className="p-2 bg-gray-600 hover:bg-gray-700 rounded-md"
                onClick={() => setShowRaw(!showRaw)}
              >
                {showRaw ? "Show Summary" : "Show Raw Data"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Enter a URL to Scrape</h1>
            <input
              className="w-full p-2 mb-4 bg-slate-700 border border-gray-500 rounded-md text-white"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
            <button className="p-2 bg-green-600 hover:bg-green-700 rounded-md" onClick={handleScrape} disabled={loading}>
              {loading ? "Scraping..." : "Scrape Website"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Scraper;