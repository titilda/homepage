<script setup>
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import RippleBackground from './components/RippleBackground.vue'
  import SiteHeader from './components/SiteHeader.vue'
  import toolsData from './data/tools.json'
  import members from './data/members.json'

  const OnDocumentLoad = () => {
    window.scrollTo(0, 0)
  }

  const scrollY = ref(0)
  const handleScroll = () => { scrollY.value = window.scrollY }

  const isModalOpen = ref(false)

  const trackRef = ref(null)
  const baseSpeed = 1
  const maxSpeed = 12
  const targetSpeed = ref(baseSpeed)
  const currentSpeed = ref(baseSpeed)
  const scrollDirection = ref(-1) //? -1 = scroll left, 1 = scroll right
  let trackPosition = 0 
  const cardWidthWithGap = 332 
  let animationId = null

  const hotToolsData = computed(() => toolsData.filter(tool => tool.hottest === true))
  const shouldScroll = computed(() => hotToolsData.value.length > 3)

  const hottestTools = computed(() => {
    const hotTools = hotToolsData.value
    
    if(!shouldScroll.value) return hotTools

    const selected = hotTools.length > 5 
      ? hotTools.sort(() => 0.5 - Math.random()).slice(0, 5) 
      : hotTools
    
    return [...selected, ...selected, ...selected]
  })

  const accelerate = (dir) => {
    scrollDirection.value = dir
    targetSpeed.value = maxSpeed
  }
  const decelerate = () => {
    targetSpeed.value = baseSpeed
  }
  const pauseTrack = () => {
    targetSpeed.value = 0
  }

  const updateMarquee = () => {
    if(!shouldScroll.value) return

    currentSpeed.value += (targetSpeed.value - currentSpeed.value) * 0.05
    trackPosition += currentSpeed.value * scrollDirection.value

    const singleSetWidth = (hottestTools.value.length / 3) * cardWidthWithGap
    
    if (trackPosition <= -singleSetWidth) {
      trackPosition += singleSetWidth
    } else if (trackPosition >= 0) {
      trackPosition -= singleSetWidth
    }

    if (trackRef.value) {
      trackRef.value.style.transform = `translateX(${trackPosition}px)`
    }

    animationId = requestAnimationFrame(updateMarquee)
  }

  onMounted(() => {
    OnDocumentLoad()
    window.addEventListener('scroll', handleScroll)
    nextTick(() => { animationId = requestAnimationFrame(updateMarquee) })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    cancelAnimationFrame(animationId)
  })
</script>

<template>
  <div class="app-wrapper">
    <RippleBackground :scrollOffset="scrollY" />
    
    <div class="content-layer">
      <SiteHeader />
      
      <main class="main-content">
        <div class="hero-container">
          <h1 class="hero-title">This is TiTilda</h1>

          <div class="spinning-badge">
            <svg viewBox="0 0 200 200" class="spinning-svg">
              <path id="circlePath"
              d="M100, 100 m -75, 0 a 75, 75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              fill="none"
              />
              <text>
                <textPath href="#circlePath" startOffset="0%">
                  by students • for students • by students • for students 
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </main>

      <section class="glass-section tools-section">
        <div class="hottest-tools-container">
          <div class="carousel-header">
            <!-- Add Flame SVG Here -->
            <h2 class="section-title">Almost As Hot As You!</h2>
            <div class="carousel-controls" v-if="shouldScroll">
              <!-- Mouse & Touch events bound to momentum functions -->
              <button 
                  class="carousel-control prev" 
                  @mousedown="accelerate(1)" @mouseup="decelerate" @mouseleave="decelerate"
                  @touchstart.prevent="accelerate(1)" @touchend.prevent="decelerate"
                >&#8249;</button>
                <button 
                  class="carousel-control next" 
                  @mousedown="accelerate(-1)" @mouseup="decelerate" @mouseleave="decelerate"
                  @touchstart.prevent="accelerate(-1)" @touchend.prevent="decelerate"
                >&#8250;</button>
            </div>
          </div>

          <div class="marquee-viewport">
            <div 
              class="marquee-track" 
              :class="{ 'is-static': !shouldScroll }"
              ref="trackRef"
              @mouseenter="pauseTrack" 
              @mouseleave="decelerate"
            >
              <div 
                v-for="(tool, index) in hottestTools" 
                :key="`${tool.id}-${index}`"
                class="glass-card vertical-card" 
                :class="tool.status === 'Live' ? 'active-tool' : 'locked-tool'"
              >
                <div class="status-badge" :class="{ 'pending': tool.status !== 'Live' }">
                  {{ tool.status }}
                </div>
                
                <div class="card-content">
                  <img 
                    v-if="tool.logo && tool.logo !== '#'" 
                    loading="lazy"
                    :src="tool.logo.startsWith('/') ? tool.logo : '/' + tool.logo" 
                    :alt="`${tool.name} logo`" 
                    class="tool-logo" 
                  />
                  <h3>{{ tool.name }}</h3>
                  <p>{{ tool.description }}</p>
                </div>
                
                <a 
                  v-if="tool.url && tool.status === 'Live'" 
                  :href="tool.url" 
                  target="_blank"
                  class="card-action-btn"
                >
                  View Tool
                </a>
              </div>
            </div>
          </div>

          <div class="see-all-wrapper">
            <button class="see-all-btn" @click="isModalOpen = true">See All Tools &rarr;</button>
          </div>
        </div>

        <Transition name="expand">
          <div v-if="isModalOpen" class="tools-modal">
            <div class="modal-header">
              <h2>All Resources & Tools</h2>
              <button class="close-btn" @click="isModalOpen = false">&times; Go Back</button>
            </div>
            
            <div class="tools-grid">
              <component 
                :is="tool.url ? 'a' : 'div'" 
                v-for="tool in toolsData" 
                :key="tool.id"
                :href="tool.url"
                target="_blank"
                class="glass-card horizontal-card" 
                :class="tool.status === 'Live' ? 'active-tool' : 'locked-tool'"
              >
                <div class="card-content">
                  <img 
                    v-if="tool.logo && tool.logo !== '#'" 
                    loading="lazy"
                    :src="tool.logo.startsWith('/') ? tool.logo : '/' + tool.logo" 
                    :alt="`${tool.name} logo`" 
                    class="tool-logo" 
                  />
                  <h3>{{ tool.name }}</h3>
                  <!-- <p>{{ tool.description }}</p> -->
                </div>
                <div class="status-badge" :class="{ 'pending': tool.status !== 'Live' }">
                  {{ tool.status }}
                </div>
                
                <div class="fly-in-text" v-if="tool.status === 'Live'">
                  View Resource &raquo;
                </div>
              </component>
            </div>
          </div>
        </Transition>
      </section>

      <section class="glass-section roster-section">
        <!-- Add Heisenber SVG icon here -->
        <h2 class="section-title">Say Our Names</h2>
        <div class="roster-grid">
          <div v-for="member in members" :key="member.name" class="member-card">

            <img 
              loading="lazy"
              :src="(member.image && member.image !== '#') ? member.image : '/images/placeholder.png'" 
              :alt="member.name" 
              class="member-image" 
            />
            <span class="member-info">
              <h3>{{ member.name }}</h3>
            </span>
            <div class="member-links-overlay">
              <div class="overlay-description">
                <p>{{ member.description }}</p>
              </div>
              
              <div class="overlay-buttons">
                <a v-if="member.links.cv && member.links.cv !== '#'" :href="member.links.cv" target="_blank" class="link-btn">CV</a>
                <a v-if="member.links.website && member.links.website !== '#'" :href="member.links.website" target="_blank" class="link-btn">Web</a>
                <a v-if="member.links.github && member.links.github !== '#'" :href="member.links.github" target="_blank" class="link-btn">GitHub</a>
                <a v-if="member.links.linkedin && member.links.linkedin !== '#'" :href="member.links.linkedin" target="_blank" class="link-btn">LinkedIn</a>
                <a v-if="member.links.instagram && member.links.instagram !== '#'" :href="member.links.instagram" target="_blank" class="link-btn">IG</a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, sans-serif;
}

body {
  background-color: #000;
  color: #fff;

  &:has(.tools-modal) {
    overflow: hidden;
  }
}

.app-wrapper {
  position: relative;
  min-height: 100vh;
}

.content-layer {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

.main-content {
  min-height: calc(100vh - 100px); 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  user-select: none;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: -10vh; 
}

.hero-title {
  font-size: 5.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  text-align: center;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3);
  cursor: default;
}

.spinning-badge {
  width: 220px;
  height: 220px;
  cursor: default;
}

.spinning-svg {
  width: 100%;
  height: 100%;
  animation: spin 25s linear infinite;

  text {
    font-size: 22px;
    font-weight: 500;
    fill: #fff; 
    letter-spacing: 3.5px;
    text-transform: uppercase;

    text-shadow: 0 0 4px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.3);
  }
}

.glass-section {
  padding: 6rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  color: #fff;
}

.tools-section {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center; 
  padding-top: 11vh;
}

.hottest-tools-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  .section-title {
    margin-bottom: 0;
  }
}

.carousel-controls {
  display: flex;
  gap: 1rem;
}

.carousel-control {
  background: rgba(11, 2, 23, 0.8);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  user-select: none;
  
  &:hover {
    background: #00e5ff;
    color: #000;
  }
}

.marquee-viewport {
  width: 100%;
  overflow: hidden;
  padding: 20px 0; 
  margin: -20px 0;
}

.marquee-track {
  display: flex;
  gap: 2rem; 
  width: max-content;
  will-change: transform; /*! Forces GPU compositing */

  &.is-static {
    width: 100%;
    justify-content: center;
  }
}

.vertical-card {
  width: 300px;
  height: 420px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; 
  position: relative;
  
  .card-content {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    h3 {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
    }
  }

  .status-badge {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem; 
    right: auto;
  }

.card-action-btn {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    background: #00e5ff;
    color: #000;
    text-align: center;
    padding: 0.75rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover.active-tool {
    .card-content {
      transform: translateY(-60px);
    }
    .card-action-btn {
      opacity: 1;
      transform: translateY(0); 
    }
  }
}

.see-all-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.see-all-btn {
  background: transparent;
  color: #00e5ff;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: opacity 0.2s;
  
  &:hover { opacity: 0.7; }
}

.tools-modal {
  position: fixed;
  inset: 0; 
  background: rgba(11, 2, 23, 0.95);
  backdrop-filter: blur(20px);
  z-index: 1000;
  padding: 4rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-header {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
  
  h2 { font-size: 2.5rem; }
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fff;
    color: #000;
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: scale(0.95); 
}

.tools-grid {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  color: #fff;
  transition: transform 0.3s ease, background 0.3s ease;
  overflow: hidden;
  
  @media (max-width: 768px) {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: rgba(15, 5, 25, 0.85);
  }

  &:hover.active-tool {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(0, 229, 255, 0.4);
  }
}

.horizontal-card {  
  .fly-in-text {
    position: absolute;
    right: 2rem;
    bottom: 2rem;
    color: #00e5ff;
    font-weight: 700;
    font-size: 0.95rem;
    opacity: 0;
    transform: translateX(40px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover.active-tool {
    .fly-in-text {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

.tool-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3)); 
}

.locked-tool {
  opacity: 0.6;
  pointer-events: none;
}

.status-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #00e5ff;
  color: #000;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  
  &.pending {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
}

.roster-section {
  position: relative;
}

.roster-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100%;
  background: #000000;
  z-index: -1;
}

.roster-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center; 
}

.member-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.4);
  aspect-ratio: 3/4; 

  flex: 0 0 220px; 
  max-width: 220px;
  
  &:hover .member-links-overlay {
    transform: translateY(0); 
  }
}

.member-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}

.member-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 1rem 1rem;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  
  h3 { font-size: 1.1rem; margin-bottom: 0.2rem; }
  p { font-size: 0.85rem; color: #aaa; }
}

.member-links-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 105%;
  background: rgba(11, 2, 23, 0.85);
  backdrop-filter: blur(8px);
  
  display: flex;
  flex-direction: column; 
  
  transform: translateY(100%); 
  transition: transform 0.4s ease-in-out;

  @media (max-width: 768px) {
    backdrop-filter: none;
    background: rgba(11, 2, 23, 0.95);
  }
}

.overlay-description {
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  text-align: center;
  
  p {
    font-size: 0.95rem;
    line-height: 1.5;
    color: #ffffff;
    white-space: pre-line;
  }
}

.overlay-buttons {
  height: 30%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0 1.5rem 1.5rem;
}

.link-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    background: #00e5ff;
    color: #000;
    border-color: #00e5ff;
  }
}


@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

