import { useState } from "react";

const colors = {
  bg: "#F0F4F8", card: "#FFFFFF", primary: "#2563EB", primaryLight: "#EFF6FF",
  primaryDark: "#1D4ED8", accent: "#64748B", text: "#0F172A", textLight: "#64748B",
  success: "#22C55E", successBg: "#F0FDF4", error: "#EF4444", errorBg: "#FEF2F2",
  warning: "#F59E0B", warningBg: "#FFFBEB", border: "#E2E8F0", inputBg: "#F8FAFC",
};

const font = "'DM Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

function genId() { return Date.now() + Math.random(); }
function fmtTime(h, m) {
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const seedAppointments = [
  { id: genId(), patientName: "Ahmad Khalil", date: new Date(), hour: 9, minute: 0, status: "upcoming" },
  { id: genId(), patientName: "Sara Mansour", date: new Date(), hour: 11, minute: 30, status: "upcoming" },
  { id: genId(), patientName: "Omar Haddad", date: new Date(Date.now() + 86400000), hour: 10, minute: 0, status: "upcoming" },
  { id: genId(), patientName: "Lina Tariq", date: new Date(Date.now() + 86400000 * 2), hour: 14, minute: 0, status: "upcoming" },
];

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

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150 }} onClick={onClose}>
      <div style={{ background: "white", borderRadius: 20, padding: 32, width: "100%", maxWidth: 440, boxShadow: "0 24px 80px rgba(0,0,0,0.2)", animation: "pop 0.25s ease", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 22, color: colors.primaryDark, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: colors.textLight }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    upcoming: { label: "Upcoming", bg: colors.primaryLight, color: colors.primary },
    done: { label: "Done", bg: colors.successBg, color: colors.success },
    cancelled: { label: "Cancelled", bg: colors.errorBg, color: colors.error },
  };
  const s = map[status] || map.upcoming;
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontFamily: font, fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span>
  );
}

export default function CalendarPage({ patients = [] }) {
  const [appointments, setAppointments] = useState(seedAppointments);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [reschedule, setReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [error, setError] = useState("");

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calDays.push(new Date(year, month, i));

  const appsOnDay = (date) => date ? appointments.filter((a) => isSameDay(new Date(a.date), date)) : [];
  const selectedApps = appointments.filter((a) => isSameDay(new Date(a.date), selectedDate)).sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
  const todayApps = appointments.filter((a) => isSameDay(new Date(a.date), today)).sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

  const handleAdd = () => {
    if (!newName.trim() || !newDate || !newTime) { setError("All fields are required."); return; }
    const [h, m] = newTime.split(":").map(Number);
    setAppointments((prev) => [...prev, { id: genId(), patientName: newName.trim(), date: new Date(newDate), hour: h, minute: m, status: "upcoming" }]);
    setNewName(""); setNewDate(""); setNewTime(""); setError("");
    setShowModal(false);
  };

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return;
    const [h, m] = rescheduleTime.split(":").map(Number);
    setAppointments((prev) => prev.map((a) =>
      a.id === showDetail.id ? { ...a, date: new Date(rescheduleDate), hour: h, minute: m, status: "upcoming" } : a
    ));
    setReschedule(false);
    setRescheduleDate(""); setRescheduleTime("");
    setShowDetail(null);
  };

  const updateStatus = (id, status) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    setShowDetail(null);
  };

  const deleteApp = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    setShowDetail(null);
  };

  const openDetail = (a) => {
    setShowDetail(a);
    setReschedule(false);
    setRescheduleDate("");
    setRescheduleTime("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Today */}
      <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", overflow: "hidden" }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` }} />
        <div style={{ padding: "20px 28px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 20, color: colors.primaryDark, margin: 0 }}>
            Today's Appointments
            <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: colors.textLight, marginLeft: 10 }}>
              {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </span>
          </h2>
          <span style={{ fontFamily: font, fontSize: 13, color: colors.textLight }}>{todayApps.length} appointments</span>
        </div>
        {todayApps.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: colors.textLight, fontFamily: font }}>No appointments today</div>
        ) : todayApps.map((a, i) => (
          <div key={a.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 28px", borderBottom: i < todayApps.length - 1 ? `1px solid ${colors.border}` : "none",
            background: i === 0 ? colors.primaryLight : "white",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ background: colors.primary, color: "white", borderRadius: 10, padding: "6px 12px", fontFamily: font, fontWeight: 700, fontSize: 14, minWidth: 72, textAlign: "center" }}>
                {fmtTime(a.hour, a.minute)}
              </div>
              <div style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: colors.text }}>{a.patientName}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <StatusBadge status={a.status} />
              <button onClick={() => openDetail(a)} style={{ padding: "6px 16px", borderRadius: 8, background: "transparent", border: `1.5px solid ${colors.border}`, fontFamily: font, fontWeight: 600, fontSize: 13, cursor: "pointer", color: colors.textLight }}>Manage</button>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: fontDisplay, fontSize: 20, color: colors.primaryDark, margin: 0 }}>{MONTHS[month]} {year}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${colors.border}`, background: "white", cursor: "pointer", fontSize: 16, color: colors.textLight }}>‹</button>
            <button onClick={() => setCurrentDate(new Date())} style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${colors.border}`, background: "white", cursor: "pointer", fontFamily: font, fontWeight: 600, fontSize: 13, color: colors.primary }}>Today</button>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${colors.border}`, background: "white", cursor: "pointer", fontSize: 16, color: colors.textLight }}>›</button>
            <button onClick={() => setShowModal(true)} style={{ padding: "8px 18px", borderRadius: 10, background: colors.primary, color: "white", border: "none", fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer", marginLeft: 8 }}>+ Book</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {DAYS.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 12, fontFamily: font, fontWeight: 700, color: colors.textLight, padding: "4px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {calDays.map((date, i) => {
            const apps = appsOnDay(date);
            const isToday = date && isSameDay(date, today);
            const isSelected = date && isSameDay(date, selectedDate);
            const isPast = date && date < today && !isToday;
            return (
              <div key={i} onClick={() => date && setSelectedDate(date)} style={{
                minHeight: 72, borderRadius: 12, padding: "8px 6px",
                background: isSelected ? colors.primaryLight : isToday ? "#F0F7FF" : "white",
                border: `2px solid ${isSelected ? colors.primary : isToday ? colors.primary + "40" : colors.border}`,
                cursor: date ? "pointer" : "default", opacity: isPast ? 0.5 : 1, transition: "all 0.15s",
              }}>
                {date && (
                  <>
                    <div style={{ fontSize: 13, fontFamily: font, fontWeight: isToday ? 800 : 500, color: isToday ? colors.primary : colors.text, marginBottom: 4, textAlign: "center" }}>{date.getDate()}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {apps.slice(0, 2).map((a) => (
                        <div key={a.id} style={{ fontSize: 10, fontFamily: font, fontWeight: 600, background: colors.primary, color: "white", borderRadius: 4, padding: "2px 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {fmtTime(a.hour, a.minute)} {a.patientName.split(" ")[0]}
                        </div>
                      ))}
                      {apps.length > 2 && <div style={{ fontSize: 10, fontFamily: font, color: colors.primary, fontWeight: 700 }}>+{apps.length - 2} more</div>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day */}
      {!isSameDay(selectedDate, today) && (
        <div style={{ background: colors.card, borderRadius: 20, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "20px 28px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: fontDisplay, fontSize: 18, color: colors.primaryDark, margin: 0 }}>
              {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h2>
            <span style={{ fontFamily: font, fontSize: 13, color: colors.textLight }}>{selectedApps.length} appointments</span>
          </div>
          {selectedApps.length === 0 ? (
            <div style={{ padding: 28, textAlign: "center", color: colors.textLight, fontFamily: font }}>No appointments on this day</div>
          ) : selectedApps.map((a, i) => (
            <div key={a.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 28px", borderBottom: i < selectedApps.length - 1 ? `1px solid ${colors.border}` : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ background: colors.primaryLight, color: colors.primary, borderRadius: 10, padding: "6px 12px", fontFamily: font, fontWeight: 700, fontSize: 14, minWidth: 72, textAlign: "center" }}>
                  {fmtTime(a.hour, a.minute)}
                </div>
                <div style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: colors.text }}>{a.patientName}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StatusBadge status={a.status} />
                <button onClick={() => openDetail(a)} style={{ padding: "6px 16px", borderRadius: 8, background: "transparent", border: `1.5px solid ${colors.border}`, fontFamily: font, fontWeight: 600, fontSize: 13, cursor: "pointer", color: colors.textLight }}>Manage</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Modal */}
      {showModal && (
        <Modal title="Book Appointment" onClose={() => { setShowModal(false); setError(""); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Patient Name" value={newName} onChange={setNewName} placeholder="Ahmad Khalil" />
            <Input label="Date" type="date" value={newDate} onChange={setNewDate} />
            <Input label="Time" type="time" value={newTime} onChange={setNewTime} />
            {error && <div style={{ color: colors.error, fontSize: 13, fontFamily: font }}>{error}</div>}
            <button onClick={handleAdd} style={{ marginTop: 4, padding: "13px", borderRadius: 12, background: colors.primary, color: "white", border: "none", fontSize: 15, fontFamily: font, fontWeight: 700, cursor: "pointer" }}>
              Book Appointment
            </button>
          </div>
        </Modal>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <Modal title={showDetail.patientName} onClose={() => { setShowDetail(null); setReschedule(false); }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ background: colors.primaryLight, borderRadius: 10, padding: "10px 16px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontFamily: font, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", marginBottom: 4 }}>Date</div>
              <div style={{ fontSize: 14, fontFamily: font, fontWeight: 700, color: colors.primary }}>
                {new Date(showDetail.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
            </div>
            <div style={{ background: colors.primaryLight, borderRadius: 10, padding: "10px 16px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontFamily: font, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", marginBottom: 4 }}>Time</div>
              <div style={{ fontSize: 14, fontFamily: font, fontWeight: 700, color: colors.primary }}>{fmtTime(showDetail.hour, showDetail.minute)}</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <StatusBadge status={showDetail.status} />
          </div>

          {!reschedule ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => setReschedule(true)} style={{ padding: "12px", borderRadius: 12, background: colors.primaryLight, color: colors.primary, border: `1.5px solid ${colors.primary}`, fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Reschedule
              </button>
              <button onClick={() => updateStatus(showDetail.id, "done")} style={{ padding: "12px", borderRadius: 12, background: colors.successBg, color: colors.success, border: `1.5px solid ${colors.success}`, fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Mark as Done
              </button>
              <button onClick={() => updateStatus(showDetail.id, "cancelled")} style={{ padding: "12px", borderRadius: 12, background: colors.warningBg, color: colors.warning, border: `1.5px solid ${colors.warning}`, fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Cancel Appointment
              </button>
              <button onClick={() => deleteApp(showDetail.id)} style={{ padding: "12px", borderRadius: 12, background: colors.errorBg, color: colors.error, border: `1.5px solid ${colors.error}`, fontFamily: font, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Delete
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.text }}>Pick new date & time:</div>
              <Input label="New Date" type="date" value={rescheduleDate} onChange={setRescheduleDate} />
              <Input label="New Time" type="time" value={rescheduleTime} onChange={setRescheduleTime} />
              <button onClick={handleReschedule} style={{ padding: "13px", borderRadius: 12, background: colors.primary, color: "white", border: "none", fontSize: 15, fontFamily: font, fontWeight: 700, cursor: "pointer" }}>
                Confirm Reschedule
              </button>
              <button onClick={() => setReschedule(false)} style={{ padding: "10px", borderRadius: 12, background: "transparent", color: colors.textLight, border: `1.5px solid ${colors.border}`, fontSize: 14, fontFamily: font, fontWeight: 600, cursor: "pointer" }}>
                Back
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
