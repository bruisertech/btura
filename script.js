document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const overlay = document.getElementById('overlay');
    const audio = document.getElementById('bg-audio');
    const progressBar = document.getElementById('progress-bar');

    const TOTAL_DURATION = 120; // 120 seconds
    const SLIDES_COUNT = 6;
    const SLIDE_DURATION = TOTAL_DURATION / SLIDES_COUNT; // 20 seconds per slide

    let currentSlide = 1;
    let startTime;
    let presentationInterval;
    let progressInterval;
    let imageToggleInterval;

    startBtn.addEventListener('click', () => {
        // Hide overlay
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);

        // Try to play audio
        audio.play().catch(e => {
            console.log('Audio no encontrado o autoplay bloqueado, omitiendo...', e);
        });

        // Start presentation
        startPresentation();
    });

    let isPresentationActive = false;

    function startPresentation() {
        startTime = Date.now();
        isPresentationActive = true;

        // Show first slide
        document.getElementById(`slide-1`).classList.remove('hidden');

        // Update progress bar smoothly
        progressInterval = setInterval(updateProgress, 50);

        // Change slides based on exact timing
        presentationInterval = setInterval(checkSlideProgression, 100);

        // Toggle images every 3 seconds
        imageToggleInterval = setInterval(toggleSlideImages, 3000);
    }

    function toggleSlideImages() {
        const currentSlideEl = document.getElementById(`slide-${currentSlide}`);
        if (!currentSlideEl) return;

        const images = currentSlideEl.querySelectorAll('.massive-img');
        if (images.length < 2) return;

        // Find currently active image
        let activeIndex = -1;
        images.forEach((img, index) => {
            if (img.classList.contains('active-img')) {
                activeIndex = index;
            }
        });

        // If none is active for some reason, default to 0
        if (activeIndex === -1) activeIndex = 0;

        // Toggle active class to the next image
        images[activeIndex].classList.remove('active-img');
        const nextIndex = (activeIndex + 1) % images.length;
        images[nextIndex].classList.add('active-img');
    }

    document.addEventListener('keydown', (e) => {
        if (!isPresentationActive) return;

        if (e.key === 'ArrowRight' && currentSlide < SLIDES_COUNT) {
            transitionToSlide(currentSlide + 1);
            // Adjust start time to keep progress bar and auto-progression in sync
            startTime = Date.now() - ((currentSlide - 1) * SLIDE_DURATION * 1000);
        } else if (e.key === 'ArrowLeft' && currentSlide > 1) {
            transitionToSlide(currentSlide - 1);
            // Adjust start time to keep progress bar and auto-progression in sync
            startTime = Date.now() - ((currentSlide - 1) * SLIDE_DURATION * 1000);
        }
    });

    function updateProgress() {
        const elapsed = (Date.now() - startTime) / 1000; // in seconds
        let percentage = (elapsed / TOTAL_DURATION) * 100;

        if (percentage >= 100) {
            percentage = 100;
            clearInterval(progressInterval);
        }

        progressBar.style.width = `${percentage}%`;
    }

    function checkSlideProgression() {
        const elapsed = (Date.now() - startTime) / 1000;

        if (elapsed >= TOTAL_DURATION) {
            // End of presentation, show credits
            clearInterval(presentationInterval);
            isPresentationActive = false;
            showCredits();
            return;
        }

        const expectedSlide = Math.floor(elapsed / SLIDE_DURATION) + 1;

        if (expectedSlide !== currentSlide && expectedSlide <= SLIDES_COUNT) {
            transitionToSlide(expectedSlide);
        }
    }

    function transitionToSlide(nextSlide) {
        document.getElementById(`slide-${currentSlide}`).classList.add('hidden');
        document.getElementById(`slide-${nextSlide}`).classList.remove('hidden');
        currentSlide = nextSlide;
    }

    function showCredits() {
        // Stop image toggling
        clearInterval(imageToggleInterval);

        // Hide all current slides
        for (let i = 1; i <= SLIDES_COUNT; i++) {
            const slide = document.getElementById(`slide-${i}`);
            if (slide && !slide.classList.contains('hidden')) {
                slide.classList.add('hidden');
            }
        }

        // Ensure progress bar is full
        progressBar.style.width = '100%';

        // Show Slide 7 (Credits)
        const creditsSlide = document.getElementById('slide-7');
        creditsSlide.classList.remove('hidden');
    }
});