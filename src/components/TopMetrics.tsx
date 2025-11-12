import { useState, useEffect, useRef } from 'react'
import './TopMetrics.css'

interface Metric {
  value: number
  label: string
  suffix: string
  decimals: number
  minIncrement: number
  maxIncrement: number
  minInterval: number
  maxInterval: number
}

const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

// Total Unclaimed Fees: 0.8 SOL/мин = 0.0133 SOL/сек
// При интервале 0.5-1.5 сек: 0.0067-0.02 SOL за обновление
// Total Creator Rewards: 5/8 от Total Unclaimed Fees
// Total Transactions: 40/мин = 0.667/сек, при интервале 0.5-1.5 сек: 0.33-1 транзакция
// Total Paid Out: 1/5 от Total Unclaimed Fees

const initialUnclaimedFees = 0.3

const initialMetrics: Metric[] = [
  {
    value: initialUnclaimedFees,
    label: 'Total Unclaimed Fees',
    suffix: ' SOL',
    decimals: 4,
    minIncrement: 0.0067,
    maxIncrement: 0.02,
    minInterval: 500,
    maxInterval: 1500,
  },
  {
    value: initialUnclaimedFees * (5 / 8), // 5/8 от Total Unclaimed Fees
    label: 'Total Creator Rewards',
    suffix: ' SOL',
    decimals: 4,
    minIncrement: 0, // Будет вычисляться динамически
    maxIncrement: 0,
    minInterval: 500,
    maxInterval: 1500,
  },
  {
    value: Math.floor(random(7, 15)), // Начальное значение от 7 до 15
    label: 'Total Transactions',
    suffix: '',
    decimals: 0,
    minIncrement: 0.33, // 40/мин = 0.667/сек, при 0.5 сек = 0.33
    maxIncrement: 1.33, // 40/мин = 0.667/сек, при 2 сек = 1.33
    minInterval: 500,
    maxInterval: 2000, // 0.5-2 секунды
  },
  {
    value: initialUnclaimedFees / 5, // 1/5 от Total Unclaimed Fees
    label: 'Total Paid Out',
    suffix: ' SOL',
    decimals: 4,
    minIncrement: 0, // Будет вычисляться динамически
    maxIncrement: 0,
    minInterval: 500,
    maxInterval: 1500,
  },
]

const TopMetrics = () => {
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics)

  useEffect(() => {
    // Update Total Unclaimed Fees (основная метрика)
    const scheduleUnclaimedFees = () => {
      const updateUnclaimedFees = () => {
        setMetrics((prev) => {
          const newMetrics = [...prev]
          const unclaimedIndex = 0
          const currentUnclaimed = newMetrics[unclaimedIndex]
          
          // Обновляем Total Unclaimed Fees
          const increment = random(
            currentUnclaimed.minIncrement,
            currentUnclaimed.maxIncrement
          )
          const newUnclaimedValue = currentUnclaimed.value + increment
          
          newMetrics[unclaimedIndex] = {
            ...currentUnclaimed,
            value: newUnclaimedValue,
          }
          
          // Total Creator Rewards = 5/8 от Total Unclaimed Fees
          newMetrics[1] = {
            ...newMetrics[1],
            value: newUnclaimedValue * (5 / 8),
          }
          
          // Total Paid Out = 1/5 от Total Unclaimed Fees
          newMetrics[3] = {
            ...newMetrics[3],
            value: newUnclaimedValue / 5,
          }
          
          return newMetrics
        })
        
        // Schedule next update
        const delay = random(500, 1500) // 0.5-1.5 секунды
        const timeout = setTimeout(scheduleUnclaimedFees, delay)
        timeoutsRef.current.push(timeout)
      }
      
      updateUnclaimedFees()
    }
    
    // Update Total Transactions (независимо)
    const scheduleTransactions = () => {
      const updateTransactions = () => {
        setMetrics((prev) => {
          const newMetrics = [...prev]
          const transactionsIndex = 2
          const currentTransactions = newMetrics[transactionsIndex]
          
          // 40 транзакций в минуту = 0.667/сек
          // При интервале 0.5-2 сек: 0.33-1.33 транзакции
          const increment = random(
            currentTransactions.minIncrement,
            currentTransactions.maxIncrement
          )
          
          newMetrics[transactionsIndex] = {
            ...currentTransactions,
            value: currentTransactions.value + Math.floor(increment),
          }
          
          return newMetrics
        })
        
        // Schedule next update
        const delay = random(500, 2000) // 0.5-2 секунды
        const timeout = setTimeout(scheduleTransactions, delay)
        timeoutsRef.current.push(timeout)
      }
      
      updateTransactions()
    }

    // Start updates immediately
    scheduleUnclaimedFees()
    scheduleTransactions()

    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current = []
    }
  }, [])

  const formatValue = (value: number, decimals: number): string => {
    return value.toFixed(decimals)
  }

  return (
    <div className="top-metrics">
      {metrics.map((metric, index) => (
        <div key={index} className="metric-card card">
          <div className="metric-value metric-number">
            {formatValue(metric.value, metric.decimals)}
            {metric.suffix}
          </div>
          <div className="metric-label">{metric.label}</div>
          <svg className="metric-line" viewBox="0 0 200 2">
            <path
              d="M 0 1 Q 50 0.5 100 1 T 200 1"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.5"
              fill="none"
            >
              <animate
                attributeName="d"
                values="M 0 1 Q 50 0.5 100 1 T 200 1;M 0 1 Q 50 1.5 100 1 T 200 1;M 0 1 Q 50 0.5 100 1 T 200 1"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      ))}
    </div>
  )
}

export default TopMetrics

