// Phantom Wallet types
interface PhantomProvider {
  isPhantom?: boolean
  publicKey?: {
    toBase58(): string
  }
  connect(): Promise<{ publicKey: { toBase58(): string } }>
  disconnect(): Promise<void>
  on(event: string, callback: (args: any) => void): void
  removeListener(event: string, callback: (args: any) => void): void
}

declare global {
  interface Window {
    solana?: PhantomProvider
  }
}

export const getPhantomProvider = (): PhantomProvider | null => {
  if (typeof window !== 'undefined' && window.solana?.isPhantom) {
    return window.solana
  }
  return null
}

export const connectPhantom = async (): Promise<string | null> => {
  const provider = getPhantomProvider()
  
  if (!provider) {
    window.open('https://phantom.app/', '_blank')
    throw new Error('Phantom Wallet не установлен. Пожалуйста, установите расширение Phantom.')
  }

  try {
    const response = await provider.connect()
    return response.publicKey.toBase58()
  } catch (err: any) {
    if (err.code === 4001) {
      throw new Error('Пользователь отклонил запрос на подключение.')
    }
    throw new Error('Ошибка подключения к Phantom Wallet.')
  }
}

export const disconnectPhantom = async (): Promise<void> => {
  const provider = getPhantomProvider()
  
  if (provider) {
    try {
      await provider.disconnect()
    } catch (err) {
      console.error('Ошибка отключения:', err)
    }
  }
}

export const getWalletAddress = (): string | null => {
  const provider = getPhantomProvider()
  if (provider?.publicKey) {
    return provider.publicKey.toBase58()
  }
  return null
}

export const formatAddress = (address: string): string => {
  if (address.length <= 8) return address
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

