<script setup>
const followLink = (url) => {
  window.open(url, '_blank')
}
</script>

<template>
  <header class="site-header">
    <div class="logo">TiTilda</div>
    <nav class="navigation">
      <a @click="followLink('https://www.linkedin.com/company/titilda')">Connect on LinkedIn</a>
      <button class="cta-btn" @click="followLink('https://www.instagram.com/ti.tilda/')">Follow Us</button>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.site-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  user-select: none;
  
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;

  @media (max-width: 768px) {
    backdrop-filter: none;
    background: rgba(15, 5, 25, 0.95);
  }

  @media (max-width: 320px) {
    justify-content: center;
    padding: 1.5rem 1rem;
  }
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 2rem;

  a {
    color: #ffffff;
    text-decoration: none;
    font-size: 0.9rem;
    cursor: pointer;

    
    &:hover { opacity: 0.8; }

    @media (max-width: 500px) {
      display: none;
    }
  }
}

.cta-btn {
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover { transform: scale(1.05); }

  @media (max-width: 320px) {
    display: none;
  }
}
</style>