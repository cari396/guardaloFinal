// Configuración dinámica del entorno para Guardalo Staging
// Puedes editar este archivo directamente en Hostinger File Manager sin tener que recompilar la aplicación
window._ENV_API_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:8080' 
  : 'https://staging-api.guardalo.com.ar';

// Opcional: ID de cliente de Google OAuth (Google Cloud Console)
window._ENV_GOOGLE_CLIENT_ID = '';

