<template>
  <canvas ref="canvasRef" class="ripple-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref(null)
let animationFrameId = null
let time = 0

const props = defineProps({
  scrollOffset: {
    type: Number,
    default: 0
  }
})

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  
  let width = window.innerWidth
  let height = window.innerHeight
  canvas.width = width
  canvas.height = height

  const handleResize = () => {
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width
    canvas.height = height
  }
  window.addEventListener('resize', handleResize)

  const linesCount = 70;
  const amplitudeBase = 60;
  const stepX = 15; 

  const draw = () => {
    ctx.fillStyle = '#0b0217'
    ctx.fillRect(0, 0, width, height)

    ctx.lineWidth = 2
    ctx.lineJoin = 'round'

    const spacing = height / linesCount

    const extendingLines = 10; //? Extra number of lines to extend beyond the visible area

    const currentAmplitude = Math.max(5, 60 - props.scrollOffset * 0.08)
    const ratio = (currentAmplitude - 5) / 55;

    const r = Math.floor(72 + (183 * ratio));
    const g = Math.floor(12 + (222 * ratio));
    const b = Math.floor(122 - (122 * ratio));
    const dynamicPeakColor = `rgb(${r}, ${g}, ${b})`;

    for (let i = -extendingLines; i < linesCount + extendingLines; i++) {
      const baseY = i * spacing
      
      const gradient = ctx.createLinearGradient(0, baseY - currentAmplitude * 1.5, 0, baseY + currentAmplitude * 1.5)
      gradient.addColorStop(0.1, dynamicPeakColor) 
      gradient.addColorStop(0.9, '#480c7a') 
      
      ctx.strokeStyle = gradient
      ctx.beginPath()

      for (let x = 0; x <= width + stepX; x += stepX) {
        const nx = x * 0.003
        const ny = i * 0.08
        
        const wave1 = Math.sin(nx * 4 + time * 0.001 + ny)
        const wave2 = Math.cos(nx * 2 - time * 0.00025 + ny * 2)
        const wave3 = Math.sin(nx * 7 + time * 0.0008)

        const displacement = (wave1 + wave2 * 0.5 + wave3 * 0.25) * currentAmplitude
        const y = baseY + displacement

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }

    time += 5 
    animationFrameId = requestAnimationFrame(draw)
  }

  draw()

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    cancelAnimationFrame(animationFrameId)
  })
})
</script>

<style lang="scss" scoped>
.ripple-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
//   display: block;
}
</style>