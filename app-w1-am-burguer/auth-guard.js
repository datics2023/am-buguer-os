(async function () {
  const SUPABASE_URL = 'https://ezvjjudhvothkiqyfxtl.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6dmpqdWRodm90aGtpcXlmeHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjk4ODYsImV4cCI6MjA5MDgwNTg4Nn0.rMLPardNjEIoXkvQIPRxAXjjATBKBUwnPm67oU1ZjM8';
  const LOGIN_PAGE = 'login.html';

  // Mapa email → panel permitido (admin1 puede entrar a cualquiera)
  const ROLE_MAP = {
    'admin1@amburguer.co':       null, // null = acceso a todos
    'cocina@amburguer.co':       'cocina-v2.html',
    'domiciliario@amburguer.co': 'domiciliario-v1.html'
  };

  // Ocultar body hasta verificar sesión
  document.body.style.visibility = 'hidden';

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + getToken()
      }
    });

    if (!res.ok) throw new Error('No session');

    const user = await res.json();
    if (!user || !user.id) throw new Error('No user');

    const email = user.email;
    const currentPage = window.location.pathname.split('/').pop();

    // Email no reconocido → fuera
    if (!(email in ROLE_MAP)) throw new Error('Unauthorized');

    const allowedPanel = ROLE_MAP[email];

    // Si tiene panel asignado y está en uno diferente → redirigir a su panel
    if (allowedPanel && currentPage !== allowedPanel) {
      window.location.replace(allowedPanel);
      return;
    }

    // Sesión válida y panel correcto — mostrar página
    document.body.style.visibility = 'visible';
    window._amUser = { email };

    window.cerrarSesion = async function () {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + getToken()
        }
      }).catch(() => {});
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace(LOGIN_PAGE);
    };

  } catch (e) {
    sessionStorage.setItem('am_redirect', window.location.href);
    window.location.replace(LOGIN_PAGE);
  }

  function getToken() {
    try {
      const raw = localStorage.getItem(
        `sb-${SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`
      );
      if (!raw) return '';
      const parsed = JSON.parse(raw);
      return parsed.access_token || '';
    } catch {
      return '';
    }
  }
})();
