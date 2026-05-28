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

    function startPresentation() {
        startTime = Date.now();

        // Show first slide
        document.getElementById(`slide-1`).classList.remove('hidden');

        // Update progress bar smoothly
        progressInterval = setInterval(updateProgress, 50);

        // Change slides based on exact timing
        presentationInterval = setInterval(checkSlideProgression, 100);
    }

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
            showCredits();
            return;
        }

        const expectedSlide = Math.floor(elapsed / SLIDE_DURATION) + 1;

        if (expectedSlide > currentSlide && expectedSlide <= SLIDES_COUNT) {
            transitionToSlide(expectedSlide);
        }
    }

    function transitionToSlide(nextSlide) {
        document.getElementById(`slide-${currentSlide}`).classList.add('hidden');
        document.getElementById(`slide-${nextSlide}`).classList.remove('hidden');
        currentSlide = nextSlide;
    }

    function showCredits() {
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