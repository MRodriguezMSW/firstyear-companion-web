import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .fyc-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #0e1f1b;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }
  .bg-orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(74,124,111,0.18) 0%, transparent 70%);
    top: -100px; left: -100px;
    animation: drift1 12s ease-in-out infinite alternate;
  }
  .bg-orb-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(180,140,90,0.12) 0%, transparent 70%);
    bottom: -80px; right: -80px;
    animation: drift2 15s ease-in-out infinite alternate;
  }
  .bg-orb-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(100,160,140,0.1) 0%, transparent 70%);
    top: 50%; left: 60%;
    animation: drift3 18s ease-in-out infinite alternate;
  }

  @keyframes drift1 { from { transform: translate(0,0); } to { transform: translate(40px,30px); } }
  @keyframes drift2 { from { transform: translate(0,0); } to { transform: translate(-30px,-40px); } }
  @keyframes drift3 { from { transform: translate(0,0); } to { transform: translate(-20px,30px); } }

  .card {
    position: relative;
    z-index: 1;
    background: rgba(255,248,235,0.04);
    border: 1px solid rgba(255,248,235,0.1);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 500px;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,248,235,0.08);
    animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1);
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .step-dots {
    display: flex;
    gap: 6px;
    margin-bottom: 32px;
  }
  .dot {
    height: 3px;
    border-radius: 2px;
    background: rgba(255,248,235,0.15);
    transition: all 0.3s ease;
  }
  .dot.active { background: #c4956a; width: 20px; }
  .dot.done { background: rgba(196,149,106,0.4); width: 10px; }
  .dot.pending { width: 10px; }

  .eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #c4956a;
    margin-bottom: 12px;
    opacity: 0.8;
  }

  h1 {
    font-family: 'Lora', serif;
    font-size: 26px;
    font-weight: 500;
    color: #f5ede0;
    line-height: 1.35;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 14px;
    color: rgba(245,237,224,0.55);
    line-height: 1.6;
    margin-bottom: 32px;
  }

  label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: rgba(245,237,224,0.5);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .text-input {
    width: 100%;
    background: rgba(255,248,235,0.05);
    border: 1px solid rgba(255,248,235,0.1);
    border-radius: 12px;
    padding: 14px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #f5ede0;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    margin-bottom: 24px;
  }
  .text-input::placeholder { color: rgba(245,237,224,0.25); }
  .text-input:focus {
    border-color: rgba(196,149,106,0.5);
    background: rgba(255,248,235,0.07);
  }

  .chip-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
  }

  .chip {
    background: rgba(255,248,235,0.04);
    border: 1px solid rgba(255,248,235,0.1);
    border-radius: 12px;
    padding: 14px 18px;
    color: rgba(245,237,224,0.7);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .chip:hover {
    background: rgba(255,248,235,0.07);
    border-color: rgba(255,248,235,0.2);
    color: #f5ede0;
  }
  .chip.selected {
    background: rgba(74,124,111,0.2);
    border-color: rgba(74,124,111,0.6);
    color: #f5ede0;
  }
  .chip-sub {
    font-size: 11px;
    color: rgba(245,237,224,0.35);
    font-weight: 300;
  }
  .chip.selected .chip-sub { color: rgba(245,237,224,0.5); }

  .chip-row {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }

  .emotion-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 24px;
  }

  .emotion-chip {
    background: rgba(255,248,235,0.04);
    border: 1px solid rgba(255,248,235,0.1);
    border-radius: 10px;
    padding: 12px;
    color: rgba(245,237,224,0.65);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.18s ease;
    text-align: center;
  }
  .emotion-chip:hover {
    background: rgba(255,248,235,0.07);
    color: #f5ede0;
  }
  .emotion-chip.selected {
    background: rgba(74,124,111,0.22);
    border-color: rgba(74,124,111,0.55);
    color: #d4ede6;
  }
  .emotion-chip.full { grid-column: span 1; }

  .yesno-row {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }
  .yn-chip {
    flex: 1;
    background: rgba(255,248,235,0.04);
    border: 1px solid rgba(255,248,235,0.1);
    border-radius: 10px;
    padding: 11px;
    color: rgba(245,237,224,0.6);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.18s ease;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
  }
  .yn-chip:hover { background: rgba(255,248,235,0.07); color: #f5ede0; }
  .yn-chip.selected {
    background: rgba(74,124,111,0.22);
    border-color: rgba(74,124,111,0.55);
    color: #d4ede6;
  }

  .section-label {
    font-size: 13px;
    color: rgba(245,237,224,0.55);
    margin-bottom: 10px;
    font-weight: 400;
  }

  .slider-wrap {
    background: rgba(255,248,235,0.04);
    border: 1px solid rgba(255,248,235,0.08);
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 24px;
  }
  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .slider-label { font-size: 12px; color: rgba(245,237,224,0.45); text-transform: uppercase; letter-spacing: 0.07em; font-weight: 500; }
  .slider-value { font-size: 13px; color: #c4956a; font-weight: 500; }

  input[type=range] {
    width: 100%;
    height: 4px;
    appearance: none;
    background: rgba(255,248,235,0.1);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
    margin-bottom: 8px;
  }
  input[type=range]::-webkit-slider-thumb {
    appearance: none;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: #c4956a;
    box-shadow: 0 0 0 4px rgba(196,149,106,0.2);
    transition: box-shadow 0.2s;
  }
  input[type=range]:hover::-webkit-slider-thumb {
    box-shadow: 0 0 0 6px rgba(196,149,106,0.25);
  }
  .slider-hints {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: rgba(245,237,224,0.25);
  }

  textarea {
    width: 100%;
    background: rgba(255,248,235,0.04);
    border: 1px solid rgba(255,248,235,0.08);
    border-radius: 12px;
    padding: 14px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #f5ede0;
    outline: none;
    resize: none;
    min-height: 90px;
    transition: border-color 0.2s;
    margin-bottom: 6px;
  }
  textarea::placeholder { color: rgba(245,237,224,0.2); }
  textarea:focus { border-color: rgba(196,149,106,0.4); }
  .textarea-hint { font-size: 11px; color: rgba(245,237,224,0.25); margin-bottom: 28px; }

  .btn-row {
    display: flex;
    gap: 10px;
    margin-top: 4px;
  }

  .btn-back {
    flex: 0 0 auto;
    background: transparent;
    border: 1px solid rgba(255,248,235,0.12);
    border-radius: 12px;
    padding: 14px 22px;
    color: rgba(245,237,224,0.45);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-back:hover { color: rgba(245,237,224,0.7); border-color: rgba(255,248,235,0.22); }

  .btn-next {
    flex: 1;
    background: linear-gradient(135deg, #c4956a 0%, #a87a52 100%);
    border: none;
    border-radius: 12px;
    padding: 15px 24px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 20px rgba(196,149,106,0.3);
    letter-spacing: 0.01em;
  }
  .btn-next:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 28px rgba(196,149,106,0.4);
  }
  .btn-next:active { transform: translateY(0); }

  .skip-hint {
    text-align: center;
    font-size: 11px;
    color: rgba(245,237,224,0.2);
    margin-top: 14px;
  }

  /* Welcome screen */
  .welcome-icon {
    width: 52px; height: 52px;
    background: rgba(196,149,106,0.12);
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 28px;
    font-size: 24px;
  }
  .welcome-h1 {
    font-family: 'Lora', serif;
    font-size: 30px;
    font-weight: 500;
    color: #f5ede0;
    line-height: 1.3;
    margin-bottom: 16px;
  }
  .welcome-body {
    font-size: 15px;
    color: rgba(245,237,224,0.5);
    line-height: 1.7;
    margin-bottom: 36px;
  }
  .trust-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 36px;
  }
  .trust-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,248,235,0.05);
    border: 1px solid rgba(255,248,235,0.08);
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 12px;
    color: rgba(245,237,224,0.45);
  }
  .trust-pill span { font-size: 13px; }

  .date-input-wrap {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255,248,235,0.07);
  }
  .date-invite {
    font-size: 12px;
    color: rgba(245,237,224,0.35);
    line-height: 1.55;
    margin-bottom: 10px;
  }
  .date-input {
    background: rgba(255,248,235,0.04);
    border: 1px solid rgba(255,248,235,0.08);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #f5ede0;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
    color-scheme: dark;
  }
  .date-input:focus { border-color: rgba(196,149,106,0.4); }
  .diagnosis-context {
    margin-top: 10px;
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 12px;
    line-height: 1.5;
    background: rgba(255,248,235,0.04);
    border: 1px solid rgba(255,248,235,0.08);
    animation: cardIn 0.3s ease;
  }
  .diagnosis-context-label {
    font-weight: 500;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
    background: rgba(74,124,111,0.12);
    border: 1px solid rgba(74,124,111,0.3);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    font-size: 13px;
    color: rgba(245,237,224,0.7);
    line-height: 1.55;
  }
  .provider-banner strong { color: #8ecfbe; display: block; margin-bottom: 4px; font-size: 13px; }
`;

const SCREENS = ["welcome", "identity", "timeline", "checkin"];

const daysSince = (dateStr) => {
  if (!dateStr) return null;
  const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
};

const diagnosisContext = (days) => {
  if (days === null) return null;
  if (days <= 14) return { label: "Very recent", note: "Just " + days + " day" + (days === 1 ? "" : "s") + " ago — this is still very new.", color: "#e8a87c" };
  if (days <= 90) return { label: "Early adjustment", note: Math.floor(days/7) + " weeks in — still the early chapter.", color: "#c4956a" };
  if (days <= 365) return { label: "First year", note: "About " + Math.floor(days/30) + " months in.", color: "#8ecfbe" };
  return { label: "Beyond the first year", note: Math.floor(days/365) + " year" + (days >= 730 ? "s" : "") + " since diagnosis.", color: "#8ecfbe" };
};

const intensityLabel = (v) => {
  if (v <= 2) return "Calm";
  if (v <= 4) return "Mild";
  if (v <= 6) return "Moderate";
  if (v <= 8) return "High";
  return "Intense";
};

export default function FirstYearCompanion() {
  const [screen, setScreen] = useState(0);
  const [name, setName] = useState("");
  const [pronoun, setPronoun] = useState("");
  const [timeline, setTimeline] = useState("");
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [onMeds, setOnMeds] = useState("");
  const [hasProvider, setHasProvider] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [emotions, setEmotions] = useState([]);
  const [freeText, setFreeText] = useState("");

  const toggleEmotion = (e) =>
    setEmotions((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );

  const showProviderBanner =
    screen === 2 && (onMeds === "No" || hasProvider === "No");

  const go = (dir) => setScreen((s) => Math.max(0, Math.min(3, s + dir)));

  return (
    <>
      <style>{styles}</style>
      <div className="fyc-root">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />

        {/* ── WELCOME ── */}
        {screen === 0 && (
          <div className="card" key="welcome">
            <div className="welcome-icon">🌱</div>
            <p className="eyebrow">FirstYear Companion</p>
            <h1 className="welcome-h1">You are not alone.</h1>
            <p className="welcome-body">
              This is a calm, confidential space to reflect, ask questions,
              and move at your own pace — during your first year after an
              HIV diagnosis.
            </p>
            <div className="trust-pills">
              <div className="trust-pill"><span>🔒</span> Confidential</div>
              <div className="trust-pill"><span>💛</span> Judgment-free</div>
              <div className="trust-pill"><span>⏸️</span> Skip anything</div>
            </div>
            <button className="btn-next" style={{ width: "100%" }} onClick={() => go(1)}>
              Get started
            </button>
            <p className="skip-hint">Takes about 2 minutes</p>
          </div>
        )}

        {/* ── IDENTITY ── */}
        {screen === 1 && (
          <div className="card" key="identity">
            <div className="step-dots">
              {[0,1,2,3].map(i => (
                <div key={i} className={`dot ${i < 1 ? "done" : i === 1 ? "active" : "pending"}`} />
              ))}
            </div>
            <p className="eyebrow">Step 1 of 3</p>
            <h1>How would you like me to address you?</h1>
            <p className="subtitle">Everything here is optional. Use whatever feels right.</p>

            <label>Name or nickname</label>
            <input
              className="text-input"
              placeholder="What should I call you?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Pronouns</label>
            <div className="chip-grid">
              {["She/her", "He/him", "They/them", "Use my name only", "Prefer not to say"].map((p) => (
                <button
                  key={p}
                  className={`chip ${pronoun === p ? "selected" : ""}`}
                  onClick={() => setPronoun(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="btn-row">
              <button className="btn-back" onClick={() => go(-1)}>Back</button>
              <button className="btn-next" onClick={() => go(1)}>Continue</button>
            </div>
          </div>
        )}

        {/* ── TIMELINE ── */}
        {screen === 2 && (
          <div className="card" key="timeline">
            <div className="step-dots">
              {[0,1,2,3].map(i => (
                <div key={i} className={`dot ${i < 2 ? "done" : i === 2 ? "active" : "pending"}`} />
              ))}
            </div>
            <p className="eyebrow">Step 2 of 3</p>
            <h1>A quick check-in</h1>
            <p className="subtitle">This helps me tailor my support to where you actually are. Skip anything.</p>

            <div className="section-label">When were you diagnosed?</div>

            <p className="date-invite" style={{ marginBottom: 10 }}>If you remember the date, enter it here — it helps me understand exactly where you are.</p>
            <input
              type="date"
              className="date-input"
              max={new Date().toISOString().split("T")[0]}
              value={diagnosisDate}
              onChange={(e) => { setDiagnosisDate(e.target.value); setTimeline(""); }}
            />
            {diagnosisContext(daysSince(diagnosisDate)) && (() => {
              const ctx = diagnosisContext(daysSince(diagnosisDate));
              return (
                <div className="diagnosis-context" style={{ marginBottom: 4 }}>
                  <div className="diagnosis-context-label" style={{ color: ctx.color }}>{ctx.label}</div>
                  <div style={{ color: "rgba(245,237,224,0.5)" }}>{ctx.note}</div>
                </div>
              );
            })()}

            <div className="date-input-wrap" style={{ marginBottom: 20 }}>
              <p className="date-invite">Don't remember the exact date? That's okay — pick a range instead.</p>
              <div className="chip-grid" style={{ marginBottom: 0 }}>
                {[
                  ["Within the last 3 months", "New diagnosis · early adjustment"],
                  ["3–12 months ago", "Still within the first year"],
                  ["1–3 years ago", "Building stability and routine"],
                  ["More than 3 years ago", "Longer-term management"],
                  ["Prefer not to say", ""],
                ].map(([label, sub]) => (
                  <button
                    key={label}
                    className={`chip ${timeline === label ? "selected" : ""}`}
                    onClick={() => { setTimeline(label); setDiagnosisDate(""); }}
                  >
                    {label}
                    {sub && <span className="chip-sub">{sub}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 4 }} />
            <div className="section-label">Are you currently on HIV medication?</div>
            <div className="yesno-row" style={{ marginBottom: 20 }}>
              {["Yes", "No", "Not sure"].map((v) => (
                <button
                  key={v}
                  className={`yn-chip ${onMeds === v ? "selected" : ""}`}
                  onClick={() => setOnMeds(v)}
                >{v}</button>
              ))}
            </div>

            <div className="section-label">Do you have an HIV provider right now?</div>
            <div className="yesno-row" style={{ marginBottom: 20 }}>
              {["Yes", "No", "Not sure"].map((v) => (
                <button
                  key={v}
                  className={`yn-chip ${hasProvider === v ? "selected" : ""}`}
                  onClick={() => setHasProvider(v)}
                >{v}</button>
              ))}
            </div>

            {showProviderBanner && (
              <div className="provider-banner">
                <strong>Finding care is a big step — we can help.</strong>
                After this, I can help you find an HIV provider or clinic near you. You're not on your own with this.
              </div>
            )}

            <div className="btn-row">
              <button className="btn-back" onClick={() => go(-1)}>Back</button>
              <button className="btn-next" onClick={() => go(1)}>Continue</button>
            </div>
          </div>
        )}

        {/* ── CHECK-IN ── */}
        {screen === 3 && (
          <div className="card" key="checkin">
            <div className="step-dots">
              {[0,1,2,3].map(i => (
                <div key={i} className={`dot ${i < 3 ? "done" : "active"}`} />
              ))}
            </div>
            <p className="eyebrow">Step 3 of 3</p>
            <h1>How are you feeling right now?</h1>
            <p className="subtitle">
              This helps me meet you where you are. You can skip anything.
            </p>

            <div className="slider-wrap">
              <div className="slider-header">
                <span className="slider-label">Emotional intensity</span>
                <span className="slider-value">{intensityLabel(intensity)} · {intensity}/10</span>
              </div>
              <input
                type="range" min={0} max={10} value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
              />
              <div className="slider-hints">
                <span>0 · Calm</span>
                <span>10 · Feels unbearable</span>
              </div>
            </div>

            <div className="section-label" style={{ marginBottom: 10 }}>What's present for you?</div>
            <div className="emotion-grid">
              {["Anxious","Sad","Overwhelmed","Numb","Angry","Lonely","Tired","Hopeful","Okay"].map((e, i) => (
                <button
                  key={e}
                  className={`emotion-chip ${emotions.includes(e) ? "selected" : ""} ${i === 8 ? "full" : ""}`}
                  onClick={() => toggleEmotion(e)}
                >{e}</button>
              ))}
            </div>

            <label>Anything you want to share right now?</label>
            <textarea
              placeholder="You can write a sentence or two..."
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
            />
            <p className="textarea-hint">Avoid names, phone numbers, or anything identifying.</p>

            <div className="btn-row">
              <button className="btn-back" onClick={() => go(-1)}>Back</button>
              <button className="btn-next" onClick={() => alert(`Starting chat...\n\nContext passed to Nova:\n• Name: ${name || "not given"}\n• Pronouns: ${pronoun || "not given"}\n• Diagnosis range: ${timeline || "not given"}\n• Diagnosis date: ${diagnosisDate ? diagnosisDate + " (" + daysSince(diagnosisDate) + " days ago)" : "not given"}\n• On meds: ${onMeds || "not given"}\n• Has provider: ${hasProvider || "not given"}\n• Intensity: ${intensity}/10\n• Emotions: ${emotions.join(", ") || "none selected"}\n• Note: "${freeText || "none"}"\n• Provider help needed: ${showProviderBanner ? "Yes" : "No"}`)}>
                Start chat
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
