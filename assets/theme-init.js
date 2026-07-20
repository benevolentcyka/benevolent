(() => {
  const saved = localStorage.getItem('benevolent-theme');
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const theme = saved || preferred;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
