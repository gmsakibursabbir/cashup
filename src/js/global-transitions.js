// Enhanced Global Transitions with Gradient Stripes
// Beautiful animated transition effect

(function () {
  "use strict";

  let isTransitioning = false;
  const transitionDuration = 300;

  // Create gradient stripe overlay
  function createGradientOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "gradient-transition-overlay";
    overlay.innerHTML = `
      <div class="stripe stripe-1"></div>
      <div class="stripe stripe-2"></div>
      <div class="stripe stripe-3"></div>
    `;

    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      pointer-events: none;
      overflow: hidden;
    `;

    // Stripe styles
    const stripeCSS = `
      .stripe {
        position: absolute;
        width: 100vw;
        height: 33.33vh;
        transition: transform ${transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .stripe-1 {
        top: 0;
        background: linear-gradient(135deg, #ffd93d 0%, #eab308 100%);
        transform: translateX(-100%);
      }
      
      .stripe-2 {
        top: 33.33vh;
        background: linear-gradient(135deg, #7ed321 0%, #22c55e 100%);
        transform: translateX(100%);
      }
      
      .stripe-3 {
        top: 66.66vh;
        background: linear-gradient(135deg, #4fc3f7 0%, #2563eb 100%);
        transform: translateX(-100%);
      }
      
      .stripe.animate-in {
        transform: translateX(0);
      }
      
      .stripe.animate-out {
        transform: translateX(100%);
      }
      
      .stripe-2.animate-out {
        transform: translateX(-100%);
      }
    `;

    // Inject stripe styles
    if (!document.getElementById("stripe-transition-styles")) {
      const style = document.createElement("style");
      style.id = "stripe-transition-styles";
      style.textContent = stripeCSS;
      document.head.appendChild(style);
    }

    document.body.appendChild(overlay);
    return overlay;
  }

  // Animate stripes in
  function animateStripesIn(overlay) {
    const stripes = overlay.querySelectorAll(".stripe");

    // Stagger the animation
    setTimeout(() => stripes[0].classList.add("animate-in"), 0);
    setTimeout(() => stripes[1].classList.add("animate-in"), 100);
    setTimeout(() => stripes[2].classList.add("animate-in"), 200);
  }

  // Animate stripes out (for the destination page)
  function animateStripesOut(overlay, callback) {
    const stripes = overlay.querySelectorAll(".stripe");

    // Remove animate-in and add animate-out
    setTimeout(() => {
      stripes[0].classList.remove("animate-in");
      stripes[0].classList.add("animate-out");
    }, 0);

    setTimeout(() => {
      stripes[1].classList.remove("animate-in");
      stripes[1].classList.add("animate-out");
    }, 100);

    setTimeout(() => {
      stripes[2].classList.remove("animate-in");
      stripes[2].classList.add("animate-out");
    }, 200);

    // Clean up after animation
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, transitionDuration);
  }

  // Handle link clicks
  function handleLinkClick(event) {
    const link = event.target.closest("a");
    const returnBtn = event.target.closest(".return-btn");

    const element = link || returnBtn;
    if (!element) return;

    let href;

    if (returnBtn) {
      href =
        returnBtn.getAttribute("href") || returnBtn.getAttribute("data-href");
      if (!href) {
        event.preventDefault();
        if (isTransitioning) return;
        isTransitioning = true;

        sessionStorage.setItem("navigating", "true");

        const overlay = createGradientOverlay();
        animateStripesIn(overlay);

        setTimeout(() => {
          window.history.back();
        }, 400);
        return;
      }
    } else {
      href = link.getAttribute("href");
    }

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    if (
      link &&
      link.hostname !== window.location.hostname &&
      link.hostname !== ""
    ) {
      return;
    }

    if (
      element.target === "_blank" ||
      element.hasAttribute("download") ||
      event.metaKey ||
      event.ctrlKey
    ) {
      return;
    }

    event.preventDefault();
    if (isTransitioning) return;
    isTransitioning = true;

    // Set flags for index page
    sessionStorage.setItem("navigating", "true");
    const targetIsIndex =
      href === "/" ||
      href === "/index.html" ||
      href.endsWith("/index.html") ||
      href === "index.html";
    if (targetIsIndex || returnBtn) {
      sessionStorage.setItem("returning-to-index", "true");
    }

    // Create overlay and start animation
    const overlay = createGradientOverlay();
    animateStripesIn(overlay);

    // Navigate after stripes cover the screen
    setTimeout(() => {
      window.location.href = href;
    }, 400);
  }

  // Handle page entrance - show stripe exit animation
  function handlePageEntrance() {
    const fromTransition = sessionStorage.getItem("navigating") === "true";

    if (fromTransition) {
      // Create overlay for exit animation
      const overlay = createGradientOverlay();
      const stripes = overlay.querySelectorAll(".stripe");

      // Start with stripes covering the screen
      stripes.forEach((stripe) => stripe.classList.add("animate-in"));

      // Animate out after a brief delay
      setTimeout(() => {
        animateStripesOut(overlay);
      }, 100);
    }

    sessionStorage.removeItem("navigating");
  }

  // Initialize
  function init() {
    // Check if we're on index and coming from navigation
    const path = window.location.pathname;
    const isIndex =
      path === "/" || path === "/index.html" || path.endsWith("/index.html");

    if (isIndex && sessionStorage.getItem("navigating") === "true") {
      sessionStorage.setItem("skipPreloader", "true");
    }

    // Set up event listeners
    document.addEventListener("click", handleLinkClick);

    // Handle page entrance
    handlePageEntrance();

    // Clean up any existing overlays
    const existingOverlay = document.getElementById(
      "gradient-transition-overlay"
    );
    if (existingOverlay) {
      existingOverlay.remove();
    }
  }

  // Start initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
