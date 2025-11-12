import AnimatedBackground from './components/AnimatedBackground'
import Header from './components/Header'
import Essence from './components/Essence'
import TopMetrics from './components/TopMetrics'
import LiveFeed from './components/LiveFeed'
import SubmitForm from './components/SubmitForm'
import PendingVerifications from './components/PendingVerifications'
import Leaderboard from './components/Leaderboard'
import FeeClaims from './components/FeeClaims'
import './App.css'

function App() {
  return (
    <div className="app">
      <AnimatedBackground />
      <Header />
      <main className="main-content">
        <div className="content-grid">
          {/* Essence Block - 35-40% */}
          <div className="essence-section">
            <Essence />
          </div>

          {/* Divider */}
          <div className="content-divider"></div>

          {/* Dashboard - 60-65% */}
          <div className="dashboard-section">
            {/* Метрики сверху */}
            <div className="top-metrics-section">
              <TopMetrics />
            </div>

            {/* Центральный блок */}
            <div className="center-section">
              <LiveFeed />
              <PendingVerifications />
            </div>

            {/* Правый блок */}
            <div className="right-section">
              <SubmitForm />
              <Leaderboard />
              <FeeClaims />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

