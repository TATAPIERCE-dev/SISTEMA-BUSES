import { Head } from "@inertiajs/react";

export default function Home() {
  return (
    <>
      <Head title="Inicio" />
      <div className="home-container">
        <div className="hero">
          <h1>AdonisJS + Inertia.js Starter Kit</h1>
          <p>
            Un kit completo que combina el poder del backend de AdonisJS con la interactividad de
            React a través de Inertia.js — sin necesidad de API REST.
          </p>
        </div>

        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">⚡</div>
            <h3>AdonisJS</h3>
            <p>
              Framework Node.js moderno y robusto con TypeScript, autenticación integrada,
              validación de datos y mucho más.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🚀</div>
            <h3>Inertia.js</h3>
            <p>
              Construye aplicaciones SPA sin la complejidad de una API. Enrutamiento del servidor
              con interactividad del cliente.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">⚛️</div>
            <h3>React</h3>
            <p>
              Interfaz de usuario moderna y reactiva. Componentes reutilizables y estado compartido
              entre servidor y cliente.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🔐</div>
            <h3>Autenticación</h3>
            <p>
              Sistema de autenticación completo con sesiones, middleware de protección de rutas y
              gestión de usuarios.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">📦</div>
            <h3>TypeScript</h3>
            <p>
              Todo el proyecto está tipado con TypeScript para mayor seguridad y mejor experiencia
              de desarrollo.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">🎨</div>
            <h3>Vite</h3>
            <p>
              Build tool ultra rápido para desarrollo y producción. Hot Module Replacement para
              desarrollo ágil.
            </p>
          </div>
        </div>

        <div className="optional-section">
          <h2>Herramientas Opcionales</h2>
          <p className="section-description">
            Estas herramientas no están incluidas por defecto, pero puedes configurarlas según tus
            necesidades.
          </p>
          <div className="optional-grid">
            <a
              href="https://tailwindcss.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="optional-card"
            >
              <div className="optional-icon">💨</div>
              <h3>Tailwind CSS</h3>
              <p>
                Framework CSS utility-first para diseñar interfaces rápidamente. Perfecto para crear
                diseños modernos y responsivos con clases utilitarias.
              </p>
              <div className="optional-badge">Opcional</div>
            </a>

            <a
              href="https://ui.shadcn.com/docs/installation/vite"
              target="_blank"
              rel="noopener noreferrer"
              className="optional-card"
            >
              <div className="optional-icon">🎨</div>
              <h3>shadcn/ui</h3>
              <p>
                Colección de componentes reutilizables construidos con Radix UI y Tailwind CSS.
                Copia y pega componentes directamente en tu proyecto.
              </p>
              <div className="optional-badge">Opcional</div>
            </a>
          </div>
        </div>

        <div className="docker-section">
          <h2>Servicios Docker Incluidos</h2>
          <p className="section-description">
            Este kit incluye una configuración completa de Docker Compose con todos los servicios
            necesarios para desarrollo y producción.
          </p>
          <div className="docker-grid">
            <div className="docker-card">
              <div className="docker-icon">🐘</div>
              <h3>PostgreSQL</h3>
              <p>
                Base de datos relacional robusta y confiable. Configurada con volúmenes persistentes
                para mantener tus datos seguros.
              </p>
              <div className="docker-port">Puerto: 5432</div>
            </div>

            <div className="docker-card">
              <div className="docker-icon">⚡</div>
              <h3>Redis</h3>
              <p>
                Sistema de caché y colas de trabajos de alto rendimiento. Perfecto para sesiones,
                caché y procesamiento asíncrono.
              </p>
              <div className="docker-port">Puerto: 6379</div>
            </div>

            <div className="docker-card">
              <div className="docker-icon">📦</div>
              <h3>MinIO</h3>
              <p>
                Almacenamiento de objetos compatible con S3. Ideal para almacenar archivos,
                documentos e imágenes de forma escalable.
              </p>
              <div className="docker-port">Puertos: 9000, 9001</div>
            </div>

            <div className="docker-card">
              <div className="docker-icon">📧</div>
              <h3>Mailpit</h3>
              <p>
                Servidor de correo para desarrollo. Captura todos los emails enviados y proporciona
                una interfaz web para visualizarlos.
              </p>
              <div className="docker-port">Puertos: 1026, 8026</div>
            </div>
          </div>
        </div>

        <div className="resources-section">
          <h2>Recursos y Documentación</h2>
          <div className="resources-grid">
            <a
              href="https://insiders.adonisjs.com/docs/v7-alpha/introduction"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <h3>Documentación Oficial &nbsp;›</h3>
              <p>Referencia completa para construir con AdonisJS</p>
            </a>

            <a
              href="https://adocasts.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <h3>Adocasts &nbsp;›</h3>
              <p>Tutoriales en video para desarrollo diario</p>
            </a>

            <a
              href="https://discord.gg/vDcEjq6"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <h3>Discord &nbsp;›</h3>
              <p>Conecta con desarrolladores de la comunidad</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
