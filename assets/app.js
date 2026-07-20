(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setThemeMeta = (theme) => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0c0f' : '#f1eee7');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    }
  };

  const burst = () => {
    if (!toggle || reducedMotion.matches) return;
    const rect = toggle.getBoundingClientRect();
    for (let i = 0; i < 8; i += 1) {
      const particle = document.createElement('span');
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 24 + (i % 2) * 7;
      particle.className = 'theme-particle';
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
      document.body.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
    }
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    localStorage.setItem('benevolent-theme', theme);
    setThemeMeta(theme);
  };

  if (toggle) {
    setThemeMeta(root.dataset.theme || 'dark');
    toggle.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      const rect = toggle.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.style.setProperty('--toggle-x', `${x}px`);
      root.style.setProperty('--toggle-y', `${y}px`);
      root.style.setProperty('--reveal-radius', `${radius}px`);

      burst();
      toggle.classList.remove('toggle-pop');
      void toggle.offsetWidth;
      toggle.classList.add('toggle-pop');

      if (!reducedMotion.matches && document.startViewTransition) {
        document.startViewTransition(() => applyTheme(nextTheme));
      } else {
        applyTheme(nextTheme);
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const card = document.querySelector('[data-tilt-card]');
  if (card && !reducedMotion.matches) {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -4;
      const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
      card.style.setProperty('--rx', `${rx}deg`);
      card.style.setProperty('--ry', `${ry}deg`);
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  const postContainers = document.querySelectorAll('[data-posts]');
  if (postContainers.length) {
    fetch('/content/posts.json')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load posts');
        return response.json();
      })
      .then((posts) => {
        const render = (container, activeFilter = 'all') => {
          const limit = Number(container.dataset.limit || posts.length);
          const filtered = posts.filter((post) => activeFilter === 'all' || post.tags.includes(activeFilter)).slice(0, limit);
          container.innerHTML = filtered.length ? filtered.map((post) => `
            <article class="post-row" data-tags="${post.tags.join(' ')}">
              <a class="post-row-link" href="/blog/${post.slug}.html">
                <div class="post-row-main">
                  <div class="post-meta"><span>${post.dateLabel}</span><span>${post.readingTime}</span></div>
                  <h3>${post.title}</h3>
                  <p>${post.description}</p>
                  <div class="tag-row">${post.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
                </div>
                <span class="post-arrow" aria-hidden="true">↗</span>
              </a>
            </article>`).join('') : '<p class="empty-state">Nothing in this drawer yet.</p>';
        };

        postContainers.forEach((container) => render(container));
        document.querySelectorAll('[data-filter]').forEach((button) => {
          button.addEventListener('click', () => {
            document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
            button.classList.add('active');
            postContainers.forEach((container) => render(container, button.dataset.filter));
          });
        });
      })
      .catch(() => {
        postContainers.forEach((container) => {
          container.innerHTML = '<p class="empty-state">The notes index could not load. <a href="/blog/why-this-exists.html">Read the first note directly.</a></p>';
        });
      });
  }
})();
