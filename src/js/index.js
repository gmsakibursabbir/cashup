gsap.registerPlugin(ScrollTrigger);

// General reveal function
function createRevealAnimation(className, x = 0, y = 0) {
  gsap.utils.toArray(className).forEach((el) => {
    gsap.from(el, {
      x: x,
      y: y,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%", // when element enters viewport
        toggleActions: "play none none reverse",
      },
    });
  });
}

// Call for each direction
createRevealAnimation(".reveal-left", -100, 0);
createRevealAnimation(".reveal-right", 100, 0);
createRevealAnimation(".reveal-up", 0, 100);
createRevealAnimation(".reveal-down", 0, -100);

// page animation
const page = document.querySelector(".page-transition");

// --- Page Enter Animation (on load) ---
window.addEventListener("load", () => {
  gsap.set(page, { opacity: 0, y: 30 }); // start state
  gsap.to(page, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
  });
});

// --- Page Exit Animation (before navigation) ---
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    if (href && !href.startsWith("#") && !href.startsWith("javascript")) {
      e.preventDefault();

      const tl = gsap.timeline({
        defaults: { duration: 0.6, ease: "power2.inOut" },
        onComplete: () => (window.location.href = href),
      });

      tl.to(page, { opacity: 0, y: -30 }); // fade & slide up
    }
  });
});
