import { useState, useEffect, useRef } from 'react'
import './FeeClaims.css'

const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

const FeeClaims = () => {
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const [creatorFees, setCreatorFees] = useState(0.025238)
  const [lastTransfer, setLastTransfer] = useState(0.013559)

  useEffect(() => {
    const updateCreatorFees = () => {
      setCreatorFees((prev) => prev + random(0.0008, 0.003))
      const delay = random(3000, 5000) // 3.0-5.0 seconds
      const timeout = setTimeout(updateCreatorFees, delay)
      timeoutsRef.current.push(timeout)
    }

    const updateVaultTransfer = () => {
      setLastTransfer((prev) => prev + random(0.0003, 0.001))
      const delay = random(4000, 7000) // 4.0-7.0 seconds
      const timeout = setTimeout(updateVaultTransfer, delay)
      timeoutsRef.current.push(timeout)
    }

    // Start immediately
    updateCreatorFees()
    updateVaultTransfer()

    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      timeoutsRef.current = []
    }
  }, [])

  return (
    <div className="fee-claims card">
      <h3 className="section-title">Fee Claims</h3>
      <div className="fee-info">
        <div className="fee-item">
          <span className="fee-label">Creator Fee Claims:</span>
          <span className="fee-value metric-number">
            {creatorFees.toFixed(6)} SOL
          </span>
        </div>
        <div className="fee-item">
          <span className="fee-label">Last Vault Transfer:</span>
          <span className="fee-value metric-number positive">
            +{lastTransfer.toFixed(6)} SOL
          </span>
        </div>
      </div>
      <a
        href="https://solscan.io/amm/pumpfun"
        target="_blank"
        rel="noopener noreferrer"
        className="button explorer-button"
      >
        View on Explorer
      </a>
    </div>
  )
}

export default FeeClaims

