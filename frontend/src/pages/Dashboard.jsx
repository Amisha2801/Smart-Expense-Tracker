import "../App.css";

function Dashboard() {
  return (
    <main className="dashboard-page">
      <section className="hero-title">
        <span className="sparkle">✦</span>
        <h1>Smart Expense Tracker</h1>
        <span className="sparkle">✦</span>
      </section>

      <section className="overview-heading">
        <h2>Dashboard Overview</h2>
        <div className="heading-line"></div>
      </section>

      <section className="summary-grid">
        <div className="summary-card purple-card">
          <div className="card-icon">💳</div>
          <div>
            <h3>Total Expenses</h3>
            <p>$3,000</p>
          </div>
        </div>

        <div className="summary-card green-card">
          <div className="card-icon">💰</div>
          <div>
            <h3>Monthly Budget</h3>
            <p>$7,000</p>
          </div>
        </div>

        <div className="summary-card orange-card">
          <div className="card-icon">📊</div>
          <div>
            <h3>Remaining Budget</h3>
            <p>$4,000</p>
          </div>
        </div>
      </section>

      <section className="transactions-card">
        <div className="transactions-header">
          <div className="card-icon small-icon">📄</div>
          <h2>Recent Transactions</h2>
        </div>

        <div className="empty-state">
          <div className="empty-icon">🗂️</div>
          <p>No transactions available.</p>
          <button>Add Expense</button>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;