import { useEffect, useRef } from 'react'

function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      canvas.height = window.innerHeight
      canvas.width = window.innerWidth
    }

    resizeCanvas()

    const chars = '0101DEVGAMECODE'
    const fontSize = 14
    let columns = canvas.width / fontSize
    let drops = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#0F0'
      ctx.font = `${fontSize}px monospace`

      drops.forEach((y, i) => {
        const text = chars.charAt(Math.floor(Math.random() * chars.length))
        ctx.fillText(text, i * fontSize, y * fontSize)
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
    }

    const interval = setInterval(draw, 33)

    const handleResize = () => {
      resizeCanvas()
      columns = canvas.width / fontSize
      drops = Array(Math.floor(columns)).fill(1)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 z-0 opacity-30" />
}

export default MatrixRain