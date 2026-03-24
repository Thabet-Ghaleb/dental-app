import { useState, useEffect } from "react";

// Simulated database
const mockDB = {
  "+962791234567": { firstName: "Ahmad", lastName: "Khalil", dob: "1990-03-15", lastVisit: "2025-11-15", visits: 4 },
  "+962799876543": { firstName: "Sara", lastName: "Mansour", dob: "1985-07-22", lastVisit: "2026-01-08", visits: 2 },
};

// ─── STYLES ───
const colors = {
  bg: "#F0F4F3",
  card: "#FFFFFF",
  primary: "#1A6B5A",
  primaryLight: "#E8F5F0",
  primaryDark: "#0E4A3C",
  accent: "#D4A853",
  text: "#1E2D2B",
  textLight: "#5A706C",
  error: "#C0392B",
  errorBg: "#FDF0EE",
  success: "#27AE60",
  successBg: "#EAFAF1",
  border: "#D5DDD9",
  inputBg: "#F7FAF9",
};

const font = "'DM Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

// ─── PHONE KEYPAD ───
function PhoneKeypad({ value, onChange, countryCode = "+962" }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "delete"];

  const handleKey = (key) => {
    if (key === "clear") onChange("");
    else if (key === "delete") onChange(value.slice(0, -1));
    else if (value.length < 12) onChange(value + key);
  };

  const formatPhone = (num) => {
    if (num.length <= 3) return num;
    if (num.length <= 6) return `${num.slice(0, 3)} ${num.slice(3)}`;
    return `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{
        background: colors.inputBg,
        border: `2px solid ${value.length >= 9 ? colors.primary : colors.border}`,
        borderRadius: 16,
        padding: "20px 32px",
        minWidth: 320,
        textAlign: "center",
        transition: "border-color 0.3s",
      }}>
        <span style={{ color: colors.textLight, fontSize: 18, fontFamily: font, marginRight: 8 }}>{countryCode}</span>
        <span style={{
          fontSize: 32,
          fontFamily: font,
          fontWeight: 600,
          color: colors.text,
          letterSpacing: 2,
        }}>
          {formatPhone(value) || <span style={{ color: colors.border }}>--- --- ----</span>}
        </span>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 88px)",
        gap: 10,
      }}>
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            style={{
              height: 64,
              borderRadius: 14,
              border: key === "clear" || key === "delete" ? `1px solid ${colors.border}` : "none",
              background: key === "clear" || key === "delete" ? "transparent" : colors.card,
              boxShadow: key === "clear" || key === "delete" ? "none" : "0 2px 8px rgba(0,0,0,0.06)",
              fontSize: key === "clear" || key === "delete" ? 14 : 26,
              fontFamily: font,
              fontWeight: 600,
              color: key === "clear" ? colors.error : key === "delete" ? colors.textLight : colors.text,
              cursor: "pointer",
              transition: "transform 0.1s, box-shadow 0.1s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.95)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            {key === "delete" ? "⌫" : key === "clear" ? "Clear" : key}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── FORM INPUT ───
function FormInput({ label, type = "text", value, onChange, required, placeholder, error }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block",
        fontSize: 14,
        fontFamily: font,
        fontWeight: 600,
        color: colors.textLight,
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 1,
      }}>
        {label} {required && <span style={{ color: colors.accent }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: 18,
          fontFamily: font,
          border: `2px solid ${error ? colors.error : colors.border}`,
          borderRadius: 12,
          background: colors.inputBg,
          color: colors.text,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => { e.target.style.borderColor = colors.primary; }}
        onBlur={(e) => { e.target.style.borderColor = error ? colors.error : colors.border; }}
      />
      {error && <div style={{ color: colors.error, fontSize: 13, marginTop: 4, fontFamily: font }}>{error}</div>}
    </div>
  );
}

// ─── SELECT INPUT ───
function FormSelect({ label, value, onChange, options, required }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block", fontSize: 14, fontFamily: font, fontWeight: 600,
        color: colors.textLight, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1,
      }}>
        {label} {required && <span style={{ color: colors.accent }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", padding: "14px 16px", fontSize: 18, fontFamily: font,
          border: `2px solid ${colors.border}`, borderRadius: 12,
          background: colors.inputBg, color: colors.text, outline: "none",
          boxSizing: "border-box",
        }}
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── YES/NO TOGGLE ───
function YesNo({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 16, fontFamily: font, fontWeight: 500, color: colors.text, marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: "flex", gap: 12 }}>
        {["Yes", "No"].map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              flex: 1, padding: "14px", borderRadius: 12, fontSize: 18, fontFamily: font, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
              border: `2px solid ${value === opt ? (opt === "Yes" ? colors.primary : colors.textLight) : colors.border}`,
              background: value === opt ? (opt === "Yes" ? colors.primaryLight : "#F5F5F5") : "white",
              color: value === opt ? (opt === "Yes" ? colors.primary : colors.text) : colors.textLight,
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── BUTTON ───
function Btn({ children, onClick, variant = "primary", disabled, style: s }) {
  const base = {
    padding: "16px 40px", borderRadius: 14, fontSize: 18, fontFamily: font,
    fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    border: "none", transition: "all 0.2s", opacity: disabled ? 0.5 : 1,
    display: "inline-flex", alignItems: "center", gap: 8, ...s,
  };
  const styles = {
    primary: { ...base, background: colors.primary, color: "white" },
    secondary: { ...base, background: "transparent", color: colors.primary, border: `2px solid ${colors.primary}` },
    ghost: { ...base, background: "transparent", color: colors.textLight, padding: "12px 24px" },
  };
  return <button onClick={disabled ? undefined : onClick} style={styles[variant]}>{children}</button>;
}

// ─── PROGRESS BAR ───
function ProgressBar({ step, total, labels }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        {labels.map((label, i) => (
          <div key={i} style={{
            fontSize: 12, fontFamily: font, fontWeight: i <= step ? 700 : 400,
            color: i <= step ? colors.primary : colors.textLight,
            textTransform: "uppercase", letterSpacing: 0.5,
          }}>{label}</div>
        ))}
      </div>
      <div style={{ height: 6, background: colors.border, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
          borderRadius: 3, width: `${((step + 1) / total) * 100}%`,
          transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function DentalIntake() {
  const [screen, setScreen] = useState("welcome");
  const [phone, setPhone] = useState("");
  const [foundPatient, setFoundPatient] = useState(null);
  const [formStep, setFormStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  // Form data
  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", gender: "", email: "",
    allergies: "No", allergyDetail: "",
    medications: "No", medicationDetail: "",
    conditions: "No", conditionDetail: "",
    lastDentalVisit: "",
    dentalPain: "No", painDetail: "",
    consent: false,
  });

  const updateForm = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const transition = (nextScreen) => {
    setFadeIn(false);
    setTimeout(() => { setScreen(nextScreen); setFadeIn(true); }, 200);
  };

  // Phone lookup
  const handleLookup = () => {
    const normalized = "+962" + phone.replace(/^0/, "");
    const found = mockDB[normalized];
    if (found) {
      setFoundPatient(found);
      transition("welcomeBack");
    } else {
      transition("form");
    }
  };

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setScreen("welcome");
      setPhone("");
      setFormStep(0);
      setForm({
        firstName: "", lastName: "", dob: "", gender: "", email: "",
        allergies: "No", allergyDetail: "", medications: "No", medicationDetail: "",
        conditions: "No", conditionDetail: "", lastDentalVisit: "",
        dentalPain: "No", painDetail: "", consent: false,
      });
    }, 3000);
  };

  const formSteps = ["Personal", "Medical", "Dental", "Confirm"];

  // ─── SCREENS ───
  const renderWelcome = () => (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🦷</div>
      <h1 style={{
        fontFamily: fontDisplay, fontSize: 40, fontWeight: 700,
        color: colors.primaryDark, marginBottom: 8, lineHeight: 1.2,
      }}>
        Welcome
      </h1>
      <p style={{ fontFamily: font, fontSize: 18, color: colors.textLight, marginBottom: 48 }}>
        Tap below to check in for your appointment
      </p>
      <Btn onClick={() => transition("phone")} style={{ padding: "20px 64px", fontSize: 22, borderRadius: 18 }}>
        Check In →
      </Btn>
    </div>
  );

  const renderPhone = () => (
    <div style={{ textAlign: "center", padding: "32px 20px" }}>
      <Btn variant="ghost" onClick={() => transition("welcome")} style={{ position: "absolute", top: 20, left: 20 }}>
        ← Back
      </Btn>
      <h2 style={{ fontFamily: fontDisplay, fontSize: 30, color: colors.primaryDark, marginBottom: 8 }}>
        Enter Your Phone Number
      </h2>
      <p style={{ fontFamily: font, fontSize: 16, color: colors.textLight, marginBottom: 32 }}>
        We'll use this to find your records
      </p>
      <PhoneKeypad value={phone} onChange={setPhone} />
      <div style={{ marginTop: 24 }}>
        <Btn onClick={handleLookup} disabled={phone.length < 9} style={{ padding: "18px 56px", fontSize: 20 }}>
          Continue →
        </Btn>
      </div>
    </div>
  );

  const renderWelcomeBack = () => (
    <div style={{ textAlign: "center", padding: "48px 20px" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%", background: colors.successBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px", fontSize: 36,
      }}>✓</div>
      <h2 style={{ fontFamily: fontDisplay, fontSize: 34, color: colors.primaryDark, marginBottom: 8 }}>
        Welcome back, {foundPatient?.firstName}!
      </h2>
      <p style={{ fontFamily: font, fontSize: 18, color: colors.textLight, marginBottom: 12 }}>
        Your information is already on file.
      </p>
      <div style={{
        background: colors.primaryLight, borderRadius: 16, padding: "20px 32px",
        display: "inline-block", marginBottom: 32,
      }}>
        <div style={{ fontFamily: font, fontSize: 14, color: colors.textLight, marginBottom: 4 }}>Last visit</div>
        <div style={{ fontFamily: font, fontSize: 20, fontWeight: 600, color: colors.primary }}>
          {foundPatient?.lastVisit}
        </div>
        <div style={{ fontFamily: font, fontSize: 14, color: colors.textLight, marginTop: 4 }}>
          Total visits: {foundPatient?.visits}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <Btn onClick={handleSubmit}>All Good — Check Me In</Btn>
        <Btn variant="secondary" onClick={() => { setFormStep(0); transition("form"); }}>
          Update My Info
        </Btn>
      </div>
    </div>
  );

  const renderFormStep = () => {
    switch (formStep) {
      case 0: return (
        <>
          <h3 style={{ fontFamily: fontDisplay, fontSize: 26, color: colors.primaryDark, marginBottom: 24 }}>
            Personal Information
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <FormInput label="First Name" value={form.firstName} onChange={(v) => updateForm("firstName", v)} required placeholder="Ahmad" />
            <FormInput label="Last Name" value={form.lastName} onChange={(v) => updateForm("lastName", v)} required placeholder="Khalil" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <FormInput label="Date of Birth" type="date" value={form.dob} onChange={(v) => updateForm("dob", v)} required />
            <FormSelect label="Gender" value={form.gender} onChange={(v) => updateForm("gender", v)} options={["Male", "Female"]} required />
          </div>
          <FormInput label="Email" type="email" value={form.email} onChange={(v) => updateForm("email", v)} placeholder="optional" />
        </>
      );
      case 1: return (
        <>
          <h3 style={{ fontFamily: fontDisplay, fontSize: 26, color: colors.primaryDark, marginBottom: 24 }}>
            Medical History
          </h3>
          <YesNo label="Do you have any allergies?" value={form.allergies} onChange={(v) => updateForm("allergies", v)} />
          {form.allergies === "Yes" && (
            <FormInput label="Please list your allergies" value={form.allergyDetail} onChange={(v) => updateForm("allergyDetail", v)} placeholder="e.g., Penicillin, Latex" />
          )}
          <YesNo label="Are you currently taking any medications?" value={form.medications} onChange={(v) => updateForm("medications", v)} />
          {form.medications === "Yes" && (
            <FormInput label="Please list your medications" value={form.medicationDetail} onChange={(v) => updateForm("medicationDetail", v)} placeholder="e.g., Blood pressure medication" />
          )}
          <YesNo label="Do you have any medical conditions? (diabetes, heart disease, etc.)" value={form.conditions} onChange={(v) => updateForm("conditions", v)} />
          {form.conditions === "Yes" && (
            <FormInput label="Please describe" value={form.conditionDetail} onChange={(v) => updateForm("conditionDetail", v)} placeholder="e.g., Type 2 Diabetes" />
          )}
        </>
      );
      case 2: return (
        <>
          <h3 style={{ fontFamily: fontDisplay, fontSize: 26, color: colors.primaryDark, marginBottom: 24 }}>
            Dental History
          </h3>
          <FormSelect label="When was your last dental visit?" value={form.lastDentalVisit}
            onChange={(v) => updateForm("lastDentalVisit", v)}
            options={["Less than 6 months", "6-12 months", "1-2 years", "More than 2 years", "First time"]} required />
          <YesNo label="Are you currently experiencing any dental pain?" value={form.dentalPain} onChange={(v) => updateForm("dentalPain", v)} />
          {form.dentalPain === "Yes" && (
            <FormInput label="Please describe the pain and location" value={form.painDetail} onChange={(v) => updateForm("painDetail", v)} placeholder="e.g., Sharp pain in lower right molar" />
          )}
        </>
      );
      case 3: return (
        <>
          <h3 style={{ fontFamily: fontDisplay, fontSize: 26, color: colors.primaryDark, marginBottom: 24 }}>
            Review & Confirm
          </h3>
          <div style={{ background: colors.inputBg, borderRadius: 16, padding: 24, marginBottom: 20 }}>
            {[
              ["Name", `${form.firstName} ${form.lastName}`],
              ["Date of Birth", form.dob],
              ["Gender", form.gender],
              ["Allergies", form.allergies === "Yes" ? form.allergyDetail : "None"],
              ["Medications", form.medications === "Yes" ? form.medicationDetail : "None"],
              ["Dental Pain", form.dentalPain === "Yes" ? form.painDetail : "None"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${colors.border}` }}>
                <span style={{ fontFamily: font, fontSize: 15, color: colors.textLight, fontWeight: 600 }}>{k}</span>
                <span style={{ fontFamily: font, fontSize: 15, color: colors.text, fontWeight: 500 }}>{v || "—"}</span>
              </div>
            ))}
          </div>
          <div
            onClick={() => updateForm("consent", !form.consent)}
            style={{
              display: "flex", alignItems: "center", gap: 14, padding: 16,
              background: form.consent ? colors.primaryLight : "white",
              border: `2px solid ${form.consent ? colors.primary : colors.border}`,
              borderRadius: 14, cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, border: `2px solid ${form.consent ? colors.primary : colors.border}`,
              background: form.consent ? colors.primary : "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 16, fontWeight: "bold", flexShrink: 0,
            }}>
              {form.consent && "✓"}
            </div>
            <span style={{ fontFamily: font, fontSize: 15, color: colors.text }}>
              I confirm that the information provided is accurate and I consent to treatment.
            </span>
          </div>
        </>
      );
    }
  };

  const renderForm = () => (
    <div style={{ padding: "24px 32px", maxWidth: 600, margin: "0 auto" }}>
      <Btn variant="ghost" onClick={() => formStep === 0 ? transition("phone") : setFormStep(formStep - 1)}>
        ← {formStep === 0 ? "Back" : "Previous"}
      </Btn>
      <ProgressBar step={formStep} total={4} labels={formSteps} />
      {renderFormStep()}
      <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
        {formStep < 3 ? (
          <Btn onClick={() => setFormStep(formStep + 1)}>Next →</Btn>
        ) : (
          <Btn onClick={handleSubmit} disabled={!form.consent}>Submit ✓</Btn>
        )}
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }}>
      <div style={{
        background: "white", borderRadius: 24, padding: "48px 56px", textAlign: "center",
        animation: "pop 0.3s ease",
        boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", background: colors.successBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 32,
        }}>✓</div>
        <h2 style={{ fontFamily: fontDisplay, fontSize: 28, color: colors.primaryDark, marginBottom: 8 }}>
          You're All Set!
        </h2>
        <p style={{ fontFamily: font, fontSize: 16, color: colors.textLight }}>
          Please take a seat. We'll call your name shortly.
        </p>
      </div>
    </div>
  );

  const screens = { welcome: renderWelcome, phone: renderPhone, welcomeBack: renderWelcomeBack, form: renderForm };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${colors.bg} 0%, #E4EDE8 50%, #F5EDE4 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: font,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        * { box-sizing: border-box; margin: 0; }
        input, select, button { font-family: ${font}; }
      `}</style>

      <div style={{
        width: "100%",
        maxWidth: 680,
        minHeight: 620,
        background: colors.card,
        borderRadius: 28,
        boxShadow: "0 8px 60px rgba(26,107,90,0.1), 0 2px 8px rgba(0,0,0,0.04)",
        position: "relative",
        overflow: "hidden",
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}>
        {/* Top accent bar */}
        <div style={{
          height: 5,
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
        }} />

        {screens[screen]?.()}
      </div>

      {showSuccess && renderSuccess()}
    </div>
  );
}
