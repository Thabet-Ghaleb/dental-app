import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie, RadialBarChart,
  RadialBar, LineChart, Line, Legend
} from "recharts";

const colors = {
  bg: "#F0F4F8",
  card: "#FFFFFF",
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  primaryDark: "#1D4ED8",
  accent: "#64748B",
  text: "#0F172A",
  textLight: "#64748B",
  success: "#22C55E",
  successBg: "#F0FDF4",
  error: "#EF4444",
  errorBg: "#FEF2F2",
  warning: "#F59E0B",
  warningBg: "#FFFBEB",
  border: "#E2E8F0",
  inputBg: "#F8FAFC",
};

const font = "'DM Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";
const tickStyle = { fontSize: 11, fill: colors.textLight, fontFamily: font };

// ── Mock Data ──
const monthlyData = [
  { month: "Apr", revenue: 3500, paid: 3100, visits: 22, newPatients: 5, returning: 17 },
  { month: "May", revenue: 4200, paid: 3600, visits: 28, newPatients: 7, returning: 21 },
  { month: "Jun", revenue: 3800, paid: 3800, visits: 24, newPatients: 4, returning: 20 },
  { month: "Jul", revenue: 2900, paid: 2500, visits: 19, newPatients: 3, returning: 16 },
  { month: "Aug", revenue: 5100, paid: 4200, visits: 34, newPatients: 9, returning: 25 },
  { month: "Sep", revenue: 4600, paid: 4100, visits: 30, newPatients: 6, returning: 24 },
  { month: "Oct", revenue: 5400, paid: 4800, visits: 36, newPatients: 8, returning: 28 },
  { month: "Nov", revenue: 4900, paid: 4500, visits: 32, newPatients: 5, returning: 27 },
  { month: "Dec", revenue: 3200, paid: 2800, visits: 20, newPatients: 3, returning: 17 },
  { month: "Jan", revenue: 5800, paid: 5200, visits: 38, newPatients: 10, returning: 28 },
  { month: "Feb", revenue: 4400, paid: 3600, visits: 27, newPatients: 7, returning: 20 },
  { month: "Mar", revenue: 5200, paid: 4800, visits: 33, newPatients: 8, returning: 25 },
];

const treatmentRevenue = [
  { name: "Crowns", revenue: 12400, count: 26, color: colors.primary },
  { name: "Root Canal", revenue: 9600, count: 20, color: "#60A5FA" },
  { name: "Fillings", revenue: 6800, count: 38, color: colors.success },
  { name: "Cleaning", revenue: 4800, count: 64, color: colors.warning },
  { name: "Whitening", revenue: 3200, count: 16, color: "#8B5CF6" },
  { name: "Other", revenue: 2100, count: 22, color: "#94A3B8" },
];

const peakDays = [
  { day: "Sun", patients: 12 },
  { day: "Mon", patients: 28 },
  { day: "Tue", patients: 35 },
  { day: "Wed", patients: 31 },
  { day: "Thu", patients: 38 },
  { day: "Fri", patients: 18 },
  { day: "Sat", patients: 8 },
];

const peakHours = [
  { hour: "8am", patients: 4 },
  { hour: "9am", patients: 12 },
  { hour: "10am", patients: 18 },
  { hour: "11am", patients: 22 },
  { hour: "12pm", patients: 14 },
  { hour: "1pm", patients: 8 },
  { hour: "2pm", patients: 16 },
  { hour: "3pm", patients: 20 },
  { hour: "4pm", patients: 17 },
  { hour: "5pm", patients: 9 },
];

const retentionData = [
  { month: "Oct", new: 8, returning: 28 },
  { month: "Nov", new: 5, returning: 27 },
  { month: "Dec", new: 3, returning: 17 },
  { month: "Jan", new: 10, returning: 28 },
  { month: "Feb", new: 7, returning: 20 },
  { month: "Mar", new: 8, returning: 25 },
];

const unpaid = [
  { name: "Ahmad Khalil", balance: 750, lastVisit: "Nov 15", visits: 4 },
  { name: "Khaled Nasser", balance: 500, lastVisit: "Jan 20", visits: 3 },
  { name: "Omar Haddad", balance: 480, lastVisit: "Apr 02", visits: 2 },
  { name: "Sara Mansour", balance: 150, lastVisit: "Feb 20", visits: 5 },
];

const collectionRate = Math.round((monthlyData.reduce((s, d) => s + d.paid, 0) / monthlyData.reduce((s, d) => s + d.revenue, 0)) * 100);
const avgPerVisit = Math.round(monthlyData.reduce((s, d) => s + d.revenue, 0) / monthlyData.reduce((s, d) => s + d.visits, 0));
const totalPatients = 186;
const retentionRate = 78;

// ── Shared Components ──
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", fontFamily: font }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }} />
          <span style={{ fontSize: 12, color: colors.textLight }}>{p.name}:</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>
            {p.dataKey === "revenue" || p.dataKey === "paid" ? `$${p.value.toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

function KPICard({ label, value, change, sub, accent, footnote }) {
  const isPos = !change || change >= 0;
  return (
    <div style={{ background: colors.card, borderRadius: 20, padding: "22px 24px", boxShadow: "0 4px 32px rgba(37,99,235,0.07)", flex: 1 }}>
      <div style={{ fontSize: 11, fontFamily: font, fontWeight: 700, color: colors.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 28, fontFamily: font, fontWeight: 800, color: accent || colors.text, marginBottom: 8 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {change !== undefined && (
          <span style={{ fontSize: 12, fontFamily: font, fontWeight: 700, color: isPos ? colors.success : colors.error, background: isPos ? colors.successBg : colors.errorBg, padding: "2px 8px", borderRadius: 6 }}>
            {isPos ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
        {sub && <span style={{ fontSize: 12, fontFamily: font, color: colors.textLight }}>{sub}</span>}
      </div>
      {footnote && <div style={{ fontSize: 11, fontFamily: font, color: colors.textLight, marginTop: 6 }}>{footnote}</div>}
    </div>
  );
}

function Card({ title, subtitle, children, style: s }) {
  return (
    <div style={{ background: colors.card, borderRadius: 20, padding: 24, boxShadow: "0 4px 32px rgba(37,99,235,0.07)", ...s }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: fontDisplay, fontSize: 18, color: colors.primaryDark, margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontFamily: font, fontSize: 12, color: colors.textLight, margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: font, fontWeight: 700, color: colors.accent, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

export default function Dashboard({ patients = [] }) {
  const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const totalPaid = monthlyData.reduce((s, d) => s + d.paid, 0);
  const totalUnpaid = unpaid.reduce((s, p) => s + p.balance, 0);
  const totalVisits = monthlyData.reduce((s, d) => s + d.visits, 0);
  const maxUnpaid = unpaid[0].balance;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* ── Section 1: Overview KPIs ── */}
      <Section title="Overview">
        <div style={{ display: "flex", gap: 16 }}>
          <KPICard label="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(0)}k`} change={12} sub="vs last year" />
          <KPICard label="Collected" value={`$${(totalPaid / 1000).toFixed(0)}k`} change={8} sub="vs last year" accent={colors.success} />
          <KPICard label="Outstanding" value={`$${totalUnpaid}`} sub={`${unpaid.length} patients`} accent={colors.warning} />
          <KPICard label="Total Visits" value={totalVisits} change={15} sub="vs last year" accent={colors.primary} />
          <KPICard label="Total Patients" value={totalPatients} change={10} sub="vs last year" />
        </div>
      </Section>

      {/* ── Section 2: Performance KPIs ── */}
      <Section title="Performance">
        <div style={{ display: "flex", gap: 16 }}>
          <KPICard label="Collection Rate" value={`${collectionRate}%`} footnote="Revenue actually collected" accent={collectionRate >= 80 ? colors.success : colors.warning} />
          <KPICard label="Avg. Revenue / Visit" value={`$${avgPerVisit}`} change={5} sub="vs last year" />
          <KPICard label="Patient Retention" value={`${retentionRate}%`} footnote="Patients who return" accent={colors.primary} />
          <KPICard label="Avg. Visits / Patient" value={(totalVisits / totalPatients).toFixed(1)} footnote="Over 12 months" />
        </div>
      </Section>

      {/* ── Section 3: Revenue Charts ── */}
      <Section title="Revenue">
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
          <Card title="Revenue vs Collected" subtitle="Monthly breakdown over 12 months">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.primary} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.success} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={colors.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
                <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={colors.primary} strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
                <Area type="monotone" dataKey="paid" name="Collected" stroke={colors.success} strokeWidth={2.5} fill="url(#paidGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Revenue by Treatment" subtitle="Which treatments earn the most">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {treatmentRevenue.map((t) => (
                <div key={t.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontFamily: font, color: colors.text, fontWeight: 500 }}>{t.name}</span>
                    <span style={{ fontSize: 13, fontFamily: font, color: colors.textLight, fontWeight: 600 }}>${(t.revenue / 1000).toFixed(1)}k</span>
                  </div>
                  <div style={{ height: 6, background: colors.border, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(t.revenue / treatmentRevenue[0].revenue) * 100}%`, background: t.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* ── Section 4: Patients ── */}
      <Section title="Patients">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card title="New vs Returning Patients" subtitle="Last 6 months">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={retentionData} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
                <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={25} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="returning" name="Returning" fill={colors.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="new" name="New" fill="#60A5FA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
              {[{ label: "Returning", color: colors.primary }, { label: "New", color: "#60A5FA" }].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                  <span style={{ fontSize: 12, fontFamily: font, color: colors.textLight }}>{l.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Treatment Volume" subtitle="Number of procedures performed">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={treatmentRevenue} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} horizontal={false} />
                <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={tickStyle} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Procedures" radius={[0, 4, 4, 0]}>
                  {treatmentRevenue.map((t, i) => <Cell key={i} fill={t.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </Section>

      {/* ── Section 5: Scheduling ── */}
      <Section title="Scheduling Insights">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card title="Busiest Days" subtitle="Average patients per day of week">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={peakDays} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
                <XAxis dataKey="day" tick={tickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={25} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="patients" name="Patients" radius={[6, 6, 0, 0]}>
                  {peakDays.map((d, i) => (
                    <Cell key={i} fill={d.patients === Math.max(...peakDays.map(x => x.patients)) ? colors.primary : `${colors.primary}60`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Peak Hours" subtitle="When patients arrive during the day">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={peakHours}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.primary} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
                <XAxis dataKey="hour" tick={tickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={25} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="patients" name="Patients" stroke={colors.primary} strokeWidth={2.5} fill="url(#hoursGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </Section>

      {/* ── Section 6: Outstanding ── */}
      <Section title="Outstanding Balances">
        <Card title="Unpaid Balances" subtitle={`Total outstanding: $${unpaid.reduce((s, p) => s + p.balance, 0)}`}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {unpaid.map((p, i) => (
              <div key={p.name} style={{ padding: "14px 0", borderBottom: i < unpaid.length - 1 ? `1px solid ${colors.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: colors.text }}>{p.name}</span>
                    <span style={{ fontFamily: font, fontSize: 12, color: colors.textLight, marginLeft: 10 }}>
                      Last visit: {p.lastVisit} · {p.visits} visits
                    </span>
                  </div>
                  <span style={{ fontFamily: font, fontSize: 15, fontWeight: 800, color: colors.error }}>${p.balance}</span>
                </div>
                <div style={{ height: 6, background: colors.border, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${(p.balance / maxUnpaid) * 100}%`,
                    background: `linear-gradient(90deg, ${colors.warning}, ${colors.error})`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

    </div>
  );
}
