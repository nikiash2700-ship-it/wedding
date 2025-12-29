<template>
  <section class="hero-section" id="home">
    <img :src="heroImage" alt="Wedding Hero Image" class="hero-image">
    <div v-if="showInitials" class="hero-initials" :class="{ 'visible': showInitials }">
      <img :src="initialsImageSrc" alt="Initials" class="hero-initials-image" />
    </div>
    <div v-if="showInitials" class="hero-date-wrapper" :class="{ 'visible': showInitials }">
      <span class="hero-date">10 | 09 | 2026</span>
    </div>
    <div class="hero-overlay-content">
      <div class="hero-taglines">
        <span class="hero-tagline-left">WEDDING DAY</span>
      </div>
    </div>
    <div class="scroll-indicator">
      <span class="scroll-arrow">↓</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const heroImage = 'https://i8.imageban.ru/out/2025/12/22/fe76c72faee06f7f8c697e11f2738fd1.jpg'
const showInitials = ref(false)
const initialsImageSrc = computed(() => import.meta.env.BASE_URL + 'initials.png')

// Предзагрузка главного изображения
const preloadHeroImage = () => {
  const img = new Image()
  img.src = heroImage
}

// Предзагружаем изображение сразу при импорте модуля
preloadHeroImage()

// Слушаем событие от прелоадера
onMounted(() => {
  const handleImageAnimation = () => {
    // Показываем изображение сразу после завершения анимации перемещения
    showInitials.value = true
  }
  
  window.addEventListener('initials-animated', handleImageAnimation)
  
  // Также проверяем, если прелоадер уже закрыт (fallback)
  setTimeout(() => {
    if (!document.querySelector('.initials-preloader') && !showInitials.value) {
      showInitials.value = true
    }
  }, 2500)
})
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.hero-initials {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%) translateY(0) scale(0.6);
  transform-origin: center top;
  z-index: 3;
  opacity: 0;
  transition: opacity 0.8s ease 0.2s, transform 0.3s ease;
  pointer-events: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.hero-initials.visible {
  opacity: 1;
}

.hero-initials-image {
  width: 450px;
  height: 450px;
  max-width: 90vw;
  max-height: 40vh;
  object-fit: contain;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
  display: block;
  margin: 0;
  padding: 0;
}

.hero-date-wrapper {
  position: absolute;
  top: 240px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  opacity: 0;
  transition: opacity 0.8s ease 0.2s;
  pointer-events: none;
  text-align: center;
}

.hero-date-wrapper.visible {
  opacity: 1;
}

.hero-date {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.4rem, 5.5vw, 1.8rem);
  font-weight: 400;
  letter-spacing: clamp(2px, 0.8vw, 2.5px);
  color: #2c2c2c;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.3);
  white-space: nowrap;
}


/* Планшеты и большие телефоны (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 769px) {
  .hero-initials-image {
    width: clamp(380px, 50vw, 480px);
    height: clamp(380px, 50vw, 480px);
  }
  
  .hero-initials {
    top: -20px;
    transform: translateX(-50%) translateY(0) scale(0.7);
  }
  
  .hero-date-wrapper {
    top: clamp(320px, 35vh, 380px);
  }
}

/* Средние телефоны (481px - 768px) */
@media (max-width: 768px) {
  .hero-initials-image {
    width: clamp(340px, 65vw, 420px);
    height: clamp(340px, 65vw, 420px);
  }
  
  .hero-initials {
    top: -15px;
    transform: translateX(-50%) translateY(0) scale(0.75);
  }
  
  .hero-date-wrapper {
    top: clamp(280px, 32vh, 340px);
  }
  
  .hero-date {
    font-size: clamp(1.3rem, 5vw, 1.6rem);
    letter-spacing: clamp(1.5px, 0.7vw, 2px);
  }
}

/* Маленькие телефоны (360px - 480px) */
@media (max-width: 480px) {
  .hero-initials-image {
    width: clamp(300px, 70vw, 380px);
    height: clamp(300px, 70vw, 380px);
  }
  
  .hero-initials {
    top: -10px;
    transform: translateX(-50%) translateY(0) scale(0.7);
  }
  
  .hero-date-wrapper {
    top: clamp(240px, 28vh, 300px);
  }
  
  .hero-date {
    font-size: clamp(1.2rem, 5.2vw, 1.5rem);
    letter-spacing: clamp(1.2px, 0.6vw, 1.8px);
  }
}

/* Очень маленькие телефоны (до 360px) */
@media (max-width: 360px) {
  .hero-initials-image {
    width: clamp(260px, 75vw, 340px);
    height: clamp(260px, 75vw, 340px);
  }
  
  .hero-initials {
    top: -5px;
    transform: translateX(-50%) translateY(0) scale(0.65);
  }
  
  .hero-date-wrapper {
    top: clamp(200px, 24vh, 260px);
  }
  
  .hero-date {
    font-size: clamp(1.1rem, 4.8vw, 1.4rem);
    letter-spacing: clamp(1px, 0.5vw, 1.5px);
  }
}

/* Ландшафтная ориентация на телефонах */
@media (max-width: 768px) and (orientation: landscape) {
  .hero-initials-image {
    width: clamp(220px, 35vh, 300px);
    height: clamp(220px, 35vh, 300px);
  }
  
  .hero-initials {
    top: -5px;
    transform: translateX(-50%) translateY(0) scale(0.6);
  }
  
  .hero-date-wrapper {
    top: clamp(120px, 14vh, 180px);
  }
  
  .hero-date {
    font-size: clamp(1.1rem, 3.5vh, 1.3rem);
  }
}

.hero-overlay-content {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  text-align: center;
  color: #fff;
}

.hero-taglines {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  letter-spacing: 3px;
}


.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  color: #fff;
  font-size: 2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

@media (max-width: 768px) {
  .hero-taglines {
    flex-direction: column;
    gap: 10px;
    font-size: 1rem;
  }
  
}
</style>
