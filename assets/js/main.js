
// --- Keep jQuery Breakpoints if used elsewhere ---
(function($) {
	var $window = $(window),
		$body = $('body'),
		$nav = $('#nav');

	// Breakpoints.
	breakpoints({
		xlarge: [ '1281px', '1680px' ],
		large: [ '981px', '1280px' ],
		medium: [ '737px', '980px' ],
		small: [ null, '736px' ]
	});

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

})(jQuery);


// --- VANILLA JAVASCRIPT ---

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('#nav a');
    const portfolioContent = document.getElementById('portfolio-content'); // Our scrolling container
    const intro = document.getElementById('intro');

    // Make sure the essential elements exist
    if (!nav || !portfolioContent || !intro) {
        console.error("Essential elements (nav, portfolio-content, intro) not found.");
        return;
    }

    // --- Confetti Logic ---
    // Start confetti
    // Assuming startConfetti and stopConfetti functions are defined elsewhere or in a library
    if (typeof startConfetti === 'function' && typeof stopConfetti === 'function') {
        startConfetti();
        // Stop confetti after 10 seconds
        setTimeout(function() {
            stopConfetti();
        }, 10000);
    } else {
        console.warn("Confetti functions (startConfetti, stopConfetti) not found.");
    }

    // --- Intro Logic ---
    intro.classList.add('active');

    function fadeOutIntro() {
        // Check if intro is already fading or hidden
        if (!intro.classList.contains('active')) return;

        intro.style.opacity = "0";
        intro.classList.remove('active'); // Use class to manage state

        setTimeout(() => {
            intro.style.display = "none";
            if (portfolioContent) {
                 portfolioContent.classList.remove("hidden");
            }
            // Nav visibility is handled by CSS rules based on #intro.active
        }, 1000); // Matches CSS transition time
    }

    // Automatically fade out after 5 seconds (adjust as needed)
    let autoFadeTimeout = setTimeout(fadeOutIntro, 5000);

    // Trigger fade-out immediately on user interaction
    const interactionEvents = ["click", "scroll", "wheel", "touchstart", "keydown"];
    function triggerFadeOnce() {
        clearTimeout(autoFadeTimeout); // Prevent automatic fade if triggered early
        fadeOutIntro();
        // Remove listeners after first interaction
        interactionEvents.forEach(event => {
            document.removeEventListener(event, triggerFadeOnce);
            portfolioContent.removeEventListener(event, triggerFadeOnce); // Listen on scroll container too
        });
    }
    interactionEvents.forEach(event => {
        document.addEventListener(event, triggerFadeOnce, { once: true, passive: true });
        // Add listeners to the scroll container as well, in case body events don't fire
         portfolioContent.addEventListener(event, triggerFadeOnce, { once: true, passive: true });
    });


    // --- Navigation Logic ---
    // Get all sections and the footer (if it should be a nav target)
    // Make sure your footer has an id, e.g., id="contact"
    const sections = document.querySelectorAll('#portfolio-content section, #portfolio-content footer.footer');

    // Function to update the active link and section
    function updateActiveState() {
        const navHeight = nav.offsetHeight;
        // Use the scroll position of the container, add nav height and a small buffer
        const scrollPosition = portfolioContent.scrollTop + navHeight + 30; // Adjust buffer (30px) as needed

        let currentSectionId = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (sectionId && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
                section.classList.add('active'); // For potential section-specific animations
            } else {
                section.classList.remove('active');
            }
        });

        // Update nav links
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentSectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Special case: Highlight last nav item if scrolled to the very bottom
        const scrollHeight = portfolioContent.scrollHeight;
        const clientHeight = portfolioContent.clientHeight;
        if (portfolioContent.scrollTop + clientHeight >= scrollHeight - 50) { // 50px tolerance from bottom
             const lastNavLink = navLinks[navLinks.length - 1];
             if (lastNavLink && !lastNavLink.classList.contains('active')) {
                 navLinks.forEach(l => l.classList.remove('active'));
                 lastNavLink.classList.add('active');
                 // Ensure the corresponding section also gets active class if needed
                 const lastSectionId = lastNavLink.getAttribute('href')?.substring(1);
                  if (lastSectionId) {
                    const lastSection = document.getElementById(lastSectionId);
                     if (lastSection) {
                        sections.forEach(s => s.classList.remove('active')); // Deactivate others
                        lastSection.classList.add('active');
                    }
                 }
             }
         }
    }

    // Attach scroll listener to the portfolio content container
    portfolioContent.addEventListener('scroll', updateActiveState);

    // Smooth scrolling on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href'); // e.g., "#home"

            // Only handle internal links starting with #
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault(); // Prevent default jump
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const navHeight = nav.offsetHeight;
                    // Calculate target position relative to the top of the scroll container
                    const targetPosition = targetElement.offsetTop;
                    const offset = targetPosition - navHeight; // 20px buffer below nav

                    portfolioContent.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });

                } else {
                    console.warn(`Target element not found for selector: ${targetId}`);
                }
            }
            // Allow default behavior for external links or non-hash hrefs
        });
    });

    // Initial call to set active state on page load
    updateActiveState();

    // --- Projects Carousel Logic (Keep as is) ---
    const carousel = document.querySelector('.projects-carousel');
    if (carousel) {
        const slides = document.querySelectorAll('.projects-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const prevBtn = document.querySelector('.carousel-arrow.prev');
        const nextBtn = document.querySelector('.carousel-arrow.next');
        let currentIndex = 0;

        // Check if elements exist before adding listeners
        if (slides.length > 0 && dots.length > 0 && prevBtn && nextBtn) {
            function updateCarousel() {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
            });

            // Touch/swipe support
            let touchStartX = 0;
            let touchEndX = 0;

            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 50; // Minimum pixels to count as a swipe
                if (touchEndX < touchStartX - swipeThreshold) {
                    currentIndex = (currentIndex + 1) % slides.length;
                    updateCarousel();
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                    updateCarousel();
                }
                // Reset touch points if needed, or handle tap here
            }

             // Initialize carousel position
            updateCarousel();

        } else {
            console.warn("Carousel elements missing, carousel functionality disabled.");
        }
    }

}); // End DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded triggered"); 

    const grid = document.getElementById('tech-icons-grid-js');
    if (!grid) { console.error("Grid container not found!"); return; }
    
    const icons = Array.from(grid.querySelectorAll('.tech-icon'));
    const iconCount = icons.length;

    if (iconCount !== 14) {
        console.warn(`Warning: Animation path logic assumes 14 icons, found ${iconCount}.`);
    }
    if (iconCount < 2) return; 

    let initialPositions = [];     
    let isAnimating = false;      
    // Removed timeoutId as we won't use setTimeout for the main loop anymore
    // let sequenceTimeoutId = null; 
    let hasStarted = false;       
    let resizeHandlerAttached = false;
    let currentPermutationOffset = 0; 
    let animationFrameId = null; // Use this to manage the loop via requestAnimationFrame

    // --- Configuration ---
    const stepDuration = 2000;       // ms - How long EACH simultaneous move takes
    // Delay is removed as we trigger next step immediately
    // const delayBetweenSteps = 0;  
    const initialStartDelay = 100;   // Still use a small delay before the very first start

    // --- Path Definition ---
    const pathMap = { 7: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 13, 13: 12, 12: 11, 11: 10, 10: 9, 9: 8, 8: 7 };

    // --- Helper: Calculate where an icon ends up after N steps ---
    function getPermutedIndex(originalIndex, steps, map, count) {
        let currentIndex = originalIndex;
        if (!map.hasOwnProperty(currentIndex)) return originalIndex; 
        for (let i = 0; i < steps; i++) {
            currentIndex = map[currentIndex];
            if (!map.hasOwnProperty(currentIndex)) { return -1; }
        }
        return currentIndex;
    }

    // --- Function to calculate initial positions ---
    function calculateInitialPositions() {
        console.log("Attempting to calculate initial positions..."); 
        try {
            icons.forEach(icon => { icon.style.transform = ''; }); 
            initialPositions = icons.map(icon => ({ left: icon.offsetLeft, top: icon.offsetTop }));
            console.log("Positions calculated:", initialPositions); 
            if (initialPositions.length > 0 && initialPositions.every(pos => pos.left === 0 && pos.top === 0)) {
                 console.warn("WARNING: All calculated positions are zero."); return false; 
            }
            if (initialPositions.some(pos => isNaN(pos.left) || isNaN(pos.top))) {
                 console.warn("WARNING: Some calculated positions are NaN."); return false; 
            }
            return true; 
        } catch (error) {
            console.error("Error during calculateInitialPositions:", error); return false; 
        }
    }

    // --- Function to run ONE STEP of the continuous permutation ---
    function runPermutationStep() {
        // Cancel any pending frame request before starting
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;

        if (!hasStarted || isAnimating) {
             // If called while another step is running, just exit.
             // The existing step's .then() will handle queuing the next one.
             return; 
        }

        if (initialPositions.length !== iconCount || initialPositions.every(pos => pos.left === 0 && pos.top === 0)) {
            console.error("runPermutationStep called with invalid positions. Stopping."); hasStarted = false; return;
        }
        
        isAnimating = true; // Mark step as starting
        // console.log(`Starting permutation step: ${currentPermutationOffset}`);

        try {
            const animations = icons.map((icon, i) => {
                if (!initialPositions[i]) return Promise.resolve(); 

                const startIndex = getPermutedIndex(i, currentPermutationOffset, pathMap, iconCount);
                const endIndex = getPermutedIndex(i, currentPermutationOffset + 1, pathMap, iconCount);

                if (startIndex === -1 || endIndex === -1 || startIndex === endIndex || !initialPositions[startIndex] || !initialPositions[endIndex]) {
                    return Promise.resolve(); 
                }

                const startPos = initialPositions[startIndex];
                const endPos = initialPositions[endIndex];

                const startTransformX = startPos.left - initialPositions[i].left;
                const startTransformY = startPos.top - initialPositions[i].top;
                const endTransformX = endPos.left - initialPositions[i].left;
                const endTransformY = endPos.top - initialPositions[i].top;

                if (isNaN(startTransformX) || isNaN(startTransformY) || isNaN(endTransformX) || isNaN(endTransformY)) {
                     return Promise.resolve();
                }
                 if (Math.abs(startTransformX - endTransformX) < 1 && Math.abs(startTransformY - endTransformY) < 1) {
                     return Promise.resolve();
                 }
                
                return icon.animate([
                    { transform: `translate(${startTransformX}px, ${startTransformY}px)` },
                    { transform: `translate(${endTransformX}px, ${endTransformY}px)` }
                ], {
                    duration: stepDuration,
                    easing: 'ease-in-out', // Or 'linear' if you prefer constant speed
                    fill: 'none' 
                });
            });

            const validAnimationPromises = animations.map(anim => anim && anim.finished).filter(Boolean);

            Promise.all(validAnimationPromises)
                .then(() => {
                    // --- Step Finished ---
                    currentPermutationOffset = (currentPermutationOffset + 1) % iconCount; 
                    isAnimating = false; // Mark step as finished *before* queuing next
                    
                    if (!hasStarted) return; // Stop if reset occurred during animation

                    // --- Trigger next step immediately using requestAnimationFrame ---
                    // This ties the start of the next step calculation more closely 
                    // to the browser's rendering cycle, aiming for smoother transition.
                    animationFrameId = requestAnimationFrame(runPermutationStep); 
                    // console.log(`Step finished. Queued next step via rAF. Offset: ${currentPermutationOffset}`); 


                })
                .catch(error => {
                    isAnimating = false; // Ensure flag is reset on error too
                    if (!hasStarted) return; 

                    if (error.name !== 'AbortError') {
                         console.error("Animation promise error within step:", error);
                         // Schedule a retry after a delay on unexpected errors
                         if (animationFrameId) cancelAnimationFrame(animationFrameId);
                         animationFrameId = requestAnimationFrame(() => {
                             setTimeout(runPermutationStep, 500); // Delay before retry
                         });
                    } else {
                         // console.log("Animation step aborted (likely due to resize).");
                    }
                });
        } catch (error) {
            console.error("Error starting permutation step:", error);
            isAnimating = false;
        }
    }

    // --- Debounce function ---
    function debounce(func, wait) { /* ... Keep debounce function ... */ 
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- Resize handler ---
    const handleResize = debounce(() => {
        // Don't run if setup never completed via observer
        // Also check if already handling a resize (though debounce helps)
        if (!hasStarted) return; 
        console.log("Window resized event triggered. Recalculating & Resetting Sequence.");
        
        // --- Stop the animation loop completely ---
        hasStarted = false; // Prevent new steps from starting
        if (animationFrameId) {
             cancelAnimationFrame(animationFrameId); // Cancel pending frame request
             animationFrameId = null;
        }
        isAnimating = false; // Ensure flag is false
        currentPermutationOffset = 0; // Reset path progression
        // -----------------------------------------
        
        try {
            if (grid && icons && icons.length > 0) {
                // Cancel any current WAAPI animations and reset transforms
                icons.forEach(icon => { try { icon.getAnimations().forEach(anim => anim.cancel()); } catch (e) { } });
                icons.forEach(icon => icon.style.transform = ''); 
            }
        } catch (error) {
            console.error("Error cancelling/resetting transforms on resize:", error);
        }

        // Recalculate positions
        if (calculateInitialPositions()) {
            // Restart the sequence after a short delay
            // Set hasStarted back to true *before* scheduling
            hasStarted = true; 
            console.log("Restarting sequence after resize.");
            if (animationFrameId) cancelAnimationFrame(animationFrameId); // Clear just in case
            // Use setTimeout for the *restart* delay after resize
            setTimeout(() => {
                 if (hasStarted) { // Check again in case another resize happened quickly
                     animationFrameId = requestAnimationFrame(runPermutationStep);
                 }
            }, 200); 
        } else {
            console.error("Failed to calculate positions after resize. Animation stopped.");
            hasStarted = false; 
        }

    }, 250);

    // --- Initial Setup using ResizeObserver ---
    try {
        console.log("Setting up ResizeObserver...");
        const observer = new ResizeObserver(entries => {
            if (!hasStarted) {
                const entry = entries[0];
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    console.log(`ResizeObserver detected non-zero dimensions. Running setup.`);
                    observer.unobserve(grid);
                    // Set flag immediately *before* potentially async operations
                    hasStarted = true; 

                    if (calculateInitialPositions()) {
                        console.log("Initial calculatePositions successful.");
                        if (!resizeHandlerAttached) {
                            window.addEventListener('resize', handleResize);
                            resizeHandlerAttached = true;
                            console.log("Resize listener added.");
                        }
                        if (animationFrameId) cancelAnimationFrame(animationFrameId); // Clear just in case
                        console.log(`Initial runPermutationStep scheduling...`);
                        // Use setTimeout only for the very first delay
                        setTimeout(() => {
                             if (hasStarted) { // Check flag hasn't been reset by immediate resize
                                 animationFrameId = requestAnimationFrame(runPermutationStep);
                             }
                        }, initialStartDelay); 
                    } else {
                        console.error("Failed calculation after ResizeObserver trigger.");
                        hasStarted = false; // Reset flag if setup failed
                    }
                }
            }
        });
        observer.observe(grid);
    } catch (error) {
        console.error("Error setting up ResizeObserver:", error);
    }

    console.log("DOMContentLoaded finished. ResizeObserver waiting...");

}); // End of DOMContentLoaded listener

// Project animation
document.addEventListener('DOMContentLoaded', () => {
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');

    if (!video1 || !video2) {
        console.error("Could not find one or both video elements!");
        return;
    }

    // --- Synchronization Functions ---

    const syncPlay = (sourceVideo, targetVideo) => {
        if (sourceVideo.paused) {
            targetVideo.pause();
        } else {
            targetVideo.play().catch(error => console.error("Playback error:", error)); // Play might be interrupted
        }
    };

    const syncPause = (sourceVideo, targetVideo) => {
        targetVideo.pause();
    };

    const syncSeek = (sourceVideo, targetVideo) => {
        // Only sync if the time difference is significant enough
        // to avoid minor fluctuations causing loops/jitter
        if (Math.abs(sourceVideo.currentTime - targetVideo.currentTime) > 0.2) {
           targetVideo.currentTime = sourceVideo.currentTime;
        }
    };

    // --- Event Listeners ---

    // Sync Video 2 -> Video 1
    video2.addEventListener('play', () => syncPlay(video2, video1));
    video2.addEventListener('pause', () => syncPause(video2, video1));
    video2.addEventListener('seeked', () => syncSeek(video2, video1)); // 'seeked' fires after seeking is complete

    // Sync Video 1 -> Video 2
    video1.addEventListener('play', () => syncPlay(video1, video2));
    video1.addEventListener('pause', () => syncPause(video1, video2));
    video1.addEventListener('seeked', () => syncSeek(video1, video2));

    // Optional: Sync Volume and Mute
    const syncVolume = (sourceVideo, targetVideo) => {
        targetVideo.volume = sourceVideo.volume;
        targetVideo.muted = sourceVideo.muted;
    }

    video1.addEventListener('volumechange', () => syncVolume(video1, video2));
    video2.addEventListener('volumechange', () => syncVolume(video2, video1));

});