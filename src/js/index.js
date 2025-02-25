import Drifter from './drifter';

import CaseStudyListItemAnimation from './animation.caseStudyListItem';

Splitting();
const fetchSpotify = () =>
  fetch('/.netlify/functions/spotify')
    .then(res => res.json())
    .then(data => {
      const track = document.querySelector('.spotify-widget__track');
      const artists = document.querySelector('.spotify-widget__artists');

      track.setAttribute('href', data.url);
      track.textContent = data.name;
      const artistTemplate = artist =>
        `<a href="${artist.href}">${artist.name}</a>`;
      artists.innerHTML = `${data.artists
        .map(artist => artistTemplate(artist))
        .join(', ')}`;
    })
    .catch();
const DOM = {
  themeToggle: document.querySelector('.theme-toggle'),
  caseStudies: {
    get chars() {
      return [...document.querySelectorAll('.case-study-list-item__title')];
    }
  }
};

const revealHandler = (entries, observer) => {
  entries.forEach(entry => {
    let anim = false;
    if (
      entry.target.classList.contains('case-study-list-item') &&
      entry.target.hasAttribute('reveal')
    ) {
      anim = CaseStudyListItemAnimation(entry.target);
      anim.pause();
      anim.eventCallback('onComplete', anim.kill);
    }
    if (entry.isIntersecting && entry.target.hasAttribute('reveal')) {
      anim && anim.play();
      entry.target.removeAttribute('reveal');
    }
  });
};

const revealObserver = new IntersectionObserver(revealHandler, {
  rootMargin: `0px 0px -200px 0px`
});
[...document.querySelectorAll('[reveal]')].forEach(el =>
  revealObserver.observe(el)
);

const handleInitialLoad = e => {
  // Drifter setup
  const items = [...document.querySelectorAll('[drifter]')].map(
    item => new Drifter(item)
  );
  const animate = () => {
    for (const item of items) {
      if (item.isVisible) {
        item.render();
      }
    }
    requestAnimationFrame(() => animate());
  };

  animate();
  // fetchSpotify();
};
const setDOMThemeFromStorage = () => {
  localStorage.setItem(
    'darkMode',
    document.documentElement.hasAttribute('dark')
  );
};
const toggleDarkMode = () => {
  document.documentElement.toggleAttribute('dark');
  setDOMThemeFromStorage();
};
const toggleGridOverlay = () => {
  const gridOverlay = document.querySelector('.grid-overlay');
  gridOverlay.classList.toggle('grid-overlay--active');
};
const updateMousePosition = ({ clientX, clientY }) => {
  document.documentElement.style.setProperty('--mouseX', `${clientX}px`);
  document.documentElement.style.setProperty('--mouseY', `${clientY}px`);
};
document.addEventListener('keypress', ({ key }) => {
  if (key && key == 'd') toggleDarkMode();
  if (key && key == 'g') toggleGridOverlay();
});
document.addEventListener('mousemove', e => {
  updateMousePosition(e);
});
DOM.themeToggle.addEventListener('click', e => {
  document.documentElement.toggleAttribute('dark');
  setDOMThemeFromStorage();
});
document.addEventListener('DOMContentLoaded', e => {
  handleInitialLoad(e);
});
