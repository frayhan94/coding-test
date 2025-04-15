import {useEffect, useState} from "react";

export default function Home() {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState("All");
  const [loadingOpenAi, setLoadingOpenAi] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/data")
      .then((res) => res.json())
      .then((data) => {
        setSalesReps(data?.salesReps || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  const filteredSalesReps = salesReps.filter((rep) => {
    return regionFilter === "All" || rep.region === regionFilter;
  });

  const handleAskQuestion = async () => {
    try {
      setLoadingOpenAi(true);
      const response = await fetch("http://localhost:8000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error("Error in AI request:", error);
    } finally {
        setLoadingOpenAi(false);
    }
  };

  return (
      <div className={"container mx-auto p-4"}>

        <h1 className="text-3xl font-bold mb-4">Sales Representatives</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{color: "red"}}>{error}</p>}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <select
              className="px-4 py-2 rounded border border-gray-300"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="All">All Regions</option>
            {[...new Set(salesReps.map((rep) => rep.region))].map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
            ))}
          </select>
        </div>

        {!loading && !error && (
            <div className="grid gap-4">
              {filteredSalesReps.map((rep) => (
                  <div
                      key={rep.id}
                      className="border rounded p-4 shadow"
                  >
                    <h2 className="text-xl font-semibold">{rep.name} ({rep.role})</h2>
                    <p><strong>Region:</strong> {rep.region}</p>
                    <p><strong>Skills:</strong> {rep.skills.join(", ")}</p>

                    <div style={{marginTop: "1rem"}}>
                      <h3>Deals</h3>
                      <ul className="list-disc ml-5 mt-1">
                        {rep.deals.map((deal, index) => (
                            <li key={index}>
                              {deal.client} - ${deal.value.toLocaleString()} ({deal.status})
                            </li>
                        ))}
                      </ul>
                    </div>


                    <div className="mt-3">
                      <h3 className="font-semibold">Clients</h3>
                      <ul className="list-disc ml-5">
                        {rep.clients.map((client, i) => (
                            <li key={i}>
                              {client.name} ({client.industry}) - {client.contact}
                            </li>
                        ))}
                      </ul>
                    </div>
                  </div>
              ))}
            </div>
        )}
        <section className={'mt-5'}>
          <h2>Ask a Question (AI Endpoint)</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
            <input
                disabled={loadingOpenAi}
                type="text"
                placeholder="Enter your question..."
                value={question}
                className="w-full sm:w-96 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
                onChange={(e) => setQuestion(e.target.value)}
            />
            <button
                disabled={loadingOpenAi}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
                onClick={handleAskQuestion}>Ask
            </button>
          </div>
          {
            loadingOpenAi ? (
                <div className={'mt-2'}>
                  <span className={'text-sm'}>Loading Gemini Response</span>
                </div>
            ) : (
                <>
                  {answer && (
                      <div className={'mt-2'}>
                        <strong>AI Response:</strong> {answer}
                      </div>
                  )}
                </>
            )
          }
        </section>
      </div>
  );
}
