import { useState, useEffect } from 'react'
import './PendingVerifications.css'

interface PendingItem {
  id: number
  username: string
  message: string
  progress: number
  reward: number
  verified: boolean
}

const PendingVerifications = () => {
  const [items, setItems] = useState<PendingItem[]>([])

  useEffect(() => {
    // Initialize with 10 items
    const initialItems: PendingItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      username: `@user${Math.floor(Math.random() * 1000)}`,
      message: 'Posting about $KYN402...',
      progress: Math.floor(Math.random() * 40) + 50, // 50-90%
      reward: Math.random() * 0.03 + 0.01,
      verified: false,
    }))

    setItems(initialItems)

    const interval = setInterval(() => {
      setItems((prev) => {
        return prev.map((item) => {
          if (item.verified) return item

          const newProgress = Math.min(
            100,
            item.progress + Math.random() * 5 + 1
          )

          if (newProgress >= 100 && !item.verified) {
            return {
              ...item,
              progress: 100,
              verified: true,
            }
          }

          return {
            ...item,
            progress: newProgress,
          }
        })
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pending-verifications card">
      <h3 className="section-title">Pending Verifications</h3>
      <div className="pending-list">
        {items.map((item) => (
          <div key={item.id} className="pending-item">
            <div className="pending-header">
              <span className="pending-username">{item.username}</span>
              {item.verified ? (
                <span className="verified-badge">
                  Verified +{item.reward.toFixed(4)} SOL
                </span>
              ) : (
                <span className="pending-status">Pending {Math.floor(item.progress)}%</span>
              )}
            </div>
            <div className="pending-message">{item.message}</div>
            {!item.verified && (
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingVerifications

