(() => {
  let boundArc;
  let activeArtworkObserver;
  let activeRevealObserver;

  const reveal = () => {
    const arc = document.querySelector('.five-history-arc');
    if (arc === boundArc) return;
    activeArtworkObserver?.disconnect();
    activeRevealObserver?.disconnect();
    activeArtworkObserver = activeRevealObserver = undefined;
    if (boundArc) delete boundArc.dataset.revealBound;
    boundArc = arc;
    if (!arc || arc.dataset.revealBound === 'true') return;
    arc.dataset.revealBound = 'true';

    const loadArtwork = () => {
      if (boundArc !== arc || !arc.isConnected || arc.dataset.artworkLoaded === 'true') return;
      arc.dataset.artworkLoaded = 'true';
      arc.querySelectorAll('img[data-rocket-src]').forEach((image) => {
        image.src = image.dataset.rocketSrc;
      });
    };

    if (!('IntersectionObserver' in window)) {
      loadArtwork();
      arc.classList.add('is-visible');
      return;
    }

    // Keep the complete lineage, but request its artwork only near the footer.
    if (arc.querySelector('img[data-rocket-src]')) {
      const artworkObserver = new IntersectionObserver((entries) => {
        if (boundArc !== arc || !arc.isConnected || !entries.some((entry) => entry.isIntersecting)) return;
        loadArtwork();
        artworkObserver.disconnect();
      }, { rootMargin: '240px 0px' });
      activeArtworkObserver = artworkObserver;
      artworkObserver.observe(arc);
    }

    const observer = new IntersectionObserver((entries) => {
      if (boundArc !== arc || !arc.isConnected) return;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
        observer.disconnect();
      });
    }, { threshold: 0.28 });

    activeRevealObserver = observer;
    observer.observe(arc);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reveal, { once: true });
  } else {
    reveal();
  }

  window.addEventListener('load', reveal, { once: true });
  // The homepage mounts a separate footer component at the phone breakpoint.
  window.matchMedia('(max-width: 760px)').addEventListener('change', () => requestAnimationFrame(reveal));
})();
