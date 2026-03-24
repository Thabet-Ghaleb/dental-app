import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// ─── MOCK DATA ───
const monthlyData = [
  { month: "Mar", revenue: 2800, patients: 12, visits: 18, paid: 2400, newPatients: 8 },
  { month: "Apr", revenue: 3500, patients: 15, visits: 22, paid: 3100, newPatients: 5 },
  { month: "May", revenue: 4200, patients: 18, visits: 28, paid: 3600, newPatients: 7 },
  { month: "Jun", revenue: 3800, patients: 16, visits: 24, paid: 3800, newPatients: 4 },
  { month: "Jul", revenue: 2900, patients: 13, visits: 19, paid: 2500, newPatients: 3 },
  { month: "Aug", revenue: 5100, patients: 22, visits: 34, paid: 4200, newPatients: 9 },
  { month: "Sep", revenue: 4600, patients: 20, visits: 30, paid: 4100, newPatients: 6 },
  { month: "Oct", revenue: 5400, patients: 24, visits: 36, paid: 4800, newPatients: 8 },
  { month: "Nov", revenue: 4900, patients: 21, visits: 32, paid: 4500, newPatients: 5 },
  { month: "Dec", revenue: 3200, patients: 14, visits: 20, paid: 2800, newPatients: 3 },
  { month: "Jan", revenue: 5800, patients: 26, visits: 38, paid: 5200, newPatients: 10 },
  { month: "Feb", revenue: 4400, patients: 19, visits: 27, paid: 3600, newPatients: 7 },
];

const treatmentBreakdown = [
  { name: "Cleaning", value: 32, color: "#1A6B5A" },
  { name: "Fillings", value: 24, color: "#2E9E85" },
  { name: "Root Canal", value: 12, color: "#D4A853" },
  { name: "Crowns", value: 15, color: "#E8915A" },
  { name: "Whitening", value: 10, color: "#7FB5D3" },
  { name: "Other", value: 7, color: "#B8C4C0" },
];

const recentActivity = [
  { patient: "Ahmad Khalil", action: "Crown Placement", amount: 500, paid: 0, date: "Feb 27", type: "treatment" },
  { patient: "Sara Mansour", action: "Payment received", amount: 150, paid: 150, date: "Feb 26", type: "payment" },
  { patient: "Lina Tariq", action: "New patient registered", amount: 0, paid: 0, date: "Feb 25", type: "registration" },
  { patient: "Omar Haddad", action: "Permanent Crown", amount: 480, paid: 0, date: "Feb 24", type: "treatment" },
  { patient: "Khaled Nasser", action: "Payment received", amount: 200, paid: 200, date: "Feb 23", type: "payment" },
  { patient: "Noor Issa", action: "Exam & Cleaning", amount: 45, paid: 45, date: "Feb 22", type: "treatment" },
  { patient: "Rami Saleh", action: "New patient registered", amount: 0, paid: 0, date: "Feb 21", type: "registration" },
  { patient: "Dina Faris", action: "Filling — Upper Molar", amount: 180, paid: 180, date: "Feb 20", type: "treatment" },
];

const unpaidPatients = [
  { name: "Ahmad Khalil", balance: 750, lastVisit: "2025-11-15", visits: 4 },
  { name: "Khaled Nasser", balance: 500, lastVisit: "2025-01-20", visits: 3 },
  { name: "Omar Haddad", balance: 480, lastVisit: "2025-04-02", visits: 2 },
  { name: "Sara Mansour", balance: 150, lastVisit: "2026-02-20", visits: 2 },
];

// ─── STYLES ───
const c = {
  bg: "#F4F3F0",
  card: "#FFFFFF",
  primary: "#1A6B5A",
  primaryLight: "#E8F5F0",
  primaryDark: "#0E4A3C",
  accent: "#D4A853",
  accentLight: "#FFF8EC",
  text: "#1E2D2B",
  textLight: "#7A8886",
  textMuted: "#A3B1AE",
  border: "#E2E5E3",
  error: "#C0392B",
  errorBg: "#FDF0EE",
  success: "#27AE60",
  successBg: "#EAFAF1",
  warning: "#E67E22",
  warningBg: "#FEF5E7",
};

const font = "'DM Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";
const formatCurrency = (n) => `$${n.toLocaleString()}`;

// ─── COMPONENTS ───
function KPICard({ label, value, change, changeLabel, icon, color, sub }) {
  const isPositive = change >= 0;
  return (
    <div style={{
      background: c.card, borderRadius: 20, padding: "24px 28px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.04)", flex: 1, minWidth: 200,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -12, right: -12, width: 64, height: 64,
        borderRadius: "50%", background: `${color}12`, opacity: 0.6,
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{
          fontSize: 12, fontFamily: font, fontWeight: 700, color: c.textLight,
          textTransform: "uppercase", letterSpacing: 1,
        }}>{label}</span>
      </div>
      <div style={{ fontSize: 34, fontFamily: font, fontWeight: 800, color: c.text, marginBottom: 6, letterSpacing: -0.5 }}>
        {value}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {change !== undefined && (
          <span style={{
            fontSize: 13, fontFamily: font, fontWeight: 700,
            color: isPositive ? c.success : c.error,
            background: isPositive ? c.successBg : c.errorBg,
            padding: "2px 8px", borderRadius: 6,
          }}>
            {isPositive ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
        {changeLabel && <span style={{ fontSize: 12, fontFamily: font, color: c.textMuted }}>{changeLabel}</span>}
        {sub && <span style={{ fontSize: 12, fontFamily: font, color: c.textMuted }}>{sub}</span>}
      </div>
    </div>
  );
}

function ChartCard({ title, children, style: s }) {
  return (
    <div style={{
      background: c.card, borderRadius: 20, padding: 28,
      boxShadow: "0 2px 16px rgba(0,0,0,0.04)", ...s,
    }}>
      <h3 style={{
        fontFamily: font, fontSize: 16, fontWeight: 700, color: c.text,
        marginBottom: 20, letterSpacing: -0.2,
      }}>{title}</h3>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "white", border: `1px solid ${c.border}`, borderRadius: 12,
      padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    }}>
      <div style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ fontFamily: font, fontSize: 12, color: c.textLight }}>{p.name}:</span>
          <span style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: c.text }}>
            {typeof p.value === "number" && p.name.toLowerCase().includes("revenue") ? formatCurrency(p.value) : typeof p.value === "number" && p.name.toLowerCase().includes("paid") ? formatCurrency(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── MAIN DASHBOARD ───
export default function Dashboard() {
  const [period, setPeriod] = useState("12m");

  const totals = useMemo(() => {
    const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
    const totalPaid = monthlyData.reduce((s, d) => s + d.paid, 0);
    const totalPatients = monthlyData.reduce((s, d) => s + d.newPatients, 0);
    const totalVisits = monthlyData.reduce((s, d) => s + d.visits, 0);
    const totalUnpaid = unpaidPatients.reduce((s, p) => s + p.balance, 0);
    return { totalRevenue, totalPaid, totalPatients, totalVisits, totalUnpaid };
  }, []);

  const activityIcon = (type) => {
    const map = { treatment: "🦷", payment: "💰", registration: "👤" };
    return map[type] || "📋";
  };

  const activityColor = (type) => {
    const map = { treatment: c.primary, payment: c.success, registration: c.accent };
    return map[type] || c.textLight;
  };

  return (
    <div style={{ minHeight: "100vh", background: c.bg, fontFamily: font }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; margin: 0; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }`}</style>

      {/* Header */}
      <div style={{
        background: c.card, borderBottom: `1px solid ${c.border}`,
        padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>🦷</span>
          <div>
            <h1 style={{ fontFamily: fontDisplay, fontSize: 26, color: c.primaryDark, lineHeight: 1.1 }}>Clinic Dashboard</h1>
            <p style={{ fontSize: 13, color: c.textMuted }}>Last updated: Feb 27, 2026 · 2:30 PM</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, background: c.bg, borderRadius: 12, padding: 4 }}>
          {[
            { id: "3m", label: "3 Months" },
            { id: "6m", label: "6 Months" },
            { id: "12m", label: "12 Months" },
          ].map((p) => (
            <button key={p.id} onClick={() => setPeriod(p.id)} style={{
              padding: "8px 18px", borderRadius: 8, fontSize: 13, fontFamily: font, fontWeight: 600,
              background: period === p.id ? c.primary : "transparent",
              color: period === p.id ? "white" : c.textLight,
              border: "none", cursor: "pointer", transition: "all 0.2s",
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px 40px", maxWidth: 1400, margin: "0 auto" }}>
        {/* KPI Cards */}
        <div style={{ display: "flex", gap: 20, marginBottom: 28 }}>
          <KPICard icon="💵" label="Total Revenue" value={formatCurrency(totals.totalRevenue)} change={12} changeLabel="vs last year" color={c.primary} />
          <KPICard icon="✅" label="Collected" value={formatCurrency(totals.totalPaid)} change={8} changeLabel="vs last year" color={c.success} />
          <KPICard icon="⚠️" label="Outstanding" value={formatCurrency(totals.totalUnpaid)} color={c.warning} sub={`${unpaidPatients.length} patients`} />
          <KPICard icon="👥" label="New Patients" value={totals.totalPatients} change={18} changeLabel="vs last year" color={c.accent} />
          <KPICard icon="📅" label="Total Visits" value={totals.totalVisits} change={15} changeLabel="vs last year" color="#7FB5D3" />
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
          <ChartCard title="Revenue vs Collected">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.primary} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={c.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.success} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={c.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: c.textMuted, fontFamily: font }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: c.textMuted, fontFamily: font }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={c.primary} strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
                <Area type="monotone" dataKey="paid" name="Paid" stroke={c.success} strokeWidth={2.5} fill="url(#paidGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Treatments by Type">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={treatmentBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={95}
                  paddingAngle={3} dataKey="value" stroke="none">
                  {treatmentBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background: "white", border: `1px solid ${c.border}`, borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                      <div style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: d.color }}>{d.name}</div>
                      <div style={{ fontFamily: font, fontSize: 12, color: c.textLight }}>{d.value} treatments</div>
                    </div>
                  );
                }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", justifyContent: "center" }}>
              {treatmentBreakdown.map((t) => (
                <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                  <span style={{ fontSize: 11, fontFamily: font, color: c.textLight }}>{t.name} ({t.value})</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Charts Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          <ChartCard title="Patient Visits per Month">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: c.textMuted, fontFamily: font }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: c.textMuted, fontFamily: font }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="visits" name="Visits" fill={c.primary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="New Patients per Month">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: c.textMuted, fontFamily: font }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: c.textMuted, fontFamily: font }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="newPatients" name="New Patients" fill={c.accent} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Bottom Row: Activity + Unpaid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
          {/* Recent Activity */}
          <ChartCard title="Recent Activity">
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentActivity.map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "12px 0",
                  borderBottom: i < recentActivity.length - 1 ? `1px solid ${c.border}` : "none",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `${activityColor(a.type)}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {activityIcon(a.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: c.text, fontFamily: font }}>{a.patient}</div>
                    <div style={{ fontSize: 12, color: c.textMuted, fontFamily: font }}>{a.action}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {a.amount > 0 && (
                      <div style={{
                        fontSize: 14, fontWeight: 700, fontFamily: font,
                        color: a.type === "payment" ? c.success : c.text,
                      }}>
                        {a.type === "payment" ? "+" : ""}{formatCurrency(a.amount)}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: c.textMuted, fontFamily: font }}>{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Outstanding Balances */}
          <ChartCard title="Outstanding Balances">
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {unpaidPatients.sort((a, b) => b.balance - a.balance).map((p, i) => {
                const maxBalance = unpaidPatients[0].balance;
                const barWidth = (p.balance / maxBalance) * 100;
                return (
                  <div key={i} style={{
                    padding: "14px 0",
                    borderBottom: i < unpaidPatients.length - 1 ? `1px solid ${c.border}` : "none",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: c.text, fontFamily: font }}>{p.name}</span>
                        <span style={{ fontSize: 12, color: c.textMuted, fontFamily: font, marginLeft: 8 }}>
                          Last visit: {p.lastVisit}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 16, fontWeight: 800, color: c.error, fontFamily: font,
                      }}>{formatCurrency(p.balance)}</span>
                    </div>
                    <div style={{ height: 6, background: "#F5F5F5", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 3,
                        width: `${barWidth}%`,
                        background: `linear-gradient(90deg, ${c.warning}, ${c.error})`,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{
              marginTop: 16, padding: "14px 18px", background: c.errorBg, borderRadius: 14,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: c.error, fontFamily: font }}>
                Total Outstanding
              </span>
              <span style={{ fontSize: 20, fontWeight: 800, color: c.error, fontFamily: font }}>
                {formatCurrency(totals.totalUnpaid)}
              </span>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}