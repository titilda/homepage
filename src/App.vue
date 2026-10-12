<script setup>
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import RippleBackground from './components/RippleBackground.vue'
  import SiteHeader from './components/SiteHeader.vue'
  import failsafeMessages from './data/easter-egg.json'
  import toolsData from './data/tools.json'
  import members from './data/members.json'
  import { Carousel } from '@fancyapps/ui'
  import '@fancyapps/ui/dist/carousel/carousel.css'

  let cardWidthWithGap = 332

  const isMobile = ref(false)

  const checkMobileState = () => {
    isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768
  }

  const calculateLogScale = () => {
    const baseWidth = 1920
    const currentWidth = window.innerWidth
    
    checkMobileState()

    const rawScale = Math.log(currentWidth) / Math.log(baseWidth)
    
    const clampedScale = Math.max(0.75, Math.min(rawScale, 1.1))
    
    document.documentElement.style.setProperty('--log-scale', clampedScale)

    cardWidthWithGap = 20.75 * 16 * clampedScale

    // // if (targetSpeed.value <= 1) {
    // //   targetSpeed.value = isMobile.value ? 0 : 1
    // // }
  }

  const OnDocumentLoad = () => {
    window.scrollTo(0, 0)
  }

  const scrollY = ref(0)
  const handleScroll = () => { scrollY.value = window.scrollY }

  const isModalOpen = ref(false)

  // // const trackRef = ref(null)
  // // const baseSpeed = 1
  // // const maxSpeed = 12
  // // const targetSpeed = ref(baseSpeed)
  // // const currentSpeed = ref(baseSpeed)
  // // const scrollDirection = ref(-1) //? -1 = scroll left, 1 = scroll right
  // // let trackPosition = 0  
  // // let animationId = null

  const carouselRef = ref(null)
  let carouselInstance = null
  const hotToolsData = computed(() => toolsData.filter(tool => tool.hottest === true))
  const shouldScroll = computed(() => hotToolsData.value.length > 3) //? called like this due to previous logic, might implemement an auto scolling marquee if more than 3 hottest tools are present

  const hottestTools = computed(() => {
    const hotTools = hotToolsData.value
    
    if(!shouldScroll.value) return hotTools

    const selected = hotTools.length > 5 
      ? hotTools.sort(() => 0.5 - Math.random()).slice(0, 5) 
      : hotTools
    
    return [...selected, ...selected, ...selected]
  })

  // // const accelerate = (dir) => {
  // //   scrollDirection.value = dir
  // //   targetSpeed.value = maxSpeed
  // // }
  // // const decelerate = () => {
  // //   targetSpeed.value = baseSpeed
  // // }
  // // const pauseTrack = () => {
  // //   targetSpeed.value = 0
  // // }

  // // const updateMarquee = () => {
  // //   if(!shouldScroll.value) return

  // //   currentSpeed.value += (targetSpeed.value - currentSpeed.value) * 0.05
  // //   trackPosition += currentSpeed.value * scrollDirection.value

  // //   const singleSetWidth = (hottestTools.value.length / 3) * cardWidthWithGap
    
  // //   if (trackPosition <= -singleSetWidth) {
  // //     trackPosition += singleSetWidth
  // //   } else if (trackPosition >= 0) {
  // //     trackPosition -= singleSetWidth
  // //   }

  // //   if (trackRef.value) {
  // //     trackRef.value.style.transform = `translateX(${trackPosition}px)`
  // //   }

  // //   animationId = requestAnimationFrame(updateMarquee)
  // // }

  const maskedImages = ref({})

  const generateMaskedImages = async () => {
  for (const member of members) {
    const rawUrl = (member.image && member.image !== '#') ? member.image : '/images/placeholder.png'
    
    try {
      const response = await fetch(rawUrl) //* RAWRRRRR
      const blob = await response.blob()
      
      maskedImages.value[member.name] = URL.createObjectURL(blob)
    } catch (error) {
      console.error('Failed to mask image:', error)
    }
  }
}

  const slideCarousel = (direction) => {
    if (!carouselRef.value) return
    
    if (direction === 'prev') carouselInstance.prev()
    if (direction === 'next') carouselInstance.next()
  }

  const easterEggMessage = ref(failsafeMessages[0])

  onMounted(() => {
    OnDocumentLoad()
    calculateLogScale()
    checkMobileState()
    generateMaskedImages()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', calculateLogScale)

    nextTick(() => {
      if (carouselRef.value && hottestTools.value.length > 0) {
        carouselInstance = Carousel(carouselRef.value, {
          Navigation: true,
          infinite: true,
          center: true,
          slidesPerPage: 'auto',
          transition: 'slide',
        })
        carouselInstance.init()
      }
    })

    const randomIndex = Math.floor(Math.random() * failsafeMessages.length)
    easterEggMessage.value = failsafeMessages[randomIndex]  
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', calculateLogScale)
    if (carouselInstance) carouselInstance.destroy()
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
            <h2 class="section-title flex-title">
              <img src="/logos/flame.svg" alt="Flame icon" class="title-icon flame-icon" loading="lazy" />
              Almost As Hot As You!
            </h2>
          </div>

          <div class="carousel-outer-wrapper">
            
            <button class="custom-nav-btn prev-btn" @click="slideCarousel('prev')" v-if="!isMobile">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11 5l-7 7 7 7" stroke="currentColor" fill="none" stroke-width="2"/><path d="M4 12h16" stroke="currentColor" fill="none" stroke-width="2"/></svg>
            </button>

            <div ref="carouselRef" class="f-carousel custom-carousel">
              <div 
                v-for="(tool, index) in hottestTools" 
                :key="`${tool.id}-${index}`"
                class="f-carousel__slide"
              >
                <div class="glass-card vertical-card" :class="tool.status === 'Live' ? 'active-tool' : 'locked-tool'">
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
                    Visit
                  </a>
                </div>
              </div>
            </div>

            <button class="custom-nav-btn next-btn" @click="slideCarousel('next')" v-if="!isMobile">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 12h16" stroke="currentColor" fill="none" stroke-width="2"/><path d="M13 5l7 7-7 7" stroke="currentColor" fill="none" stroke-width="2"/></svg>
            </button>

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
        <h2 class="section-title layered-title">
          <img src="/logos/heisenberg.svg" alt="Heisenberg icon" class="title-icon heisenberg-icon" loading="lazy" />
          <span style="-webkit-text-stroke: 2px black; paint-order: stroke fill;">Say Our Names</span>
        </h2>
        <div class="roster-grid">
          <div v-for="member in members" :key="member.name" class="member-card">
            <div 
                class="member-image-mask"
                :style="{ backgroundImage: maskedImages[member.name] ? `url(${maskedImages[member.name]})` : 'none' }"
                @contextmenu.prevent
              ></div>
              
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
    <div class="squish-failsafe">
      <h2>{{ easterEggMessage.title }}</h2>
      <p>{{ easterEggMessage.body }}</p>
      <span class="ant-icon">{{ easterEggMessage.emoji }}</span>
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

:root {
  --log-scale: 1; 
  overscroll-behavior: none;
}

html {
  font-size: calc(16px * var(--log-scale));
  overflow-x: hidden;
}

body {
  background-color: #000;
  color: #fff;
  overflow-x: hidden;

  &:has(.tools-modal) {
    overflow: hidden;
  }
}

a, button, img {
  -webkit-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
}

img {
  pointer-events: none;
}

.app-wrapper {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
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
  width: 13.75rem;
  height: 13.75rem;
  cursor: default;
}

.spinning-svg {
  width: 100%;
  height: 100%;
  animation: spin 25s linear infinite;

  text {
    font-size: 1.375rem;
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

  @media (max-width: 768px){
    padding: 4rem 1.25rem;
  }
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 2rem;
  }
}

.flex-title
{
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.flame-icon {
  width: 2.8rem;
  height: auto;
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7495%) hue-rotate(139deg) brightness(98%) contrast(100%);
}

.tools-section {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center; 
  padding-top: 11vh;
  user-select: none;
}

.hottest-tools-container {
  position: relative;
  width: 75vw;
  max-width: 1000px;
  margin: 0 auto;
  overflow: hidden;
}

.carousel-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  
  .section-title {
    margin-bottom: 0;
  }
}

.carousel-outer-wrapper {
  position: relative;
  max-width: 69.25rem;
  margin: 0 auto;
  padding: 0 4rem; 
}

.custom-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 50%;
  background: rgba(11, 2, 23, 0.8);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  z-index: 999; 

  &:hover {
    background: #00e5ff;
    color: #000;
  }

  &.prev-btn { left: 0; }
  &.next-btn { right: 0; }
}

.custom-carousel {
  width: 100%;
  
  --f-carousel-gap: 1rem;
  --f-carousel-slide-width: calc((100% - 1rem) / 3);

  .f-carousel__viewport {
    padding: 1.5rem 0; 
    margin: -1.5rem 0; 
    overflow: visible;     
  }

  .f-carousel__nav {
    display: none !important;
  }
}

.f-carousel__slide {
  padding: 0;
}

.vertical-card {
  width: 100%;
  height: 26.25rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; 
  position: relative;
}

@media (max-width: 768px) {
  .carousel-outer-wrapper {
    width: 100vw;
    max-width: 100vw;
    left: 50%;
    transform: translateX(-50%);
    
    padding: 0; 
  }

  .custom-carousel {
    --f-carousel-slide-width: 16.5rem; 
    --f-carousel-gap: 1rem;
  }
}

// // .carousel-control {
// //   background: rgba(11, 2, 23, 0.8);
// //   color: #fff;
// //   border: 1px solid rgba(255, 255, 255, 0.2);
// //   width: 3.125rem;
// //   height: 3.125rem;
// //   border-radius: 50%;
// //   font-size: 1.5rem;
// //   cursor: pointer;
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// //   transition: all 0.2s ease;
// //   user-select: none;
  
// //   &:hover {
// //     background: #00e5ff;
// //     color: #000;
// //   }
// // }

.vertical-card {
  
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
  margin-top: 2rem;
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
  width: 3rem;
  height: 3rem;
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

.layered-title {
  position: relative;
  display: inline-block;
  z-index: 1; 
}

.heisenberg-icon {
  position: absolute;
  width: 7rem;
  height: auto;
  left: -5rem; 
  top: -2rem; 
  z-index: -1;
  transform: rotate(15deg);
  opacity: 0.8;
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7495%) hue-rotate(139deg) brightness(98%) contrast(100%);
}

.roster-section {
  position: relative;

  user-select: none;
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
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center; 
  width: 100%;
}

.member-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.4);
  
  width: 13.75rem;
  height: calc(13.75rem * (4 / 3));
  flex-shrink: 0;
  
  &:hover .member-links-overlay {
    transform: translateY(0); 
  }
}

// .member-image {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   transition: opacity 0.3s;
// }

.member-image-mask {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  user-select: text;
  
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

.squish-failsafe {
  display: none;
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 9999;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  color: #fff;
  
  h2 {
    color: #00e5ff;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1rem;
    color: #aaa;
    line-height: 1.5;
    max-width: 250px;
  }

  .ant-icon {
    font-size: 3rem;
    margin-top: 2rem;
    animation: jitter 0.5s infinite alternate;
  }
}

@media (max-width: 300px) {
  .content-layer {
    display: none !important; 
  }
  
  .squish-failsafe {
    display: flex;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes jitter {
  0% { transform: rotate(-10deg) translateX(-5px); }
  100% { transform: rotate(10deg) translateX(5px); }
}
</style>