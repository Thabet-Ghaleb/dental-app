import { useState } from "react";

const colors = {
  bg: "#F0F4F8",
  card: "#FFFFFF",
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  primaryDark: "#1D4ED8",
  accent: "#64748B",
  text: "#0F172A",
  textLight: "#64748B",
  error: "#EF4444",
  errorBg: "#FEF2F2",
  success: "#22C55E",
  successBg: "#F0FDF4",
  warning: "#F59E0B",
  warningBg: "#FFFBEB",
  border: "#E2E8F0",
  inputBg: "#F8FAFC",
};

const font = "'DM Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

function initials(f, l) { return `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase(); }
function fmtTime(date) { return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }); }

function Avatar({ first, last, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: colors.primary,
      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: font, fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
    }}>{initials(first, last)}</div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontFamily: font, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>}
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          padding: "11px 14px", fontSize: 15, fontFamily: font,
          border: `2px solid ${focused ? colors.primary : colors.border}`,
          borderRadius: 10, background: colors.inputBg, color: colors.text,
          outline: "none", transition: "border-color 0.2s", width: "100%", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontFamily: font, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>}
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} rows={3}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          padding: "11px 14px", fontSize: 15, fontFamily: font,
          border: `2px solid ${focused ? colors.primary : colors.border}`,
          borderRadius: 10, background: colors.inputBg, color: colors.text,
          outline: "none", transition: "border-color 0.2s", width: "100%",
          boxSizing: "border-box", resize: "vertical",
        }}
      />
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150,
    }} onClick={onClose}>
      <div style={{
        background: "white", borderRadius: 20, padding: 32, width: "100%", maxWidth: 520,
        boxShadow: "0 24px 80px rgba(0,0,0,0.2)", animation: "pop 0.25s ease",
        maxHeight: "90vh", overflowY: "auto",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 22, color: colors.primaryDark, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: colors.textLight, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    waiting:  { label: "Waiting",   bg: colors.warningBg, color: colors.warning },
    "in-progress": { label: "In Progress", bg: colors.primaryLight, color: colors.primary },
    done:     { label: "Done",      bg: colors.successBg, color: colors.success },
  };
  const s = map[status] || map.waiting;
  return (
    <span style={{
      padding: "4px 12px", borderRadius: 20, fontSize: 12, fontFamily: font,
      fontWeight: 700, background: s.bg, color: s.color,
    }}>{s.label}</span>
  );
}

export default function DoctorPage({ patients = [], setPatients, showToast }) {
  const [selected, setSelected] = useState(null);
  const [treatmentNote, setTreatmentNote] = useState("");
  const [treatmentCost, setTreatmentCost] = useState("");
  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [activeTab, setActiveTab] = useState("treatment");

  const today = new Date().toDateString();

  const todayPatients = patients
    .filter((p) => p.checkins?.some((c) => new Date(c.ts).toDateString() === today))
    .map((p) => ({ ...p, status: p.status || "waiting" }))
    .sort((a, b) => {
      const order = { "in-progress": 0, waiting: 1, done: 2 };
      return (order[a.status] ?? 1) - (order[b.status] ?? 1);
    });

  const openPatient = (p) => {
    setSelected(p);
    setTreatmentNote(p.latestNote || "");
    setTreatmentCost(p.latestCost || "");
    setEditFirst(p.firstName);
    setEditLast(p.lastName);
    setEditPhone(p.phone);
    setActiveTab("treatment");
  };

  const updateStatus = (patient, status) => {
    setPatients((prev) => prev.map((p) => p.id === patient.id ? { ...p, status } : p));
    if (selected?.id === patient.id) setSelected((s) => ({ ...s, status }));
  };

  const saveTreatment = () => {
    setPatients((prev) => prev.map((p) =>
      p.id === selected.id ? { ...p, latestNote: treatmentNote, latestCost: treatmentCost, status: "done" } : p
    ));
    setSelected(null);
    showToast("Treatment saved");
  };

  const saveInfo = () => {
    setPatients((prev) => prev.map((p) =>
      p.id === selected.id ? { ...p, firstName: editFirst.trim(), lastName: editLast.trim(), phone: editPhone.trim() } : p
    ));
    setSelected((s) => ({ ...s, firstName: editFirst.trim(), lastName: editLast.trim(), phone: editPhone.trim() }));
    showToast("Patient info updated");
    setActiveTab("treatment");
  };

  const waiting = todayPatients.filter((p) => p.status === "waiting").length;
  const done = todayPatients.filter((p) => p.status === "done").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { label: "Total Today", value: todayPatients.length, color: colors.primary, bg: colors.primaryLight },
          { label: "Waiting", value: waiting, color: colors.warning, bg: colors.warningBg },
          { label: "Done", value: done, color: colors.success, bg: colors.successBg },
        ].map((s) => (
          <div key={s.label} style={{ background: colors.card, borderRadius: 16, padding: "18px 24px", boxShadow: "0 2px 16px rgba(37,99,235,0.06)" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: font }}>{s.value}</div>
            <div style={{ fontSize: 12, color: colors.textLight, fontFamily: font, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Patient Queue */}
      <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${colors.border}` }}>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 20, color: colors.primaryDark, margin: 0 }}>Today's Queue</h2>
        </div>

        {todayPatients.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: colors.textLight, fontFamily: font }}>No patients checked in today</div>
        ) : (
          todayPatients.map((p, i) => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 28px",
              borderBottom: i < todayPatients.length - 1 ? `1px solid ${colors.border}` : "none",
              background: p.status === "done" ? "#FAFAFA" : "white",
              opacity: p.status === "done" ? 0.7 : 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar first={p.firstName} last={p.lastName} />
                <div>
                  <div style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: colors.text }}>
                    {p.firstName} {p.lastName}
                  </div>
                  <div style={{ fontFamily: font, fontSize: 12, color: colors.textLight }}>
                    {p.phone} · {fmtTime(p.checkins[0].ts)}
                    {p.latestNote && <span style={{ marginLeft: 8, color: colors.accent }}>· {p.latestNote.slice(0, 30)}{p.latestNote.length > 30 ? "..." : ""}</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StatusBadge status={p.status || "waiting"} />
                {p.latestCost && (
                  <span style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: colors.success }}>
                    ${p.latestCost}
                  </span>
                )}
                <button
                  onClick={() => openPatient(p)}
                  style={{
                    padding: "7px 18px", borderRadius: 10, background: colors.primary,
                    color: "white", border: "none", fontFamily: font, fontWeight: 700,
                    fontSize: 13, cursor: "pointer",
                  }}
                >Open →</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Patient Modal */}
      {selected && (
        <Modal title={`${selected.firstName} ${selected.lastName}`} onClose={() => setSelected(null)}>

          {/* Status buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["waiting", "in-progress", "done"].map((s) => (
              <button key={s} onClick={() => updateStatus(selected, s)} style={{
                flex: 1, padding: "8px", borderRadius: 10, fontFamily: font, fontWeight: 700,
                fontSize: 13, cursor: "pointer", border: `2px solid ${selected.status === s ? colors.primary : colors.border}`,
                background: selected.status === s ? colors.primaryLight : "white",
                color: selected.status === s ? colors.primary : colors.textLight,
                transition: "all 0.15s", textTransform: "capitalize",
              }}>{s.replace("-", " ")}</button>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, background: colors.inputBg, borderRadius: 10, padding: 4, marginBottom: 20 }}>
            {["treatment", "edit info"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: "8px", borderRadius: 8, fontFamily: font, fontWeight: 700,
                fontSize: 13, border: "none", cursor: "pointer", textTransform: "capitalize",
                background: activeTab === tab ? "white" : "transparent",
                color: activeTab === tab ? colors.primary : colors.textLight,
                boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}>{tab}</button>
            ))}
          </div>

          {activeTab === "treatment" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Textarea
                label="Treatment Notes"
                value={treatmentNote}
                onChange={setTreatmentNote}
                placeholder="e.g. Filling on lower right molar, composite resin..."
              />
              <Input
                label="Cost (JOD)"
                type="number"
                value={treatmentCost}
                onChange={setTreatmentCost}
                placeholder="e.g. 45"
              />
              <button onClick={saveTreatment} style={{
                marginTop: 4, padding: "13px", borderRadius: 12, background: colors.success,
                color: "white", border: "none", fontSize: 15, fontFamily: font,
                fontWeight: 700, cursor: "pointer",
              }}>Save & Mark Done ✓</button>
            </div>
          )}

          {activeTab === "edit info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="First Name" value={editFirst} onChange={setEditFirst} />
                <Input label="Last Name" value={editLast} onChange={setEditLast} />
              </div>
              <Input label="Phone" value={editPhone} onChange={setEditPhone} />
              <button onClick={saveInfo} style={{
                marginTop: 4, padding: "13px", borderRadius: 12, background: colors.primary,
                color: "white", border: "none", fontSize: 15, fontFamily: font,
                fontWeight: 700, cursor: "pointer",
              }}>Save Info</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
