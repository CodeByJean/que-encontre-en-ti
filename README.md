# Razones para amarte

Sitio web estático interactivo creado con HTML, CSS y JavaScript.

## Publicar en GitHub Pages

El proyecto incluye el workflow `.github/workflows/deploy-pages.yml`, que publica automáticamente el sitio en GitHub Pages cuando se hace push a la rama `main`.

1. Sube el proyecto a un repositorio de GitHub.
2. Entra en **Settings → Pages**.
3. En **Build and deployment**, selecciona **GitHub Actions** como fuente.
4. Haz push a `main` o ejecuta manualmente el workflow desde **Actions → Deploy static site to GitHub Pages → Run workflow**.
5. GitHub mostrará la URL pública en la ejecución del workflow y en la sección **Pages**.

> El sitio necesita servirse mediante HTTP para cargar `messages.json`; GitHub Pages ya proporciona ese entorno correctamente.

## Personalización

- Añade o modifica tarjetas en `messages.json`.
- Coloca las fotografías en `images/` y actualiza sus rutas en `styles.css`.
- La rama configurada para el despliegue es `main`.
