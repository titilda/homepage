<template>
  <header class="site-header">
    <div class="logo">TiTilda</div>
    <nav class="navigation">
      <a href="#">Connect on LinkedIn</a>
      <button class="cta-btn">Follow Us</button>
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
  
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
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
    
    &:hover { opacity: 0.8; }
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
}
</style>