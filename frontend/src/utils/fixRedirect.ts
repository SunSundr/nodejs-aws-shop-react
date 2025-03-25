export function fixRedirect() {
  const handlePageShow = (event: PageTransitionEvent) => {
    if (!event.persisted) return;
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthParams = urlParams.has('code') && urlParams.has('state');
    if (hasAuthParams) return;
    // const cameFromAuth = document.referrer.includes('cognito') || document.referrer.includes('auth');

    Object.keys(localStorage)
      .filter((key) => key.startsWith('oidc.'))
      .forEach((key) => localStorage.removeItem(key));

    setTimeout(() => window.location.reload(), 100);
  };
  window.addEventListener('pageshow', handlePageShow);
}
