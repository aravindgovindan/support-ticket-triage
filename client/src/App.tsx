import { useState } from "react";
import type { TriageResult } from "./types";

export default function App() {
  const [ticketText, setTicketText] = useState<string>("");
  const [result, setResult] = useState<TriageResult>({});

  const handleSubmit = () => {
    if (!ticketText.trim()) return;

    // Placeholder: API call goes here later
    setResult({ category: "Placeholder", urgency: "unknown" });
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Support Ticket Triage</h1>

      <textarea
        rows={8}
        style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
        placeholder="Paste the support ticket text here..."
        value={ticketText}
        onChange={(e) => setTicketText(e.target.value)}
      />

      <button onClick={handleSubmit} style={{ marginTop: 12 }}>
        Submit
      </button>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {result ? (
          <>
            <p><strong>Category:</strong> {result.category}</p>
            <p><strong>Urgency:</strong> {result.urgency}</p>
          </>
        ) : (
          <p>No result yet.</p>
        )}
      </div>
    </div>
  );
}