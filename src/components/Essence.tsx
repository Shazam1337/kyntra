import { useEffect, useState } from 'react'
import { connectPhantom, disconnectPhantom, getWalletAddress, formatAddress, getPhantomProvider } from '../utils/phantom'
import './Essence.css'

const Essence = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    const checkWallet = () => {
      const address = getWalletAddress()
      if (address) {
        setWalletAddress(address)
        setIsWalletConnected(true)
      } else {
        setWalletAddress(null)
        setIsWalletConnected(false)
      }
    }

    checkWallet()

    // Listen for account changes
    const provider = getPhantomProvider()
    if (provider) {
      const handleAccountChange = (publicKey: any) => {
        if (publicKey) {
          const address = typeof publicKey === 'string' 
            ? publicKey 
            : publicKey.toBase58?.() || null
          setWalletAddress(address)
          setIsWalletConnected(!!address)
        } else {
          setWalletAddress(null)
          setIsWalletConnected(false)
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
        setIsWalletConnected(false)
      } catch (err: any) {
        console.error('Disconnect error:', err)
      }
    } else {
      // Connect
      setIsConnecting(true)
      try {
        const address = await connectPhantom()
        setWalletAddress(address)
        setIsWalletConnected(true)
      } catch (err: any) {
        console.error('Connect error:', err)
      } finally {
        setIsConnecting(false)
      }
    }
  }

  return (
    <div className={`essence ${isWalletConnected ? 'wallet-connected' : ''}`}>
      <h1 className="essence-title">PROMOTE. EARN. EVOLVE.</h1>

      <div className="essence-text">
        <p>
          Every post tagged with{' '}
          <span className="token-highlight" title="The reward token of KYNTRA402 ecosystem.">
            $KYN402
          </span>{' '}
          strengthens the network.
        </p>
        <p>Rewards flow back to you — directly in SOL.</p>
        <p>Real impact, measurable influence.</p>
      </div>

      <div className="essence-cta">
        <button 
          className="essence-connect-button"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            'Connecting...'
          ) : walletAddress ? (
            formatAddress(walletAddress)
          ) : (
            'Connect Wallet →'
          )}
        </button>
      </div>
    </div>
  )
}

export default Essence

