import { useState } from "react";
import DoctorPage from "./DoctorPage";
import Dashboard from "./Dashboard";

const colors = {
  bg: "#F0F4F8", card: "#FFFFFF", primary: "#2563EB", primaryLight: "#EFF6FF",
  primaryDark: "#1D4ED8", accent: "#64748B", text: "#0F172A", textLight: "#64748B",
  error: "#EF4444", errorBg: "#FEF2F2", success: "#22C55E", successBg: "#F0FDF4",
  warning: "#F59E0B", warningBg: "#FFFBEB", border: "#E2E8F0", inputBg: "#F8FAFC",
};

const font = "'DM Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

function genId() { return Date.now() + Math.random(); }
function initials(f, l) { return `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase(); }
function fmtTime(date) { return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }); }
function fmtApptTime(h, m) {
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}
function fmtDate(date) { return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function today() { return new Date().toDateString(); }
function isSameDay(a, b) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const seedPatients = [
  { id: genId(), firstName: "Ahmad", lastName: "Khalil", phone: "+962791234567", status: "waiting", checkins: [{ id: genId(), ts: Date.now() - 86400000 * 5 }] },
  { id: genId(), firstName: "Sara", lastName: "Mansour", phone: "+962799876543", status: "waiting", checkins: [{ id: genId(), ts: Date.now() - 86400000 * 2 }] },
];

const seedAppointments = [
  { id: genId(), patientName: "Ahmad Khalil", date: new Date(), hour: 9, minute: 0, status: "upcoming" },
  { id: genId(), patientName: "Sara Mansour", date: new Date(), hour: 11, minute: 30, status: "upcoming" },
  { id: genId(), patientName: "Omar Haddad", date: new Date(Date.now() + 86400000), hour: 10, minute: 0, status: "upcoming" },
];

// ── Shared UI ──
function Input({ label, value, onChange, placeholder, type = "text", autoFocus }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, fontFamily: font, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>}
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} autoFocus={autoFocus}
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

function Avatar({ first, last, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: colors.primary,
      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: font, fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
    }}>{initials(first, last)}</div>
  );
}

function Toast({ message, visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
      background: colors.primary, color: "white", padding: "13px 26px",
      borderRadius: 12, fontFamily: font, fontWeight: 600, fontSize: 14,
      opacity: visible ? 1 : 0, transition: "all 0.3s ease",
      boxShadow: "0 8px 24px rgba(37,99,235,0.3)", zIndex: 200, pointerEvents: "none",
    }}>✓ {message}</div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150 }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480, boxShadow: "0 24px 80px rgba(0,0,0,0.2)", animation: "pop 0.25s ease", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 22, color: colors.primaryDark, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: colors.textLight, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function NavTab({ label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 24px", borderRadius: 10, fontFamily: font, fontWeight: 700,
      fontSize: 15, border: "none", cursor: "pointer", transition: "all 0.2s",
      background: active ? colors.primary : "transparent",
      color: active ? "white" : colors.textLight,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      {label}
      {badge > 0 && (
        <span style={{ background: active ? "rgba(255,255,255,0.25)" : colors.primaryLight, color: active ? "white" : colors.primary, borderRadius: 20, padding: "1px 8px", fontSize: 12, fontWeight: 700 }}>{badge}</span>
      )}
    </button>
  );
}

function ActionBtn({ label, color, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${color}`,
      background: hovered ? color : "transparent", color: hovered ? "white" : color,
      fontFamily: font, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s",
    }}>{label}</button>
  );
}

function StatusBadge({ status }) {
  const map = {
    upcoming: { label: "Upcoming", bg: colors.primaryLight, color: colors.primary },
    done: { label: "Done", bg: colors.successBg, color: colors.success },
    cancelled: { label: "Cancelled", bg: colors.errorBg, color: colors.error },
  };
  const s = map[status] || map.upcoming;
  return <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontFamily: font, fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span>;
}

// ── FRONT DESK PAGE (Check-in + Appointments) ──
function FrontDeskPage({ patients, setPatients, showToast }) {
  const [search, setSearch] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [checkinError, setCheckinError] = useState("");

  const [appointments, setAppointments] = useState(seedAppointments);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [reschedule, setReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [newApptName, setNewApptName] = useState("");
  const [newApptDate, setNewApptDate] = useState("");
  const [newApptTime, setNewApptTime] = useState("");
  const [apptError, setApptError] = useState("");

  const todayCheckins = patients
    .flatMap((p) => p.checkins.filter((c) => new Date(c.ts).toDateString() === today()).map((c) => ({ ...c, patient: p })))
    .sort((a, b) => b.ts - a.ts);

  const searchResults = search.trim().length >= 2
    ? patients.filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search))
    : [];

  const todayAppts = appointments
    .filter((a) => isSameDay(a.date, new Date()))
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

  const handleCheckinExisting = (patient) => {
    const newCheckin = { id: genId(), ts: Date.now() };
    setPatients((prev) => prev.map((p) => p.id === patient.id ? { ...p, checkins: [newCheckin, ...p.checkins], status: "waiting" } : p));
    setSearch("");
    showToast(`${patient.firstName} checked in`);
  };

  const handleAddNew = () => {
    if (!newFirst.trim() || !newLast.trim() || !newPhone.trim()) { setCheckinError("All fields are required."); return; }
    setCheckinError("");
    setPatients((prev) => [...prev, { id: genId(), firstName: newFirst.trim(), lastName: newLast.trim(), phone: newPhone.trim(), checkins: [{ id: genId(), ts: Date.now() }], status: "waiting" }]);
    setNewFirst(""); setNewLast(""); setNewPhone("");
    setShowNewForm(false);
    showToast("New patient added & checked in");
  };

  const handleBookAppt = () => {
    if (!newApptName.trim() || !newApptDate || !newApptTime) { setApptError("All fields are required."); return; }
    const [h, m] = newApptTime.split(":").map(Number);
    setAppointments((prev) => [...prev, { id: genId(), patientName: newApptName.trim(), date: new Date(newApptDate), hour: h, minute: m, status: "upcoming" }]);
    setNewApptName(""); setNewApptDate(""); setNewApptTime(""); setApptError("");
    setShowBookModal(false);
    showToast("Appointment booked");
  };

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return;
    const [h, m] = rescheduleTime.split(":").map(Number);
    setAppointments((prev) => prev.map((a) => a.id === showDetail.id ? { ...a, date: new Date(rescheduleDate), hour: h, minute: m, status: "upcoming" } : a));
    setReschedule(false); setRescheduleDate(""); setRescheduleTime(""); setShowDetail(null);
    showToast("Appointment rescheduled");
  };

  const updateApptStatus = (id, status) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    setShowDetail(null);
  };

  const deleteAppt = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setShowDetail(null);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

      {/* LEFT — Check In */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", padding: 24 }}>
          <div style={{ height: 4, background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`, borderRadius: 2, marginBottom: 20 }} />
          <h2 style={{ fontFamily: fontDisplay, fontSize: 18, color: colors.primaryDark, margin: "0 0 16px" }}>Check In</h2>
          <div style={{ marginBottom: 12 }}>
            <Input label="Search Patient" value={search} onChange={setSearch} placeholder="Type name or phone..." autoFocus />
          </div>
          {searchResults.length > 0 && (
            <div style={{ border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
              {searchResults.map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < searchResults.length - 1 ? `1px solid ${colors.border}` : "none", background: "white" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar first={p.firstName} last={p.lastName} size={34} />
                    <div>
                      <div style={{ fontFamily: font, fontWeight: 600, fontSize: 14, color: colors.text }}>{p.firstName} {p.lastName}</div>
                      <div style={{ fontFamily: font, fontSize: 12, color: colors.textLight }}>{p.phone} · {p.checkins.length} visit{p.checkins.length !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <button onClick={() => handleCheckinExisting(p)} style={{ padding: "7px 16px", borderRadius: 10, background: colors.primary, color: "white", border: "none", fontFamily: font, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Check In →</button>
                </div>
              ))}
            </div>
          )}
          {search.trim().length >= 2 && searchResults.length === 0 && (
            <div style={{ padding: "12px 14px", borderRadius: 12, background: colors.inputBg, fontFamily: font, fontSize: 14, color: colors.textLight, marginBottom: 12 }}>No patient found for "{search}"</div>
          )}
          <button onClick={() => setShowNewForm(!showNewForm)} style={{ width: "100%", padding: "11px", borderRadius: 12, background: showNewForm ? colors.inputBg : "transparent", color: colors.primary, border: `2px dashed ${colors.primary}`, fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
            {showNewForm ? "Cancel" : "+ New Patient"}
          </button>
          {showNewForm && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <Input label="First Name" value={newFirst} onChange={setNewFirst} placeholder="Ahmad" />
                <Input label="Last Name" value={newLast} onChange={setNewLast} placeholder="Khalil" />
              </div>
              <div style={{ marginBottom: 10 }}>
                <Input label="Phone" value={newPhone} onChange={setNewPhone} placeholder="+962 7X XXX XXXX" />
              </div>
              {checkinError && <div style={{ color: colors.error, fontSize: 13, fontFamily: font, marginBottom: 8 }}>{checkinError}</div>}
              <button onClick={handleAddNew} style={{ width: "100%", padding: "12px", borderRadius: 12, background: colors.primary, color: "white", border: "none", fontSize: 14, fontFamily: font, fontWeight: 700, cursor: "pointer" }}>Add & Check In →</button>
            </div>
          )}
        </div>

        {/* Today's Check-Ins */}
        <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: fontDisplay, fontSize: 18, color: colors.primaryDark, margin: 0 }}>Today's Check-Ins</h2>
            <span style={{ fontFamily: font, fontSize: 13, color: colors.textLight }}>{todayCheckins.length} patients</span>
          </div>
          {todayCheckins.length === 0 ? (
            <div style={{ padding: 28, textAlign: "center", color: colors.textLight, fontFamily: font, fontSize: 14 }}>No check-ins yet today</div>
          ) : todayCheckins.map((c, i) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: i < todayCheckins.length - 1 ? `1px solid ${colors.border}` : "none", background: i === 0 ? colors.primaryLight : "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar first={c.patient.firstName} last={c.patient.lastName} size={36} />
                <div>
                  <div style={{ fontFamily: font, fontWeight: 600, fontSize: 14, color: colors.text }}>{c.patient.firstName} {c.patient.lastName}</div>
                  <div style={{ fontFamily: font, fontSize: 12, color: colors.textLight }}>{c.patient.phone}</div>
                </div>
              </div>
              <div style={{ fontFamily: font, fontSize: 12, color: colors.textLight, background: colors.bg, padding: "3px 8px", borderRadius: 8 }}>{fmtTime(c.ts)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Appointments */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: fontDisplay, fontSize: 18, color: colors.primaryDark, margin: 0 }}>
              Today's Appointments
            </h2>
            <button onClick={() => setShowBookModal(true)} style={{ padding: "7px 16px", borderRadius: 10, background: colors.primary, color: "white", border: "none", fontFamily: font, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Book</button>
          </div>
          {todayAppts.length === 0 ? (
            <div style={{ padding: 28, textAlign: "center", color: colors.textLight, fontFamily: font, fontSize: 14 }}>No appointments today</div>
          ) : todayAppts.map((a, i) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: i < todayAppts.length - 1 ? `1px solid ${colors.border}` : "none", background: i === 0 ? colors.primaryLight : "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: colors.primary, color: "white", borderRadius: 8, padding: "5px 10px", fontFamily: font, fontWeight: 700, fontSize: 13, minWidth: 66, textAlign: "center" }}>
                  {fmtApptTime(a.hour, a.minute)}
                </div>
                <div style={{ fontFamily: font, fontWeight: 600, fontSize: 14, color: colors.text }}>{a.patientName}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <StatusBadge status={a.status} />
                <button onClick={() => { setShowDetail(a); setReschedule(false); }} style={{ padding: "5px 12px", borderRadius: 8, background: "transparent", border: `1.5px solid ${colors.border}`, fontFamily: font, fontWeight: 600, fontSize: 12, cursor: "pointer", color: colors.textLight }}>Manage</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Modal */}
      {showBookModal && (
        <Modal title="Book Appointment" onClose={() => { setShowBookModal(false); setApptError(""); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Patient Name" value={newApptName} onChange={setNewApptName} placeholder="Ahmad Khalil" />
            <Input label="Date" type="date" value={newApptDate} onChange={setNewApptDate} />
            <Input label="Time" type="time" value={newApptTime} onChange={setNewApptTime} />
            {apptError && <div style={{ color: colors.error, fontSize: 13, fontFamily: font }}>{apptError}</div>}
            <button onClick={handleBookAppt} style={{ padding: "13px", borderRadius: 12, background: colors.primary, color: "white", border: "none", fontSize: 15, fontFamily: font, fontWeight: 700, cursor: "pointer" }}>Book Appointment</button>
          </div>
        </Modal>
      )}

      {/* Manage Appointment Modal */}
      {showDetail && (
        <Modal title={showDetail.patientName} onClose={() => { setShowDetail(null); setReschedule(false); }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ background: colors.primaryLight, borderRadius: 10, padding: "10px 16px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontFamily: font, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", marginBottom: 4 }}>Date</div>
              <div style={{ fontSize: 14, fontFamily: font, fontWeight: 700, color: colors.primary }}>{new Date(showDetail.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
            </div>
            <div style={{ background: colors.primaryLight, borderRadius: 10, padding: "10px 16px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontFamily: font, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", marginBottom: 4 }}>Time</div>
              <div style={{ fontSize: 14, fontFamily: font, fontWeight: 700, color: colors.primary }}>{fmtApptTime(showDetail.hour, showDetail.minute)}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><StatusBadge status={showDetail.status} /></div>
          {!reschedule ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => setReschedule(true)} style={{ padding: "12px", borderRadius: 12, background: colors.primaryLight, color: colors.primary, border: `1.5px solid ${colors.primary}`, fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Reschedule</button>
              <button onClick={() => updateApptStatus(showDetail.id, "done")} style={{ padding: "12px", borderRadius: 12, background: colors.successBg, color: colors.success, border: `1.5px solid ${colors.success}`, fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Mark as Done</button>
              <button onClick={() => updateApptStatus(showDetail.id, "cancelled")} style={{ padding: "12px", borderRadius: 12, background: colors.warningBg, color: colors.warning, border: `1.5px solid ${colors.warning}`, fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Cancel Appointment</button>
              <button onClick={() => deleteAppt(showDetail.id)} style={{ padding: "12px", borderRadius: 12, background: colors.errorBg, color: colors.error, border: `1.5px solid ${colors.error}`, fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Delete</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.text }}>Pick new date & time:</div>
              <Input label="New Date" type="date" value={rescheduleDate} onChange={setRescheduleDate} />
              <Input label="New Time" type="time" value={rescheduleTime} onChange={setRescheduleTime} />
              <button onClick={handleReschedule} style={{ padding: "13px", borderRadius: 12, background: colors.primary, color: "white", border: "none", fontSize: 15, fontFamily: font, fontWeight: 700, cursor: "pointer" }}>Confirm Reschedule</button>
              <button onClick={() => setReschedule(false)} style={{ padding: "10px", borderRadius: 12, background: "transparent", color: colors.textLight, border: `1.5px solid ${colors.border}`, fontSize: 14, fontFamily: font, fontWeight: 600, cursor: "pointer" }}>Back</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ── RECORDS PAGE ──
function RecordsPage({ patients, setPatients, showToast }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [historyPatient, setHistoryPatient] = useState(null);
  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.phone.includes(q);
  });

  const openEdit = (p) => { setEditing(p); setEditFirst(p.firstName); setEditLast(p.lastName); setEditPhone(p.phone); };
  const saveEdit = () => {
    setPatients((prev) => prev.map((p) => p.id === editing.id ? { ...p, firstName: editFirst.trim(), lastName: editLast.trim(), phone: editPhone.trim() } : p));
    setEditing(null);
    showToast("Patient info updated");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: colors.card, borderRadius: 16, padding: "16px 20px", boxShadow: "0 2px 16px rgba(37,99,235,0.06)" }}>
        <Input placeholder="Search by name or phone..." value={search} onChange={setSearch} />
      </div>
      <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 20, color: colors.primaryDark, margin: 0 }}>All Patients</h2>
          <span style={{ fontFamily: font, fontSize: 13, color: colors.textLight }}>{filtered.length} records</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: colors.textLight, fontFamily: font }}>No patients found</div>
        ) : filtered.map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar first={p.firstName} last={p.lastName} />
              <div>
                <div style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: colors.text }}>{p.firstName} {p.lastName}</div>
                <div style={{ fontFamily: font, fontSize: 13, color: colors.textLight }}>{p.phone}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: font, fontSize: 12, color: colors.textLight, background: colors.bg, padding: "3px 10px", borderRadius: 8 }}>{p.checkins.length} visit{p.checkins.length !== 1 ? "s" : ""}</span>
              <ActionBtn label="History" color={colors.primary} onClick={() => setHistoryPatient(p)} />
              <ActionBtn label="Edit" color={colors.accent} onClick={() => openEdit(p)} />
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title="Edit Patient" onClose={() => setEditing(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="First Name" value={editFirst} onChange={setEditFirst} />
              <Input label="Last Name" value={editLast} onChange={setEditLast} />
            </div>
            <Input label="Phone" value={editPhone} onChange={setEditPhone} />
            <button onClick={saveEdit} style={{ marginTop: 8, padding: "13px", borderRadius: 12, background: colors.primary, color: "white", border: "none", fontSize: 15, fontFamily: font, fontWeight: 700, cursor: "pointer" }}>Save Changes</button>
          </div>
        </Modal>
      )}

      {historyPatient && (
        <Modal title={`${historyPatient.firstName}'s Visits`} onClose={() => setHistoryPatient(null)}>
          {historyPatient.checkins.length === 0 ? (
            <p style={{ fontFamily: font, color: colors.textLight }}>No visit history.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[...historyPatient.checkins].sort((a, b) => b.ts - a.ts).map((c, i) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 12, background: i === 0 ? colors.primaryLight : colors.bg }}>
                  <span style={{ fontFamily: font, fontSize: 15, color: colors.text, fontWeight: 500 }}>{fmtDate(c.ts)}</span>
                  <span style={{ fontFamily: font, fontSize: 13, color: colors.textLight }}>{fmtTime(c.ts)}</span>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ background: colors.primaryLight, borderRadius: 12, padding: "10px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: colors.primary, fontFamily: font }}>{value}</div>
      <div style={{ fontSize: 11, color: colors.textLight, fontFamily: font, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

export default function DentalStaffApp() {
  const [page, setPage] = useState("frontdesk");
  const [patients, setPatients] = useState(seedPatients);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const todayCount = patients.filter((p) => p.checkins.some((c) => new Date(c.ts).toDateString() === today())).length;
  const waitingCount = patients.filter((p) => p.checkins.some((c) => new Date(c.ts).toDateString() === today()) && p.status === "waiting").length;

  const showToast = (msg) => {
    setToastMsg(msg); setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${colors.bg} 0%, #E8EFFC 50%, #F0F4F8 100%)`, fontFamily: font, padding: "32px 20px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } } * { box-sizing: border-box; margin: 0; }`}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: fontDisplay, fontSize: 30, color: colors.primaryDark, margin: 0 }}>Dental Clinic</h1>
            <p style={{ fontFamily: font, fontSize: 13, color: colors.textLight, margin: "3px 0 0" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <Stat label="Today" value={todayCount} />
            <Stat label="Total" value={patients.length} />
          </div>
        </div>

        <div style={{ background: colors.card, borderRadius: 14, padding: 6, display: "flex", gap: 4, boxShadow: "0 2px 12px rgba(37,99,235,0.06)" }}>
          <NavTab label="Front Desk" active={page === "frontdesk"} onClick={() => setPage("frontdesk")} badge={todayCount} />
          <NavTab label="Doctor" active={page === "doctor"} onClick={() => setPage("doctor")} badge={waitingCount} />
          <NavTab label="Records" active={page === "records"} onClick={() => setPage("records")} badge={patients.length} />
          <NavTab label="Dashboard" active={page === "dashboard"} onClick={() => setPage("dashboard")} />
        </div>

        {page === "frontdesk" && <FrontDeskPage patients={patients} setPatients={setPatients} showToast={showToast} />}
        {page === "doctor" && <DoctorPage patients={patients} setPatients={setPatients} showToast={showToast} />}
        {page === "records" && <RecordsPage patients={patients} setPatients={setPatients} showToast={showToast} />}
        {page === "dashboard" && <Dashboard patients={patients} />}
      </div>

      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
