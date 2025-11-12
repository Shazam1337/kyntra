import { useState, useEffect, useRef } from 'react'
import './LiveFeed.css'

interface FeedItem {
  id: number
  user: string
  action: string
  amount: string
  isNew: boolean
}

const users = [
  '@alex_crypt',
  '@jason_dev',
  '@marina_sol',
  '@nft_dan',
  '@tomwills',
  '@ethjane',
  '@davidonchain',
  '@milaweb',
  '@lars_trades',
  '@jennyhodl',
  '@nicktoken',
  '@kira_0x',
  '@daveport',
  '@sofiamint',
  '@ryan_blocks'
]

const actions = [
  '→ verified tweet',
  '→ shared promotion',
  '→ completed verification',
  '→ reward distributed',
  '→ posted about $KYN402',
]

const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

const generateFeedItem = (): FeedItem => {
  const user = users[Math.floor(Math.random() * users.length)]
  const action = actions[Math.floor(Math.random() * actions.length)]
  const sol = (0.01 + Math.random() * 0.035).toFixed(4)
  return {
    id: Date.now() + Math.random(),
    user,
    action,
    amount: sol,
    isNew: true,
  }
}

const LiveFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() => {
    // Начальные 5 записей
    return Array.from({ length: 5 }, () => generateFeedItem())
  })

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const addFeedItem = () => {
      const newItem = generateFeedItem()
      setFeedItems((prev) => {
        const updated = [newItem, ...prev]
        // Ограничиваем до 7 видимых записей
        return updated.slice(0, 7)
      })

      // Убираем флаг isNew через 400ms
      setTimeout(() => {
        setFeedItems((prev) =>
          prev.map((item) =>
            item.id === newItem.id ? { ...item, isNew: false } : item
          )
        )
      }, 400)
    }

    const scheduleNext = () => {
      const delay = random(1200, 2300) // 1.2-2.3 секунды
      timeoutId = setTimeout(() => {
        addFeedItem()
        scheduleNext()
      }, delay)
    }

    scheduleNext()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  // Динамическая высота контейнера
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateHeight = () => {
      const itemHeight = 28 // Высота одной строки
      const titleHeight = 24 // Высота заголовка
      const padding = 24 // 12px top + 12px bottom
      const visibleItems = feedItems.length
      const newHeight = titleHeight + (visibleItems * itemHeight) + padding
      container.style.height = `${newHeight}px`
    }

    updateHeight()
  }, [feedItems])

  return (
    <div className="live-feed-container card" ref={containerRef}>
      <h3 className="live-feed-title section-title">LIVE FEED</h3>
      <div className="feed-list">
        {feedItems.map((item) => (
          <div
            key={item.id}
            className={`feed-item ${item.isNew ? 'new' : ''}`}
          >
            <span className="feed-user">{item.user}</span>{' '}
            <span className="feed-action">{item.action}</span>{' '}
            <span className="amount">(+{item.amount} SOL)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LiveFeed

