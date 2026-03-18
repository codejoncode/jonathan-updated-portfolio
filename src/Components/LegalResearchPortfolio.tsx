import React from "react";
import "./LegalResearchPortfolio.css";

const LegalResearchPortfolio: React.FC = () => {
  return (
    <div className="legal-portfolio-container">
      {/* SIDEBAR */}
      <nav className="legal-nav">
        <div className="nav-header">
          <div className="monogram">JD</div>
          <div className="name">Jane Doe</div>
          <div className="title">Legal Research &amp; Analysis</div>
        </div>
        <ul>
          <li>
            <a href="#petition">
              <span className="num">01</span> The Petition
            </a>
          </li>
          <li>
            <a href="#questions">
              <span className="num">02</span> Key Questions
            </a>
          </li>
          <li>
            <a href="#statutes">
              <span className="num">03</span> Statutes
            </a>
          </li>
          <li>
            <a href="#caselaw">
              <span className="num">04</span> Case Law
            </a>
          </li>
          <li>
            <a href="#analysis">
              <span className="num">05</span> Analysis
            </a>
          </li>
          <li>
            <a href="#timeline">
              <span className="num">06</span> Timeline
            </a>
          </li>
          <li>
            <a href="#output">
              <span className="num">07</span> Final Output
            </a>
          </li>
        </ul>
        <div className="nav-footer">
          All names &amp; identifying<br />
          information anonymized<br />
          for portfolio use only.<br />
          <br />
          Cause No.<br />
          00D00‑0000‑DC‑000000
        </div>
      </nav>

      {/* MAIN */}
      <main className="legal-main">
        {/* HERO */}
        <div className="legal-hero">
          <div className="hero-label">Legal Research Portfolio</div>
          <h1>
            Dissolution of Marriage:<br />
            <em>Pro Se Response to Petition for Provisional Orders</em>
          </h1>
          <p style={{ fontSize: "14px", lineHeight: 1.8, color: "rgba(245,240,232,0.7)", maxWidth: "560px", marginTop: "20px" }}>
            A complete demonstration of independent legal research, issue spotting, statutory analysis, case law application, and
            professional document drafting — conducted without attorney representation.
          </p>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <div className="label">Jurisdiction</div>
              <div className="value">Sample County Superior Court, State of Indiana</div>
            </div>
            <div className="hero-meta-item">
              <div className="label">Role</div>
              <div className="value">Respondent / Father — Pro Se</div>
            </div>
            <div className="hero-meta-item">
              <div className="label">Filed</div>
              <div className="value">Within Statutory Deadline</div>
            </div>
            <div className="hero-meta-item">
              <div className="label">Documents Produced</div>
              <div className="value">4 (Appearance, Enlargement, Affidavit, Personal Statement)</div>
            </div>
          </div>
        </div>

        {/* SECTION 1: THE PETITION */}
        <section id="petition" className="legal-section">
          <div className="section-header">
            <span className="section-num">§ 01</span>
            <h2 className="section-title">The Petition — Problem Statement</h2>
          </div>

          <div className="petition-box">
            <div className="stamp">Anonymized</div>
            <h3>Caption</h3>
            <p>
              <strong>State of Indiana — Sample County Superior Court 1</strong>
              <br />
              In Re the Marriage of: <strong>Jane Doe</strong> (Petitioner / Mother) and{" "}
              <strong>John Doe</strong> (Respondent / Father)
              <br />
              Cause No. 00D00‑0000‑DC‑000000
            </p>
          </div>

          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.85,
              marginBottom: "24px",
              color: "#333",
            }}
          >
            The Petitioner filed for dissolution of marriage and simultaneously sought a series of provisional orders through her
            retained legal counsel. The petition was filed on <strong>[Date A]</strong> but service was not executed until{" "}
            <strong>[Date B]</strong> — a delay of fourteen days. The Respondent, appearing pro se and without legal training, received
            the following demands:
          </p>

          <div className="petition-claims">
            <div className="claim-item">
              <div className="icon">🏠</div>
              <div className="text">
                <strong>Custody</strong>Sole physical and legal custody of all four minor children (Child A, age 16; Child B, age 14;
                Child C, age 11; Child D, age 6).
              </div>
            </div>
            <div className="claim-item">
              <div className="icon">🔑</div>
              <div className="text">
                <strong>Marital Home</strong>Exclusive possession of the marital home — the only home the children have ever known,
                qualified for and primarily funded by the Respondent.
              </div>
            </div>
            <div className="claim-item">
              <div className="icon">🚙</div>
              <div className="text">
                <strong>Marital Vehicle</strong>Exclusive possession of the marital SUV, despite the vehicle being titled solely in
                the Respondent's name with Respondent's down payment.
              </div>
            </div>
            <div className="claim-item">
              <div className="icon">💵</div>
              <div className="text">
                <strong>Financial Relief</strong>Child support payments and payment of marital expenses from the Respondent, who is
                involuntarily unemployed.
              </div>
            </div>
            <div className="claim-item">
              <div className="icon">⚠️</div>
              <div className="text">
                <strong>Disclosure Gap</strong>The petition discloses only assets held in the Respondent's name. Petitioner's retirement
                accounts, estate interest, and personal financial accounts are entirely omitted.
              </div>
            </div>
            <div className="claim-item">
              <div className="icon">❓</div>
              <div className="text">
                <strong>No Childcare Plan</strong>The petition requests sole custody and removal of the Respondent from the home but
                proposes no plan for who will supervise four children during the Petitioner's 50–60+ hour work weeks and late-night
                shifts.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: KEY QUESTIONS - Simplified */}
        <section id="questions" className="legal-section">
          <div className="section-header">
            <span className="section-num">§ 02</span>
            <h2 className="section-title">Key Legal Questions Identified</h2>
          </div>

          <p style={{ fontSize: "14px", lineHeight: 1.85, marginBottom: "32px", color: "#444" }}>
            Upon receiving the petition, the Respondent independently identified the following dispositive legal questions — without
            attorney assistance — by reading Indiana statutes and applying them to the documented facts.
          </p>

          <div className="callout" style={{ background: "#f5f0e8", color: "#1a1208", borderLeft: "4px solid #b8963e", padding: "24px", margin: "24px 0" }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", lineHeight: 1.75, fontStyle: "italic", margin: 0 }}>
              "The petition as filed asks this Court to remove the solution to a problem the petition itself creates. I have been
              that solution every day."
            </p>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "#b8963e", textTransform: "uppercase", marginTop: "10px", fontStyle: "normal", display: "block" }}>
              — Respondent's Personal Statement (anonymized for portfolio)
            </span>
          </div>

          <div style={{ fontSize: "13px", lineHeight: 1.8, color: "#555" }}>
            <p style={{ marginBottom: "16px", fontWeight: 700 }}>08 Key Questions Researched & Answered:</p>
            <ol style={{ marginLeft: "20px" }}>
              <li style={{ marginBottom: "8px" }}>Are there undisclosed marital assets, and does their omission violate Indiana's one-pot rule?</li>
              <li style={{ marginBottom: "8px" }}>Does the Petitioner's work schedule support a viable sole-custody claim?</li>
              <li style={{ marginBottom: "8px" }}>Does the petition propose any childcare plan?</li>
              <li style={{ marginBottom: "8px" }}>What is the documented caregiving history?</li>
              <li style={{ marginBottom: "8px" }}>Are there contradictions between petition and prior written statements?</li>
              <li style={{ marginBottom: "8px" }}>Does either party have alternative housing options?</li>
              <li style={{ marginBottom: "8px" }}>Does involuntary unemployment disqualify a parent from custody?</li>
              <li>Are there life insurance policies, and what are the protection needs?</li>
            </ol>
          </div>
        </section>

        {/* SECTION 3: STATUTES */}
        <section id="statutes" className="legal-section">
          <div className="section-header">
            <span className="section-num">§ 03</span>
            <h2 className="section-title">Statutory Framework</h2>
          </div>

          <div className="statute-grid">
            <div className="statute-card">
              <div className="statute-code">Ind. Code § 31-15-7-4</div>
              <div className="statute-name">The One-Pot Rule — Marital Asset Disclosure</div>
              <div className="statute-text">
                Directs courts to divide the marital estate, which consists of all assets of either party, regardless of when acquired,
                how titled, or whose name they are held in. Both parties are obligated to disclose all assets to the Court.
              </div>
            </div>

            <div className="statute-card">
              <div className="statute-code">Ind. Code § 31-17-2-8</div>
              <div className="statute-name">Best Interests of the Child — Custody Factors</div>
              <div className="statute-text">
                Lists factors for custody determination including: age and sex of the child; wishes of the child; interaction with
                each parent; child's adjustment to home, school, and community; mental and physical health of all parties; evidence of
                domestic violence; and the ability of each party to foster a positive relationship.
              </div>
            </div>

            <div className="statute-card">
              <div className="statute-code">Ind. Code § 31-15-4-8</div>
              <div className="statute-name">Provisional Orders — Scope and Limitations</div>
              <div className="statute-text">
                Authorizes courts to enter provisional orders during pendency of dissolution proceedings covering custody, possession
                of the marital home, support, and use of marital property.
              </div>
            </div>

            <div className="statute-card">
              <div className="statute-code">Indiana Trial Rule 6(B)</div>
              <div className="statute-name">Enlargement of Time — Automatic Extension</div>
              <div className="statute-text">
                Provides for an automatic one-time enlargement of time to respond to a petition when notice is filed on or before the
                original response deadline.
              </div>
            </div>
          </div>

          <div className="skills-row" style={{ marginTop: "28px" }}>
            <span className="skill-badge">Statutory Research</span>
            <span className="skill-badge">Indiana Family Code</span>
            <span className="skill-badge">Marital Property Law</span>
            <span className="skill-badge">Provisional Orders</span>
            <span className="skill-badge">Best Interest Standard</span>
          </div>
        </section>

        {/* SECTION 4: CASE LAW - Simplified */}
        <section id="caselaw" className="legal-section">
          <div className="section-header">
            <span className="section-num">§ 04</span>
            <h2 className="section-title">Case Law Research</h2>
          </div>

          <div className="case-grid">
            <div className="case-card">
              <div className="case-tag">Marital Assets</div>
              <div>
                <div className="case-name">One-Pot Doctrine</div>
                <div className="case-cite">Indiana Appellate Courts</div>
                <div className="case-holding">
                  Indiana's one-pot rule includes all assets of either spouse regardless of when acquired, how titled, or whether
                  separately held.
                </div>
              </div>
            </div>

            <div className="case-card">
              <div className="case-tag">Custody</div>
              <div>
                <div className="case-name">Primary Caregiver Standard</div>
                <div className="case-cite">Indiana Appellate Courts</div>
                <div className="case-holding">
                  Indiana courts consistently give substantial weight to the parent who has served as the primary day-to-day
                  caregiver. Employment status alone is not disqualifying.
                </div>
              </div>
            </div>

            <div className="case-card">
              <div className="case-tag">Disclosure</div>
              <div>
                <div className="case-name">Concealment & Adverse Inference</div>
                <div className="case-cite">Indiana Appellate Courts</div>
                <div className="case-holding">
                  Where a party conceals assets or fails to make complete disclosure, courts may draw adverse inferences and award
                  unequal division as an equitable offset.
                </div>
              </div>
            </div>

            <div className="case-card">
              <div className="case-tag">Provisional</div>
              <div>
                <div className="case-name">Exclusive Possession</div>
                <div className="case-cite">Indiana Courts</div>
                <div className="case-holding">
                  Courts weigh comparative hardship when considering exclusive possession. Provisional orders do not determine final
                  property disposition.
                </div>
              </div>
            </div>
          </div>

          <div className="skills-row" style={{ marginTop: "28px" }}>
            <span className="skill-badge">Case Law Research</span>
            <span className="skill-badge">Issue Spotting</span>
            <span className="skill-badge">Holding Synthesis</span>
            <span className="skill-badge">Fact Application</span>
          </div>
        </section>

        {/* SECTION 5: ANALYSIS */}
        <section id="analysis" className="legal-section">
          <div className="section-header">
            <span className="section-num">§ 05</span>
            <h2 className="section-title">Analysis & Application — IRAC Structure</h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="analysis-table">
              <thead>
                <tr>
                  <th style={{ width: "18%" }}>Issue</th>
                  <th style={{ width: "26%" }}>Relevant Facts</th>
                  <th style={{ width: "18%" }}>Governing Law</th>
                  <th style={{ width: "38%" }}>Analysis & Outcome</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="issue">Undisclosed Assets</td>
                  <td className="fact">Petitioner omitted retirement account, potential benefits, and estate interest.</td>
                  <td className="law">Ind. Code § 31-15-7-4</td>
                  <td className="outcome">
                    Incomplete disclosure. Court should order full verified financial disclosure. <span className="badge badge-red">Unfavorable to Petitioner</span>
                  </td>
                </tr>
                <tr>
                  <td className="issue">Sole Custody Viability</td>
                  <td className="fact">Petitioner works 50-60+ hours/week with overnight absences.</td>
                  <td className="law">Ind. Code § 31-17-2-8</td>
                  <td className="outcome">
                    Cannot provide sole daily custody with this schedule. <span className="badge badge-red">Unfavorable to Petitioner</span>
                  </td>
                </tr>
                <tr>
                  <td className="issue">Primary Caregiver</td>
                  <td className="fact">8 years of documented daily caregiving duties.</td>
                  <td className="law">Primary Caregiver Doctrine</td>
                  <td className="outcome">
                    Satisfies standard overwhelmingly. <span className="badge badge-green">Favorable to Respondent</span>
                  </td>
                </tr>
                <tr>
                  <td className="issue">Exclusive Possession</td>
                  <td className="fact">Respondent has no alternative housing; Petitioner does.</td>
                  <td className="law">Ind. Code § 31-15-4-8</td>
                  <td className="outcome">
                    Comparative hardship favors Respondent. <span className="badge badge-green">Favorable to Respondent</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 6: TIMELINE */}
        <section id="timeline" className="legal-section">
          <div className="section-header">
            <span className="section-num">§ 06</span>
            <h2 className="section-title">Factual & Procedural Timeline</h2>
          </div>

          <div className="timeline">
            <div className="tl-item">
              <div className="tl-date">Date A — Filing</div>
              <div className="tl-event">Petition for Dissolution Filed</div>
              <div className="tl-detail">Petitioner files for dissolution with request for sole custody, exclusive possession, child support. Service delayed by 14 days.</div>
            </div>
            <div className="tl-item">
              <div className="tl-date">Date B — Service</div>
              <div className="tl-event">Service Executed — 14 Days After Filing</div>
              <div className="tl-detail">Respondent served; has no vehicle, depleted savings, fewer than 30 days to respond.</div>
            </div>
            <div className="tl-item">
              <div className="tl-date">Date C</div>
              <div className="tl-event">Appearance & Enlargement Filed</div>
              <div className="tl-detail">Respondent files pro se appearance and invokes automatic 30-day enlargement under Trial Rule 6(B).</div>
            </div>
            <div className="tl-item">
              <div className="tl-date">Date D</div>
              <div className="tl-event">Verified Affidavit Filed</div>
              <div className="tl-detail">Sworn affidavit discloses all accounts, documents caregiving role, identifies omitted assets.</div>
            </div>
            <div className="tl-item">
              <div className="tl-date">Date E</div>
              <div className="tl-event">Personal Statement Filed</div>
              <div className="tl-detail">Narrative statement providing context on circumstances, financial pattern, and credibility issues.</div>
            </div>
          </div>
        </section>

        {/* SECTION 7: FINAL OUTPUT */}
        <section id="output" className="legal-section">
          <div className="section-header">
            <span className="section-num">§ 07</span>
            <h2 className="section-title">Final Output — Documents Produced</h2>
          </div>

          <p style={{ fontSize: "14px", lineHeight: 1.85, marginBottom: "36px", color: "#444" }}>
            Four documents were produced independently, filed on time, and structured to meet Indiana's procedural and substantive
            requirements.
          </p>

          <div className="doc-summary" style={{ background: "#f5f0e8", padding: "24px", marginBottom: "24px", borderLeft: "4px solid #b8963e" }}>
            <h3 style={{ color: "#1a1208", marginBottom: "12px", fontFamily: "'Playfair Display', serif", fontSize: "18px" }}>
              Four Documents Produced:
            </h3>
            <ol style={{ marginLeft: "20px", color: "#333", lineHeight: 1.8 }}>
              <li>
                <strong>Appearance of Respondent</strong> — Pro se appearance filed within original response window with complete contact
                information.
              </li>
              <li>
                <strong>Notice of Automatic Enlargement of Time</strong> — Invoked Trial Rule 6(B) precisely, extending response deadline
                by 30 days.
              </li>
              <li>
                <strong>Verified Affidavit in Support of Provisional Orders</strong> — Sworn disclosure of all financial accounts
                (including those with no value), documented caregiving role, and identification of omitted marital assets.
              </li>
              <li>
                <strong>Personal Statement in Support of Provisional Orders</strong> — Narrative context on service timing, financial
                pattern, and credibility issues, filed on anniversary of the parties' relationship.
              </li>
            </ol>
          </div>

          <div style={{ background: "#1a1208", padding: "36px 40px", marginTop: "28px" }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                letterSpacing: "3px",
                color: "#b8963e",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              Skills Demonstrated
            </div>
            <div className="skills-row">
              <span className="skill-badge">Independent Statutory Research</span>
              <span className="skill-badge">Issue Spotting</span>
              <span className="skill-badge">IRAC Analysis</span>
              <span className="skill-badge">Case Law Synthesis</span>
              <span className="skill-badge">Document Drafting</span>
              <span className="skill-badge">Procedural Compliance</span>
              <span className="skill-badge">Pro Se Advocacy</span>
              <span className="skill-badge">Financial Disclosure</span>
              <span className="skill-badge">Custody Law</span>
              <span className="skill-badge">Marital Property Law</span>
              <span className="skill-badge">Evidence Organization</span>
              <span className="skill-badge">Systems Thinking</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LegalResearchPortfolio;
