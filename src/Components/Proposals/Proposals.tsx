import React, { useState } from "react";
import { proposals } from "../../data/proposals";

const Proposals: React.FC = () => {
  const [selected, setSelected] = useState(0);

  if (!proposals.length) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <h2>No proposals available yet.</h2>
        <p>Check back soon for detailed project demos and solutions!</p>
      </div>
    );
  }

  const proposal = proposals[selected];

  return (
    <div style={{ padding: 32 }}>
      <h1>Demo Project Setups & Proposals</h1>
      <div style={{ marginBottom: 24 }}>
        {proposals.map((p, idx) => (
          <button
            key={p.title}
            onClick={() => setSelected(idx)}
            style={{
              marginRight: 8,
              padding: "8px 16px",
              background: idx === selected ? "#1976d2" : "#eee",
              color: idx === selected ? "#fff" : "#222",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {p.title}
          </button>
        ))}
      </div>
      <h2>{proposal.title}</h2>
      <p><strong>Problem:</strong> {proposal.problem}</p>
      <p><strong>Solution:</strong> {proposal.solution}</p>
      <p><strong>Technology:</strong> {proposal.technology}</p>
      <p><strong>Estimated Duration:</strong> {proposal.duration}</p>
      <p>{proposal.description}</p>
      <div style={{ border: "1px solid #ccc", borderRadius: 8, overflow: "hidden", height: "70vh", marginTop: 24 }}>
        <iframe
          title={proposal.title}
          src={proposal.url}
          width="100%"
          height="100%"
          style={{ border: "none", minHeight: "500px" }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Proposals;
