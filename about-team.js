const cardsContainer = document.querySelector(".card-carousel");
const cardsController = document.querySelector(".card-carousel + .card-controller");
// Карусель карточек
class InfiniteCarousel {
    constructor(container) {
        this.container = container;
        this.cards = Array.from(container.querySelectorAll(".card"));
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        // Находим стрелки 
        const leftArrow = document.querySelector('.carousel-arrow-left');
        const rightArrow = document.querySelector('.carousel-arrow-right');
        
        // Добавляем обработчики
        if (leftArrow) {
            leftArrow.addEventListener('click', () => this.prev());
        }
        if (rightArrow) {
            rightArrow.addEventListener('click', () => this.next());
        }
        
        // Инициализируем позиции
        this.updateCards();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.updateCards();
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateCards();
    }
    
    updateCards() {
        this.cards.forEach((card, index) => {
            // Вычисляем смещение относительно текущей карточки
            let offset = index - this.currentIndex;
            
            // Делаем карусель бесконечной
            if (offset < -this.cards.length / 2) {
                offset += this.cards.length;
            } else if (offset > this.cards.length / 2) {
                offset -= this.cards.length;
            }
            
            // Вычисляем масштаб и позицию
            const scale = 1 - Math.abs(offset) * 0.2;
            const translateX = offset * 260; // расстояние между карточками
            const translateZ = -Math.abs(offset) * 0; // глубина для 3D эффекта
            const opacity = 1 - Math.abs(offset) * 0.3;
            const zIndex = this.cards.length - Math.abs(offset);
            
            // Применяем стили
            card.style.transform = `translateX(${translateX}px) scale(${scale}) translateZ(${translateZ}px)`;
            card.style.opacity = opacity*100;
            card.style.zIndex = zIndex;
            card.style.transition = 'all 0.6s ease';
            
            // Выделяем текущую карточку
            if (offset === 0) {
                card.classList.add('highlight');
            } else {
                card.classList.remove('highlight');
            }
        });
    }
}

// Вращающийся текст
const arrSin = [];
const arrCos = [];
for (let i = 0; i < 360; i++) {
    const radians = i * Math.PI / 180;
    arrSin[i] = Math.sin(radians);
    arrCos[i] = Math.cos(radians);
}

function rotateText(element, radius, deg, rinc, centerX, centerY) {
    if (!element) return;
    
    const x = radius * arrCos[deg];
    const y = radius * arrSin[deg];
    
    element.style.transform = `translate(${x}px, ${y}px)`;
    
    let newRadius = radius;
    let newRinc = rinc;
    let newDeg = (deg + 3) % 360;
    
    if (deg % 30 === 0) newRadius += rinc;
    if (newRadius > 150 || newRadius < 140) {
        newRinc *= -1;
        newRadius += newRinc;
    }
    
    setTimeout(() => rotateText(element, newRadius, newDeg, newRinc, centerX, centerY), 80);
}

function startTextAnimation() {
    const spinContainers = document.querySelectorAll('.demo_spin');
    
    spinContainers.forEach(container => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 4;
        const centerY = rect.height / 2;
        
        const rotatingElements = container.querySelectorAll('.rotating-text');
        
        rotatingElements.forEach((element, index) => {
            const startDeg = index * (360 / rotatingElements.length);
            const radius = 140 - (index * 5);
            
            element.style.position = 'absolute';
            element.style.left = centerX + 'px';
            element.style.top = centerY + 'px';
            element.style.transformOrigin = 'center';
            element.style.willChange = 'transform';
            
            rotateText(element, radius, startDeg, 0.5, centerX, centerY);
        });
    });
}

// Скролл для текста
function initTextScroll() {
    const containers = document.querySelectorAll('.TEAMainer');
    
    containers.forEach(container => {
        const content = container.querySelector('.scrollable-text');
        const handle = container.querySelector('.text-scroll-handle');
        
        if (!content || !handle) {
            console.log('Элементы скролла не найдены');
            return;
        }
        
        let isDragging = false;
        let startY, startScroll;
        
        function updateHandle() {
            // Проверяем нужен ли скролл
            if (content.scrollHeight > content.offsetHeight) {
                handle.style.display = 'block';
                
                const scrollPercent = content.scrollTop / (content.scrollHeight - content.offsetHeight);
                const handleHeight = Math.max(40, (content.offsetHeight / content.scrollHeight) * content.offsetHeight);
                const maxTop = content.offsetHeight - handleHeight;
                
                handle.style.height = handleHeight + 'px';
                handle.style.top = (scrollPercent * maxTop) + 'px';
            } else {
                handle.style.display = 'none';
            }
        }
        
        // События бегунка
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startScroll = content.scrollTop;
            handle.style.cursor = 'grabbing';
        });
        
        // События контента
        content.addEventListener('scroll', updateHandle);
        
        // Глобальные события
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaY = e.clientY - startY;
            content.scrollTop = startScroll + (deltaY * 2);
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            handle.style.cursor = 'grab';
        });
        
        // Инициализация
        updateHandle();
        window.addEventListener('resize', updateHandle);
        
        // Проверяем сразу после загрузки
        setTimeout(updateHandle, 100);
    });
}

// Инициализация всего при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Карусель
    const carouselContainer = document.querySelector('.card-carousel');
    if (carouselContainer) {
        const carousel = new InfiniteCarousel(carouselContainer);
        console.log('Карусель инициализирована');
    }
    
    // Анимация текста
    setTimeout(startTextAnimation, 500);
    
    // Скролл текста
    setTimeout(initTextScroll, 1000);
});

// Аудио плеер
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('myAudio');
    const audioBtn = document.getElementById('MyBtn');
    
    if (audio && audioBtn) {
        let isPlaying = false;
        
        audioBtn.addEventListener('click', function() {
            if (isPlaying) {
                audio.pause();
                audioBtn.textContent = '▶';
            } else {
                audio.play();
                audioBtn.textContent = '⏸';
            }
            isPlaying = !isPlaying;
        });
    }
});