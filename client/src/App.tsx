import { useState } from "react";
import type { TriageResult } from "./types";

export default function App() {
  const [ticketText, setTicketText] = useState<string>("");
  const [result, setResult] = useState<TriageResult>({});

  const triageTicket = async (payload: string) => {
    try {
      const response = await fetch('/categorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ticketText: payload})
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: TriageResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Failed to categorize ticket:', error);
    }
  }

  const handleSubmit = () => {
    if (!ticketText.trim()) return;

    triageTicket(ticketText.trim())
  };



  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Support Ticket Triage</h1>

      <textarea
        rows={8}
        style={{ width: "100%", padding: 8, boxSizing: "border-box", resize: "vertical" }}
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
            <p style={{textTransform: "capitalize"}}><strong>Category:</strong> {result.category}</p>
            <p style={{textTransform: "capitalize"}}><strong>Urgency:</strong> {result.urgency}</p>
          </>
        ) : (
          <p>No result yet.</p>
        )}
      </div>
    </div>
  );
}