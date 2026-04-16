(async function () {
  const SUPABASE_URL = 'https://ezvjjudhvothkiqyfxtl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6dmpqdWRodm90aGtpcXlmeHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjk4ODYsImV4cCI6MjA5MDgwNTg4Nn0.rMLPardNjEIoXkvQIPRxAXjjATBKBUwnPm67oU1ZjM8';
  const LOGIN_PAGE = 'login.html';

  const ROLE_MAP = {
    'admin1@amburguer.co': null,
    'cocina@amburguer.co': 'cocina-v2.html',
    'domiciliario@amburguer.co': 'domiciliario-v1.html'
  };

  document.body.style.visibility = 'hidden';

  try {
    let token = getToken();
    if (!token) throw new Error('No token');

    let res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + token }
    });

    // Si el token falló, intentamos refrescarlo UNA VEZ sin recargar la página
    if (!res.ok) {
      const refreshed = await tryRefresh();
      if (!refreshed) throw new Error('Session expired');
      
      // Intentamos la petición una segunda vez con el nuevo token
      token = getToken();
      res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) throw new Error('Invalid session after refresh');
    }

    const user = await res.json();
    const email = user.email;
    const path = window.location.pathname;

    if (!(email in ROLE_MAP)) throw new Error('Unauthorized');

    const allowedPanel = ROLE_MAP[email];

    // FIX: Usamos includes para evitar loops por culpa de las extensiones .html en Cloudflare
    if (allowedPanel && !path.includes(allowedPanel.replace('.html', ''))) {
      window.location.replace(allowedPanel);
      return;
    }

    document.body.style.visibility = 'visible';
    window._amUser = { email };

    // Función de logout global
    window.cerrarSesion = function () {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace(LOGIN_PAGE);
    };

  } catch (e) {
    console.error('Auth Error:', e.message);
    if (!window.location.pathname.includes(LOGIN_PAGE)) {
      sessionStorage.setItem('am_redirect', window.location.href);
      window.location.replace(LOGIN_PAGE);
    }
  }

  function getToken() {
    try {
      const storageKey = `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`;
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw).access_token : '';
    } catch { return ''; }
  }

  async function tryRefresh() {
    try {
      const storageKey = `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`;
      const raw = localStorage.getItem(storageKey);
      if (!raw) return false;
      const refreshToken = JSON.parse(raw).refresh_token;
      if (!refreshToken) return false;

      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    } catch { return false; }
  }
})();
