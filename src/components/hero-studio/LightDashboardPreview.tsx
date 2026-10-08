import { BarChart3, Bell, CreditCard, LayoutDashboard, MoreHorizontal, Search, TrendingUp } from "lucide-react"

const lightMetrics = [
  { label: "Sales Insight", value: "88.91%", change: "+2.90%", color: "#72bd9b" },
  { label: "Profit", value: "$38,420", change: "+8.12%", color: "#72bd9b" },
  { label: "Expenses", value: "$9,385", change: "−1.40%", color: "#db8a9b" },
]

export function LightDashboardPreview() {
  return (
    <div className="hs-light-dashboard">
      <aside className="hs-light-dashboard-nav">
        <div className="hs-light-dashboard-logo">
          <span><i /><i /><i /></span>
          Sincra.
        </div>
        <div className="hs-light-dashboard-nav-item is-active"><LayoutDashboard size={15} /> Dashboard</div>
        <div className="hs-light-dashboard-nav-item"><CreditCard size={15} /> Payments</div>
        <div className="hs-light-dashboard-nav-item"><BarChart3 size={15} /> Analytics</div>
      </aside>
      <div className="hs-light-dashboard-main">
        <div className="hs-light-dashboard-header">
          <div><strong>Dashboard</strong><small>Easily link your bank accounts.</small></div>
          <div className="hs-light-dashboard-actions"><Search size={15} /><Bell size={15} /><span>Report</span></div>
        </div>
        <div className="hs-light-dashboard-metrics">
          {lightMetrics.map((metric) => (
            <div className="hs-light-dashboard-metric" key={metric.label}>
              <div className="hs-light-dashboard-metric-top"><span>{metric.label}</span><MoreHorizontal size={16} /></div>
              <div className="hs-light-dashboard-metric-value"><strong>{metric.value}</strong><em style={{ color: metric.color }}>{metric.change}</em></div>
              <svg viewBox="0 0 150 34" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 29 C18 28 18 11 34 17 S55 27 69 11 S88 19 104 8 S122 18 150 3" fill="none" stroke={metric.color} strokeWidth="2" />
              </svg>
            </div>
          ))}
        </div>
        <div className="hs-light-dashboard-bottom">
          <div className="hs-light-dashboard-chart">
            <div className="hs-light-dashboard-section-title"><strong>Sales Insight</strong><span>Last 6 months</span></div>
            <div className="hs-light-dashboard-bars" aria-hidden="true">
              {[31, 52, 38, 66, 50, 72, 57, 81, 68, 89, 75, 96].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="hs-light-dashboard-months"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span></div>
          </div>
          <div className="hs-light-dashboard-balance">
            <span>Total Balance</span>
            <strong>$9,385.34</strong>
            <small>Spending in November</small>
            <div className="hs-light-dashboard-progress"><i /></div>
            <div className="hs-light-dashboard-balance-note"><TrendingUp size={15} /> Your balance is growing steadily.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
