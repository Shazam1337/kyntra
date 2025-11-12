import { useState, useEffect } from 'react'
import { getWalletAddress } from '../utils/phantom'
import './SubmitForm.css'

const SubmitForm = () => {
  const [formData, setFormData] = useState({
    twitterHandle: '',
    tweetUrl: '',
    walletAddress: '',
  })
  const [submitted, setSubmitted] = useState(false)

  // Auto-fill wallet address if connected
  useEffect(() => {
    const checkWallet = () => {
      const address = getWalletAddress()
      if (address) {
        setFormData((prev) => {
          // Only update if address changed or field is empty
          if (prev.walletAddress !== address) {
            return {
              ...prev,
              walletAddress: address,
            }
          }
          return prev
        })
      }
    }

    checkWallet()
    // Check periodically in case wallet connects after component mount
    const interval = setInterval(checkWallet, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ twitterHandle: '', tweetUrl: '', walletAddress: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="submit-form card">
      <h3 className="form-title">Submit Promotion</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="twitterHandle">Twitter Handle</label>
          <input
            type="text"
            id="twitterHandle"
            name="twitterHandle"
            className="input"
            placeholder="@username"
            value={formData.twitterHandle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tweetUrl">Tweet URL</label>
          <input
            type="url"
            id="tweetUrl"
            name="tweetUrl"
            className="input"
            placeholder="https://twitter.com/..."
            value={formData.tweetUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="walletAddress">Solana Wallet Address</label>
          <input
            type="text"
            id="walletAddress"
            name="walletAddress"
            className="input"
            placeholder="Your Solana wallet address (auto-filled if connected)"
            value={formData.walletAddress}
            onChange={handleChange}
            required
            readOnly={!!getWalletAddress()}
          />
          {getWalletAddress() && (
            <div className="wallet-connected-hint">
              Connected wallet address
            </div>
          )}
        </div>

        <button type="submit" className="button submit-button">
          Submit Promotion
        </button>
      </form>

      <div className="form-notes">
        <p>• Must include $KYN402 or CA in tweet</p>
        <p>• Verification runs every 5 minutes</p>
        <p>• Rewards flow automatically</p>
      </div>

      {submitted && (
        <div className="submission-notice">
          Tweet received. Verification pending...
        </div>
      )}
    </div>
  )
}

export default SubmitForm

