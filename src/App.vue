<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import RippleBackground from './components/RippleBackground.vue'
  import SiteHeader from './components/SiteHeader.vue'
  import toolsData from './data/tools.json'
  import members from './data/members.json'

  const scrollY = ref(0)
  const handleScroll = () => { scrollY.value = window.scrollY }
  onMounted(() => window.addEventListener('scroll', handleScroll))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))

  const isModalOpen = ref(false)

  const carouselRef = ref(null)
  const scrollCarousel = (direction) => {
    if (carouselRef.value) {
      const scrollAmount = 320
      carouselRef.value.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' })
    }
  }

  const hottestTools = computed(() => {
    const hotTools = toolsData.filter(tool => tool.hottest === true)
    
    if (hotTools.length > 5) {
      return hotTools
        .sort(() => 0.5 - Math.random()) 
        .slice(0, 5)
    }
    
    return hotTools.slice(0, 5)
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
          <h2 class="section-title">Almost As Hot As You!</h2>

          <button class="carousel-control prev" @click="scrollCarousel(-1)">&#8249;</button>
          <button class="carousel-control next" @click="scrollCarousel(1)">&#8250;</button>

          <div class="carousel-wrapper" ref="carouselRef">
            <component 
              :is="tool.url ? 'a' : 'div'" 
              v-for="tool in hottestTools" 
              :key="tool.id"
              :href="tool.url"
              class="glass-card carousel-card" 
              :class="tool.status === 'Live' ? 'active-tool' : 'locked-tool'"
            >
              <div class="card-content">
                <h3>{{ tool.name }}</h3>
                <p>{{ tool.description }}</p>
              </div>
              <div class="status-badge" :class="{ 'pending': tool.status !== 'Live' }">
                {{ tool.status }}
              </div>
            </component>
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
                class="glass-card" 
                :class="tool.status === 'Live' ? 'active-tool' : 'locked-tool'"
              >
                <div class="card-content">
                  <h3>{{ tool.name }}</h3>
                  <p>{{ tool.description }}</p>
                </div>
                <div class="status-badge" :class="{ 'pending': tool.status !== 'Live' }">
                  {{ tool.status }}
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
              :src="(member.image && member.image !== '#') ? member.image : '/images/placeholder.png'" 
              :alt="member.name" 
              class="member-image" 
            />
            
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
}

.spinning-badge {
  width: 220px;
  height: 220px;
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

.carousel-wrapper {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 2rem; 
  
  -ms-overflow-style: none;  
  scrollbar-width: none;  
  &::-webkit-scrollbar {
    display: none;
  }
}

.carousel-card {
  flex: 0 0 300px; 
  scroll-snap-align: start;
}

.carousel-control {
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  background: rgba(11, 2, 23, 0.8);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  
  &:hover {
    background: #00e5ff;
    color: #000;
  }
  
  &.prev { left: -20px; }
  &.next { right: -20px; }
  
  @media (max-width: 768px) {
    display: none;
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
  
  &:hover.active-tool {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(0, 229, 255, 0.4);
  }
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

