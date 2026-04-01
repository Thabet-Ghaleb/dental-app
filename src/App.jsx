import { useState } from "react";
import DoctorPage from "./DoctorPage";
import Dashboard from "./Dashboard";

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

function genId() { return Date.now() + Math.random(); }
function initials(f, l) { return `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase(); }
function fmtTime(date) { return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }); }
function fmtDate(date) { return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function todayStr() { return new Date().toDateString(); }
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

const TODAY = new Date();

const seedPatients = [
  { id: genId(), firstName: "Ahmad", lastName: "Khalil", phone: "+962791234567", status: "waiting", checkins: [{ id: genId(), ts: Date.now() - 86400000 * 5 }, { id: genId(), ts: Date.now() - 86400000 * 30 }] },
  { id: genId(), firstName: "Sara", lastName: "Mansour", phone: "+962799876543", status: "waiting", checkins: [{ id: genId(), ts: Date.now() - 86400000 * 2 }] },
];

const seedAppointments = [
  { id: genId(), name: "Ahmad Khalil", date: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()), time: "9:00 AM", status: "upcoming" },
  { id: genId(), name: "Sara Mansour", date: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()), time: "11:30 AM", status: "upcoming" },
  { id: genId(), name: "Ahmad Khalil", date: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 6), time: "10:00 AM", status: "upcoming" },
  { id: genId(), name: "Sara Mansour", date: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 13), time: "2:00 PM", status: "upcoming" },
];

// ─── SHARED COMPONENTS ───

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
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150,
    }} onClick={onClose}>
      <div style={{
        background: "white", borderRadius: 20, padding: 32, width: "100%", maxWidth: 480,
        boxShadow: "0 24px 80px rgba(0,0,0,0.2)", animation: "pop 0.25s ease",
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
        <span style={{
          background: active ? "rgba(255,255,255,0.25)" : colors.primaryLight,
          color: active ? "white" : colors.primary,
          borderRadius: 20, padding: "1px 8px", fontSize: 12, fontWeight: 700,
        }}>{badge}</span>
      )}
    </button>
  );
}

function ActionBtn({ label, color, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${color}`,
        background: hovered ? color : "transparent",
        color: hovered ? "white" : color,
        fontFamily: font, fontWeight: 600, fontSize: 13, cursor: "pointer",
        transition: "all 0.15s",
      }}>{label}</button>
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

// ─── CALENDAR ───

const DOW_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
function hourLabel(h) { return h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`; }
function apptHour(time) {
  const [hStr, period] = time.split(" ");
  let h = parseInt(hStr);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h;
}

function CalendarMonthView({ curDate, selectedDate, appointments, onSelectDay }) {
  const y = curDate.getFullYear(), m = curDate.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  const cells = [];

  for (let i = 0; i < first; i++) cells.push({ day: prevDays - first + 1 + i, cur: false, date: new Date(y, m - 1, prevDays - first + 1 + i) });
  for (let d = 1; d <= days; d++) cells.push({ day: d, cur: true, date: new Date(y, m, d) });
  const remaining = (7 - ((first + days) % 7)) % 7;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, cur: false, date: new Date(y, m + 1, i) });

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {DOW_LABELS.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, color: colors.textLight, padding: "4px 0", textTransform: "uppercase", letterSpacing: 0.3 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map(({ day, cur, date }, i) => {
          const isToday = sameDay(date, TODAY);
          const isSel = sameDay(date, selectedDate);
          const appts = appointments.filter((a) => sameDay(a.date, date));
          const hasAppts = appts.length > 0;
          const multiAppts = appts.length > 1;
          let bg = "transparent", textColor = cur ? colors.text : colors.textLight;
          if (isSel) { bg = colors.primary; textColor = "white"; }
          else if (isToday) { bg = colors.primaryLight; textColor = colors.primary; }
          return (
            <div key={i} onClick={() => onSelectDay(date)} style={{
              aspectRatio: "1", borderRadius: 8, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", cursor: "pointer",
              background: bg, color: textColor, fontSize: 13, gap: 2,
              fontWeight: isToday || isSel ? 600 : 400, transition: "background 0.15s",
            }}>
              {day}
              {hasAppts && (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: isSel ? "white" : multiAppts ? colors.success : colors.primary }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarWeekView({ curDate, appointments, onSelectDay }) {
  const dow = curDate.getDay();
  const weekStart = new Date(curDate.getTime() - dow * 86400000);
  const weekDays = Array.from({ length: 7 }, (_, i) => new Date(weekStart.getTime() + i * 86400000));

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "40px repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        <div />
        {weekDays.map((d, i) => (
          <div key={i} onClick={() => onSelectDay(d)} style={{
            textAlign: "center", fontSize: 11, padding: "4px 0", cursor: "pointer",
            color: sameDay(d, TODAY) ? colors.primary : colors.textLight,
            fontWeight: sameDay(d, TODAY) ? 700 : 400,
          }}>
            {DOW_LABELS[i]}<br />
            <span style={{ fontSize: 14 }}>{d.getDate()}</span>
          </div>
        ))}
      </div>
      {HOURS.map((h) => (
        <div key={h} style={{ display: "grid", gridTemplateColumns: "40px repeat(7, 1fr)", gap: 2, minHeight: 40 }}>
          <div style={{ fontSize: 11, color: colors.textLight, paddingTop: 4, textAlign: "right", paddingRight: 6 }}>{hourLabel(h)}</div>
          {weekDays.map((d, i) => {
            const appts = appointments.filter((a) => sameDay(a.date, d) && apptHour(a.time) === h);
            return (
              <div key={i} onClick={() => onSelectDay(d)} style={{ borderLeft: `1px solid ${colors.border}`, minHeight: 40, paddingLeft: 2, cursor: "pointer" }}>
                {appts.map((a) => (
                  <div key={a.id} style={{
                    background: a.status === "done" ? colors.successBg : colors.primaryLight,
                    borderLeft: `2px solid ${a.status === "done" ? colors.success : colors.primary}`,
                    borderRadius: "0 4px 4px 0", padding: "3px 6px",
                    fontSize: 11, color: a.status === "done" ? colors.success : colors.primaryDark,
                    marginBottom: 2, marginLeft: 2,
                  }}>
                    {a.name.split(" ")[0]}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function CalendarDayView({ curDate, appointments }) {
  const dayAppts = appointments.filter((a) => sameDay(a.date, curDate));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {HOURS.map((h) => {
        const appts = dayAppts.filter((a) => apptHour(a.time) === h);
        return (
          <div key={h} style={{ display: "flex", gap: 8, minHeight: 44, borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: 11, color: colors.textLight, paddingTop: 6, minWidth: 36, textAlign: "right" }}>{hourLabel(h)}</div>
            <div style={{ flex: 1, padding: "4px 0" }}>
              {appts.map((a) => (
                <div key={a.id} style={{
                  background: a.status === "done" ? colors.successBg : colors.primaryLight,
                  borderLeft: `2px solid ${a.status === "done" ? colors.success : colors.primary}`,
                  borderRadius: "0 6px 6px 0", padding: "4px 10px",
                  fontSize: 12, color: a.status === "done" ? colors.success : colors.primaryDark,
                  marginBottom: 2,
                }}>
                  {a.time} · {a.name}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Calendar({ appointments, selectedDate, onSelectDay }) {
  const [calView, setCalView] = useState("month");
  const [curDate, setCurDate] = useState(new Date(TODAY));

  const navCal = (dir) => {
    if (calView === "month") setCurDate(new Date(curDate.getFullYear(), curDate.getMonth() + dir, 1));
    else if (calView === "week") setCurDate(new Date(curDate.getTime() + dir * 7 * 86400000));
    else setCurDate(new Date(curDate.getTime() + dir * 86400000));
  };

  const monthLabel = () => {
    if (calView === "month") return curDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (calView === "week") {
      const dow = curDate.getDay();
      const ws = new Date(curDate.getTime() - dow * 86400000);
      const we = new Date(ws.getTime() + 6 * 86400000);
      return `${ws.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${we.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return curDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const handleSelect = (d) => { setCurDate(new Date(d)); onSelectDay(d); };

  return (
    <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontFamily: fontDisplay, fontSize: 16, color: colors.primaryDark }}>{monthLabel()}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 2, background: colors.inputBg, borderRadius: 8, padding: 3 }}>
            {["month", "week", "day"].map((v) => (
              <button key={v} onClick={() => setCalView(v)} style={{
                background: calView === v ? colors.card : "transparent",
                border: calView === v ? `1px solid ${colors.border}` : "none",
                borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12,
                fontFamily: font, fontWeight: 600,
                color: calView === v ? colors.text : colors.textLight,
              }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["‹", "›"].map((arrow, i) => (
              <button key={arrow} onClick={() => navCal(i === 0 ? -1 : 1)} style={{
                width: 28, height: 28, border: `1px solid ${colors.border}`, borderRadius: 8,
                background: "transparent", cursor: "pointer", color: colors.textLight, fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{arrow}</button>
            ))}
          </div>
        </div>
      </div>
      {calView === "month" && <CalendarMonthView curDate={curDate} selectedDate={selectedDate} appointments={appointments} onSelectDay={handleSelect} />}
      {calView === "week" && <CalendarWeekView curDate={curDate} appointments={appointments} onSelectDay={handleSelect} />}
      {calView === "day" && <CalendarDayView curDate={curDate} appointments={appointments} />}
    </div>
  );
}

// ─── CHECKIN PAGE ───

function CheckinPage({ patients, setPatients, appointments, setAppointments, showToast }) {
  const [search, setSearch] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date(TODAY));
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookName, setBookName] = useState("");
  const [bookTime, setBookTime] = useState("9:00 AM");

  const todayCheckins = patients
    .flatMap((p) => p.checkins.filter((c) => new Date(c.ts).toDateString() === todayStr()).map((c) => ({ ...c, patient: p })))
    .sort((a, b) => b.ts - a.ts);

  const searchResults = search.trim().length >= 2
    ? patients.filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search))
    : [];

  const selectedAppts = appointments.filter((a) => sameDay(a.date, selectedDate));
  const selectedLabel = sameDay(selectedDate, TODAY) ? "Today" : selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const handleCheckinExisting = (patient) => {
    const newCheckin = { id: genId(), ts: Date.now() };
    setPatients((prev) => prev.map((p) => p.id === patient.id ? { ...p, checkins: [newCheckin, ...p.checkins], status: "waiting" } : p));
    setSearch("");
    showToast(`${patient.firstName} checked in`);
  };

  const handleAddNew = () => {
    if (!newFirst.trim() || !newLast.trim() || !newPhone.trim()) { setError("All fields are required."); return; }
    setError("");
    setPatients((prev) => [...prev, {
      id: genId(), firstName: newFirst.trim(), lastName: newLast.trim(),
      phone: newPhone.trim(), checkins: [{ id: genId(), ts: Date.now() }], status: "waiting",
    }]);
    setNewFirst(""); setNewLast(""); setNewPhone("");
    setShowNewForm(false);
    showToast("New patient added & checked in");
  };

  const handleBook = () => {
    if (!bookName.trim()) return;
    setAppointments((prev) => [...prev, { id: genId(), name: bookName.trim(), date: new Date(selectedDate), time: bookTime, status: "upcoming" }]);
    setBookName(""); setBookTime("9:00 AM");
    setShowBookModal(false);
    showToast("Appointment booked");
  };

  const toggleApptStatus = (id) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === "upcoming" ? "done" : "upcoming" } : a));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

        {/* Calendar */}
        <Calendar appointments={appointments} selectedDate={selectedDate} onSelectDay={setSelectedDate} />

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Check In */}
          <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", padding: 24 }}>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`, borderRadius: 2, marginBottom: 20 }} />
            <div style={{ fontFamily: fontDisplay, fontSize: 18, color: colors.primaryDark, marginBottom: 16 }}>Check In</div>
            <div style={{ marginBottom: 10 }}>
              <Input label="Search Patient" value={search} onChange={setSearch} placeholder="Type name or phone..." autoFocus />
            </div>
            {searchResults.length > 0 && (
              <div style={{ border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
                {searchResults.map((p, i) => (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", borderBottom: i < searchResults.length - 1 ? `1px solid ${colors.border}` : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar first={p.firstName} last={p.lastName} size={34} />
                      <div>
                        <div style={{ fontFamily: font, fontWeight: 600, fontSize: 14, color: colors.text }}>{p.firstName} {p.lastName}</div>
                        <div style={{ fontFamily: font, fontSize: 12, color: colors.textLight }}>{p.phone}</div>
                      </div>
                    </div>
                    <button onClick={() => handleCheckinExisting(p)} style={{
                      padding: "7px 16px", borderRadius: 10, background: colors.primary,
                      color: "white", border: "none", fontFamily: font, fontWeight: 700, fontSize: 13, cursor: "pointer",
                    }}>Check In →</button>
                  </div>
                ))}
              </div>
            )}
            {search.trim().length >= 2 && searchResults.length === 0 && (
              <div style={{ padding: "12px 14px", borderRadius: 10, background: colors.inputBg, fontFamily: font, fontSize: 13, color: colors.textLight, marginBottom: 10 }}>
                No patient found for "{search}"
              </div>
            )}
            <button onClick={() => setShowNewForm(!showNewForm)} style={{
              width: "100%", padding: "11px", borderRadius: 12,
              background: showNewForm ? colors.inputBg : "transparent",
              color: colors.primary, border: `2px dashed ${colors.primary}`,
              fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>{showNewForm ? "Cancel" : "+ New Patient"}</button>
            {showNewForm && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <Input label="First" value={newFirst} onChange={setNewFirst} placeholder="Ahmad" />
                  <Input label="Last" value={newLast} onChange={setNewLast} placeholder="Khalil" />
                  <Input label="Phone" value={newPhone} onChange={setNewPhone} placeholder="+962..." />
                </div>
                {error && <div style={{ color: colors.error, fontSize: 13, fontFamily: font, marginBottom: 8 }}>{error}</div>}
                <button onClick={handleAddNew} style={{
                  width: "100%", padding: "12px", borderRadius: 12, background: colors.primary,
                  color: "white", border: "none", fontSize: 14, fontFamily: font, fontWeight: 700, cursor: "pointer",
                }}>Add & Check In →</button>
              </div>
            )}
          </div>

          {/* Appointments for selected day */}
          <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "18px 24px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: fontDisplay, fontSize: 16, color: colors.primaryDark }}>{selectedLabel}'s Appointments</div>
              <button onClick={() => setShowBookModal(true)} style={{
                background: colors.primary, color: "white", border: "none", borderRadius: 10,
                padding: "7px 16px", fontFamily: font, fontWeight: 700, fontSize: 13, cursor: "pointer",
              }}>+ Book</button>
            </div>
            {selectedAppts.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: colors.textLight, fontFamily: font, fontSize: 14 }}>No appointments</div>
            ) : (
              selectedAppts.map((a, i) => (
                <div key={a.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "13px 24px",
                  borderBottom: i < selectedAppts.length - 1 ? `1px solid ${colors.border}` : "none",
                }}>
                  <div style={{
                    background: colors.primary, color: "white", borderRadius: 8,
                    padding: "3px 10px", fontSize: 12, fontWeight: 700, fontFamily: font, whiteSpace: "nowrap",
                  }}>{a.time}</div>
                  <div style={{ fontFamily: font, fontWeight: 600, fontSize: 14, color: colors.text, flex: 1 }}>{a.name}</div>
                  <span style={{
                    fontSize: 12, padding: "2px 10px", borderRadius: 20, fontFamily: font, fontWeight: 600,
                    background: a.status === "done" ? colors.successBg : colors.primaryLight,
                    color: a.status === "done" ? colors.success : colors.primary,
                  }}>{a.status === "done" ? "Done" : "Upcoming"}</span>
                  <button onClick={() => toggleApptStatus(a.id)} style={{
                    background: "transparent", border: `1px solid ${colors.border}`, borderRadius: 8,
                    padding: "4px 10px", fontSize: 12, fontFamily: font, cursor: "pointer", color: colors.textLight,
                  }}>Manage</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Today's Check-Ins */}
      <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "18px 28px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: fontDisplay, fontSize: 18, color: colors.primaryDark }}>Today's Check-Ins</div>
          <span style={{ fontFamily: font, fontSize: 13, color: colors.textLight }}>{todayCheckins.length} patients</span>
        </div>
        {todayCheckins.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: colors.textLight, fontFamily: font, fontSize: 15 }}>No check-ins yet today</div>
        ) : (
          todayCheckins.map((c, i) => (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 28px", borderBottom: i < todayCheckins.length - 1 ? `1px solid ${colors.border}` : "none",
              background: i === 0 ? colors.primaryLight : "white",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar first={c.patient.firstName} last={c.patient.lastName} />
                <div>
                  <div style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: colors.text }}>{c.patient.firstName} {c.patient.lastName}</div>
                  <div style={{ fontFamily: font, fontSize: 13, color: colors.textLight }}>{c.patient.phone}</div>
                </div>
              </div>
              <div style={{ fontFamily: font, fontSize: 13, color: colors.textLight, background: colors.bg, padding: "4px 10px", borderRadius: 8 }}>
                {fmtTime(c.ts)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Book Modal */}
      {showBookModal && (
        <Modal title={`Book for ${selectedLabel}`} onClose={() => setShowBookModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Patient Name" value={bookName} onChange={setBookName} placeholder="Ahmad Khalil" autoFocus />
            <div>
              <label style={{ display: "block", fontSize: 12, fontFamily: font, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Time</label>
              <select value={bookTime} onChange={(e) => setBookTime(e.target.value)} style={{
                width: "100%", padding: "11px 14px", fontSize: 15, fontFamily: font,
                border: `2px solid ${colors.border}`, borderRadius: 10, background: colors.inputBg,
                color: colors.text, outline: "none", boxSizing: "border-box",
              }}>
                {["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <button onClick={handleBook} style={{
              padding: "13px", borderRadius: 12, background: colors.primary,
              color: "white", border: "none", fontSize: 15, fontFamily: font, fontWeight: 700, cursor: "pointer",
            }}>Book Appointment</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── RECORDS PAGE ───

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
    setPatients((prev) => prev.map((p) =>
      p.id === editing.id ? { ...p, firstName: editFirst.trim(), lastName: editLast.trim(), phone: editPhone.trim() } : p
    ));
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
          <div style={{ fontFamily: fontDisplay, fontSize: 20, color: colors.primaryDark }}>All Patients</div>
          <span style={{ fontFamily: font, fontSize: 13, color: colors.textLight }}>{filtered.length} records</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: colors.textLight, fontFamily: font }}>No patients found</div>
        ) : filtered.map((p, i) => (
          <div key={p.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 28px", borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar first={p.firstName} last={p.lastName} />
              <div>
                <div style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: colors.text }}>{p.firstName} {p.lastName}</div>
                <div style={{ fontFamily: font, fontSize: 13, color: colors.textLight }}>{p.phone}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: font, fontSize: 12, color: colors.textLight, background: colors.bg, padding: "3px 10px", borderRadius: 8 }}>
                {p.checkins.length} visit{p.checkins.length !== 1 ? "s" : ""}
              </span>
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
            <button onClick={saveEdit} style={{
              marginTop: 8, padding: "13px", borderRadius: 12, background: colors.primary,
              color: "white", border: "none", fontSize: 15, fontFamily: font, fontWeight: 700, cursor: "pointer",
            }}>Save Changes</button>
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
                <div key={c.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 16px", borderRadius: 12,
                  background: i === 0 ? colors.primaryLight : colors.bg,
                }}>
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

// ─── ROOT APP ───

export default function DentalStaffApp() {
  const [page, setPage] = useState("checkin");
  const [patients, setPatients] = useState(seedPatients);
  const [appointments, setAppointments] = useState(seedAppointments);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const todayCount = patients.filter((p) => p.checkins.some((c) => new Date(c.ts).toDateString() === todayStr())).length;
  const waitingCount = patients.filter((p) => p.checkins.some((c) => new Date(c.ts).toDateString() === todayStr()) && p.status === "waiting").length;

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
            <h1 style={{ fontFamily: fontDisplay, fontSize: 30, color: colors.primaryDark, margin: 0 }}>🦷 Dental Clinic</h1>
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
          <NavTab label="Front Desk" active={page === "checkin"} onClick={() => setPage("checkin")} badge={todayCount} />
          <NavTab label="Doctor" active={page === "doctor"} onClick={() => setPage("doctor")} badge={waitingCount} />
          <NavTab label="Records" active={page === "records"} onClick={() => setPage("records")} badge={patients.length} />
          <NavTab label="Dashboard" active={page === "dashboard"} onClick={() => setPage("dashboard")} />
        </div>

        {page === "checkin" && <CheckinPage patients={patients} setPatients={setPatients} appointments={appointments} setAppointments={setAppointments} showToast={showToast} />}
        {page === "doctor" && <DoctorPage patients={patients} setPatients={setPatients} showToast={showToast} />}
        {page === "records" && <RecordsPage patients={patients} setPatients={setPatients} showToast={showToast} />}
        {page === "dashboard" && <Dashboard patients={patients} />}
      </div>

      <Toast message={toastMsg} visible={toastVisible} />
    </div>
  );
}
