import { useState, useEffect, useRef } from 'react'
import './Leaderboard.css'

interface Leader {
  rank: number
  username: string
  posts: number
  earned: number
}

const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

const Leaderboard = () => {
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const [leaders, setLeaders] = useState<Leader[]>(() => {
    // Начальные значения: посты от 3 до 12, earned уменьшено в 100 раз
    return [
      { rank: 1, username: '@crypto_master', posts: Math.floor(random(3, 12)), earned: random(0.05, 0.15) },
      { rank: 2, username: '@web3_king', posts: Math.floor(random(3, 12)), earned: random(0.05, 0.15) },
      { rank: 3, username: '@solana_pro', posts: Math.floor(random(3, 12)), earned: random(0.05, 0.15) },
      { rank: 4, username: '@defi_expert', posts: Math.floor(random(3, 12)), earned: random(0.05, 0.15) },
      { rank: 5, username: '@token_hunter', posts: Math.floor(random(3, 12)), earned: random(0.05, 0.15) },
    ].sort((a, b) => b.earned - a.earned)
      .map((leader, index) => ({ ...leader, rank: index + 1 }))
  })

  useEffect(() => {
    const updateLeaderboard = () => {
      setLeaders((prev) => {
        const updated = prev.map((leader) => ({
          ...leader,
          earned: leader.earned + random(0.00001, 0.0002), // Уменьшено в 100 раз
        }))

        // Re-sort by earned amount
        updated.sort((a, b) => b.earned - a.earned)

        // Update ranks
        const reRanked = updated.map((leader, index) => ({
          ...leader,
          rank: index + 1,
        }))

        return reRanked
      })

      const delay = random(6000, 8000) // 6-8 seconds
      const timeout = setTimeout(updateLeaderboard, delay)
      timeoutsRef.current.push(timeout)
    }

    // Start immediately
    updateLeaderboard()

    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current = []
    }
  }, [])

  return (
    <div className="leaderboard card">
      <h3 className="section-title">Top Promoters</h3>
      <div className="leaderboard-table">
        <div className="table-header">
          <span>Rank</span>
          <span>User</span>
          <span>Posts</span>
          <span>Earned (SOL)</span>
        </div>
        <div className="table-body">
          {leaders.map((leader) => (
            <div
              key={leader.username}
              className={`table-row ${leader.rank === 1 ? 'top-rank' : ''}`}
            >
              <span className="rank-cell">#{leader.rank}</span>
              <span className="user-cell">{leader.username}</span>
              <span className="posts-cell">{leader.posts}</span>
              <span className="earned-cell">{leader.earned.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard

