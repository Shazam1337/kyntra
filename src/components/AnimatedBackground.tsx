import { useEffect, useRef } from 'react'
import './AnimatedBackground.css'

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    let animationId: number | null = null

    let time = 0
    const gridSize = 40
    const dotSize = 1
    const numDots = Math.floor((canvas.width * canvas.height) / (gridSize * gridSize))

    const animate = () => {
      time += 0.005
      
      // Clear canvas
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Parallax offset from mouse
      const offsetX = ((mouseRef.current.x / canvas.width) - 0.5) * 20
      const offsetY = ((mouseRef.current.y / canvas.height) - 0.5) * 20

      // Draw subtle dot grid (white noise pattern)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      
      for (let i = 0; i < numDots; i++) {
        const x = (i % Math.floor(canvas.width / gridSize)) * gridSize + (gridSize / 2)
        const y = Math.floor(i / Math.floor(canvas.width / gridSize)) * gridSize + (gridSize / 2)
        
        // Subtle parallax
        const px = x + offsetX * (y / canvas.height)
        const py = y + offsetY * (x / canvas.width)
        
        // Pulsing effect
        const pulse = 0.8 + Math.sin(time + i * 0.1) * 0.2
        
        ctx.beginPath()
        ctx.arc(px, py, dotSize * pulse, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 0.5
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x + offsetX * 0.3, 0)
        ctx.lineTo(x + offsetX * 0.3, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y + offsetY * 0.3)
        ctx.lineTo(canvas.width, y + offsetY * 0.3)
        ctx.stroke()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="animated-background" />
}

export default AnimatedBackground

