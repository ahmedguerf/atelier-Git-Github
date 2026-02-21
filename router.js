// Configuration
const totalPages = 28;
let current = 0;

const container = document.getElementById("container");
const slides = [];

// Création des slides
for(let i = 1; i <= totalPages; i++){
    const div = document.createElement("div");
    div.className = "slide";

    const frame = document.createElement("iframe");
    frame.src = `slides/slide${i}.html`;

    div.appendChild(frame);
    container.appendChild(div);
    slides.push(div);
}

// Active la première slide
slides[0].classList.add("active");

// Fonction de changement de slide
function showSlide(index){
    if(index < 0 || index >= totalPages) return;

    slides[current].classList.remove("active");
    slides[current].classList.add("prev");

    slides[index].classList.remove("prev");
    slides[index].classList.add("active");

    current = index;
}

// Navigation clavier
document.addEventListener("keydown", e => {
    if(e.key === "ArrowRight"){
        showSlide(current + 1);
        e.preventDefault(); // Empêche le scroll de la page
    }
    if(e.key === "ArrowLeft"){
        showSlide(current - 1);
        e.preventDefault(); // Empêche le scroll de la page
    }
});

// SOLUTION : Zones de clic latérales uniquement
// Créer deux zones transparentes pour la navigation
const leftZone = document.createElement('div');
leftZone.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 10vw;
    height: 100vh;
    z-index: 10000;
    cursor: w-resize;
    background: transparent;
    pointer-events: auto;
`;

const rightZone = document.createElement('div');
rightZone.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 10vw;
    height: 100vh;
    z-index: 10000;
    cursor: e-resize;
    background: transparent;
    pointer-events: auto;
`;

// Indicateurs visuels au survol (optionnel)
leftZone.addEventListener('mouseenter', () => {
    leftZone.style.background = 'linear-gradient(90deg, rgba(88,166,255,0.1) 0%, rgba(0,0,0,0) 100%)';
});
leftZone.addEventListener('mouseleave', () => {
    leftZone.style.background = 'transparent';
});

rightZone.addEventListener('mouseenter', () => {
    rightZone.style.background = 'linear-gradient(270deg, rgba(88,166,255,0.1) 0%, rgba(0,0,0,0) 100%)';
});
rightZone.addEventListener('mouseleave', () => {
    rightZone.style.background = 'transparent';
});

// Gestionnaires de clic pour les zones
leftZone.addEventListener('click', (e) => {
    e.stopPropagation();
    showSlide(current - 1);
});

rightZone.addEventListener('click', (e) => {
    e.stopPropagation();
    showSlide(current + 1);
});

// Ajouter les zones au document
document.body.appendChild(leftZone);
document.body.appendChild(rightZone);

// Navigation tactile améliorée
let touchStartX = 0;
let touchStartY = 0;
let isTouchNav = false;

document.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchmove", e => {
    if (touchStartX === 0) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const diffX = Math.abs(touchX - touchStartX);
    const diffY = Math.abs(touchY - touchStartY);
    
    // Si le mouvement est plus horizontal que vertical, on empêche le scroll
    if (diffX > diffY && diffX > 20) {
        e.preventDefault();
        isTouchNav = true;
    }
}, { passive: false });

document.addEventListener("touchend", e => {
    if (touchStartX === 0) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    
    if (Math.abs(diffX) > 50 && isTouchNav) {
        if (diffX < 0) {
            showSlide(current + 1);
        } else {
            showSlide(current - 1);
        }
    }
    
    touchStartX = 0;
    isTouchNav = false;
}, { passive: true });

// Petit indicateur visuel (optionnel)
const hint = document.createElement('div');
hint.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 30px;
    color: #8b949e;
    font-size: 13px;
    font-family: monospace;
    background: rgba(22, 27, 34, 0.7);
    padding: 6px 14px;
    border-radius: 40px;
    border: 1px solid #30363d;
    backdrop-filter: blur(4px);
    z-index: 10001;
    pointer-events: none;
`;
hint.innerHTML = '← cliquer bord · flèches →';
document.body.appendChild(hint);