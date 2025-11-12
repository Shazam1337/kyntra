import { useState, useEffect } from 'react'
import { connectPhantom, disconnectPhantom, getWalletAddress, formatAddress, getPhantomProvider } from '../utils/phantom'
import './Header.css'

const Header = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = () => {
      const address = getWalletAddress()
      if (address) {
        setWalletAddress(address)
      }
    }

    checkConnection()

    // Listen for account changes
    const provider = getPhantomProvider()
    if (provider) {
      const handleAccountChange = (publicKey: any) => {
        if (publicKey) {
          const address = typeof publicKey === 'string' 
            ? publicKey 
            : publicKey.toBase58?.() || null
          setWalletAddress(address)
        } else {
          setWalletAddress(null)
        }
      }

      provider.on('accountChanged', handleAccountChange)

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountChanged', handleAccountChange)
        }
      }
    }
  }, [])

  const handleConnect = async () => {
    if (walletAddress) {
      // Disconnect
      try {
        await disconnectPhantom()
        setWalletAddress(null)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Ошибка отключения')
      }
    } else {
      // Connect
      setIsConnecting(true)
      setError(null)
      
      try {
        const address = await connectPhantom()
        setWalletAddress(address)
      } catch (err: any) {
        setError(err.message || 'Ошибка подключения')
      } finally {
        setIsConnecting(false)
      }
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img 
            src="/logo.png" 
            alt="KYNTRA Logo" 
            className="logo-image"
          />
          <span className="brand-name">KYNTRA</span>
        </div>

        <div className="header-right">
          <div className="system-status">
            <span className="status-dot"></span>
            <span>System Online</span>
          </div>

          <a
            href="https://x.com/kyntra402"
            target="_blank"
            rel="noopener noreferrer"
            className="twitter-link"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {error && (
            <div className="wallet-error" title={error}>
              !
            </div>
          )}

          <button
            className={`connect-button ${walletAddress ? 'connected' : ''}`}
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              'Connecting...'
            ) : walletAddress ? (
              formatAddress(walletAddress)
            ) : (
              'Connect Wallet'
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

