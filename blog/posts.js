/* ============================================================
   DylanOS Blog — contenido
   ------------------------------------------------------------
   Fuente única de los artículos del blog. Se carga antes que
   blog.js y se expone como `window.DylanOSBlogPosts`.

   Campos de un artículo:
   slug       Identificador único. Se usa en /blog/<slug>/.
   title      Título del artículo.
   category   Noticias | Historia | Desarrollo | Actualizaciones |
              Tutoriales | Comunidad | Releases
   date       Fecha ISO (YYYY-MM-DD).
   author     Autor o equipo.
   excerpt    Resumen corto para tarjetas y metadatos.
   visual     Variante visual de portada.
   glyph      Símbolo decorativo de la portada.
   image      Opcional. Ruta a una imagen real.
   featured   true para marcar el artículo destacado.
   demo       true solo para contenido de ejemplo.
   content    Párrafos (string) o bloques:
              { heading }, { list: [] }, { code, lang },
              { quote, cite }, { text }.

   Para publicar un artículo nuevo basta con añadir un objeto y
   regenerar las entradas de blog/feed.xml y sitemap.xml.
   ============================================================ */

(function (global) {
  "use strict";

  var posts = [
    {
      slug: "el-comienzo-de-dylanos-donde-todo-empezo",
      title: "El comienzo de DylanOS: donde todo empezó",
      category: "Historia",
      date: "2026-08-06",
      author: "DylanOS Team",
      excerpt: "El 6 de agosto de 2026 quedó registrado el primer commit de DylanOS. Esta es la historia de ese punto de partida.",
      featured: true,
      visual: "historia",
      glyph: "01",
      image: "/blog/images/el-comienzo-de-dylanos.svg",
      content: [
        "Hay proyectos que comienzan con una gran presentación. DylanOS no.",
        "DylanOS comenzó con una primera línea de código, un repositorio y una idea: crear una experiencia Linux propia, diferente y construida desde cero.",
        "El 6 de agosto de 2026 quedó registrado el primer commit del proyecto DylanOS. Esa fecha marca el inicio documentado de lo que con el tiempo se convertiría en una de las ideas más importantes del proyecto.",
        "En ese momento, DylanOS todavía estaba muy lejos de ser lo que es hoy. No existía una experiencia completa, no estaban todas sus aplicaciones, ni la identidad visual que posteriormente definiría al proyecto.",
        "Solo existía el comienzo.",
        {
          heading: "De una idea a un proyecto"
        },
        "Desde sus primeras etapas, el objetivo fue más allá de simplemente crear otra distribución de Linux.",
        "La idea era construir un sistema que combinara:",
        {
          list: [
            "Una experiencia de escritorio cuidada.",
            "Herramientas propias.",
            "Una identidad visual reconocible.",
            "Personalización profunda.",
            "Integración entre aplicaciones y sistema.",
            "Una filosofía centrada en hacer que Linux fuera más accesible y agradable de utilizar."
          ]
        },
        "Con el tiempo, esa idea empezó a convertirse en código, aplicaciones, configuraciones, interfaces y decisiones de diseño.",
        {
          heading: "El primer commit"
        },
        "El primer commit representa algo más que una entrada en Git.",
        "Es el punto desde el que se puede comenzar a reconstruir la historia de DylanOS.",
        "Cada cambio posterior, cada nueva aplicación, cada corrección y cada decisión de diseño fueron construyendo sobre ese primer punto.",
        "Lo que comenzó el 6 de agosto terminaría evolucionando hacia un proyecto mucho más ambicioso.",
        {
          heading: "El inicio de una historia"
        },
        "DylanOS todavía tiene mucho por delante.",
        "Pero todo proyecto necesita un punto de partida.",
        "Para DylanOS, ese punto está registrado en Git: el 6 de agosto de 2026.",
        "Un repositorio vacío de historia.",
        "Una primera modificación.",
        "Y una idea que apenas estaba comenzando.",
        {
          quote: "Todo sistema tiene un origen. Este fue el nuestro.",
          cite: "Equipo de DylanOS"
        }
      ]
    },
    {
      slug: "bienvenido-al-blog-de-dylanos",
      title: "Bienvenido al blog de DylanOS",
      category: "Noticias",
      date: "2026-11-27",
      author: "Equipo DylanOS",
      excerpt: "Abrimos un espacio oficial para contar cómo avanza DylanOS: desarrollo, versiones, guías y comunidad.",
      visual: "noticias",
      glyph: "//",
      image: null,
      content: [
        "Este es el blog oficial de DylanOS. A partir de ahora, aquí publicaremos las novedades del proyecto: cómo se construye el sistema, qué cambia en cada versión, guías prácticas y formas de participar en la comunidad.",
        {
          heading: "Qué vas a encontrar aquí"
        },
        {
          list: [
            "Noticias: hitos y anuncios del proyecto.",
            "Desarrollo: decisiones técnicas, diseño y arquitectura.",
            "Actualizaciones: cómo se organizan los cambios y las versiones.",
            "Tutoriales: guías para usar las herramientas del proyecto.",
            "Comunidad: canales, contribuciones y formas de contacto.",
            "Releases: notas sobre el proceso de publicación de ISOs."
          ]
        },
        "Cada artículo está asociado a una categoría y puede filtrarse desde el archivo del blog. También puedes seguir las publicaciones mediante el canal RSS disponible en esta misma página.",
        {
          heading: "Información verificada"
        },
        "No publicaremos fechas de lanzamiento, números de versión ni funcionalidades que no estén confirmadas. Cuando una versión esté disponible, aparecerá en la sección de descargas y se anunciará con su propio artículo.",
        "Si quieres proponer un tema, reportar un error o compartir una idea, puedes escribirnos a dylanoscontact@proton.me o abrir una discusión en el repositorio de GitHub del proyecto."
      ]
    },
    {
      slug: "como-publicamos-una-version-de-dylanos",
      title: "Cómo publicamos una versión de DylanOS",
      category: "Releases",
      date: "2026-11-22",
      author: "Equipo DylanOS",
      excerpt: "Del borrador a la descarga pública: metadatos en Supabase, archivos en SourceForge y verificación antes de anunciar.",
      visual: "releases",
      glyph: "#",
      image: null,
      content: [
        "Publicar una ISO no consiste solo en subir un archivo. El sistema de versiones de DylanOS separa metadatos, archivos y verificación para que cada descarga pública sea trazable y reproducible.",
        {
          heading: "Dónde vive cada cosa"
        },
        {
          list: [
            "Supabase PostgreSQL guarda canales, estados, tamaño, SHA-256 y la ruta del archivo.",
            "SourceForge aloja y distribuye las ISOs mediante su red de espejos.",
            "Vercel sirve la web y las funciones de configuración y verificación.",
            "Ninguna ISO atraviesa una función de Vercel ni se almacena en PostgreSQL."
          ]
        },
        {
          heading: "Tres canales y tres estados"
        },
        "Cada publicación pertenece a un canal —pre-beta, beta o stable— y tiene un estado: borrador, publicado o retirado. Solo puede existir una versión principal publicada por canal; al promover una nueva, la anterior pasa al historial sin que su archivo se borre.",
        {
          heading: "La ruta es inmutable"
        },
        "Los archivos se guardan con una ruta que incluye un identificador único de carga, por ejemplo canal/versión/uuid/nombre.iso. Así, reutilizar un nombre o un número de versión nunca sobrescribe una descarga existente.",
        {
          heading: "Verificar antes de publicar"
        },
        "Antes de crear el registro, el sistema comprueba que la URL pública responda y que el tamaño coincida. El SHA-256 se calcula en local y se conserva junto a la versión. La comprobación de tamaño confirma que el archivo está completo; el hash permite verificar su integridad más adelante.",
        "SourceForge replica los archivos en varios espejos. Si el enlace aún no está listo, el sistema reintenta en lugar de simular el progreso o crear una fila incompleta.",
        {
          heading: "Publicar y retirar"
        },
        "La promoción de una versión es una operación atómica: retira la principal anterior y publica la nueva dentro de la misma transacción. Retirar una versión conserva el archivo y su enlace histórico. Los borradores y las mutaciones solo son accesibles para administradores autorizados."
      ]
    },
    {
      slug: "como-organizamos-las-actualizaciones",
      title: "Cómo se organizan las actualizaciones",
      category: "Actualizaciones",
      date: "2026-11-15",
      author: "Equipo DylanOS",
      excerpt: "Canales, estados e historial: las reglas que hacen que una actualización sea clara y reversible.",
      visual: "actualizaciones",
      glyph: "↻",
      image: null,
      content: [
        "Una actualización de DylanOS no es solo un número nuevo. Para que una versión llegue a la web necesita pasar por un flujo que distingue borradores, publicaciones activas e historial.",
        {
          heading: "Qué cambia cuando hay una actualización"
        },
        "El catálogo público muestra la versión principal de cada canal. Cuando se publica una nueva, la anterior deja de ser la principal, pero permanece disponible como versión histórica y conserva su archivo en SourceForge.",
        {
          heading: "Por qué separamos canales"
        },
        {
          list: [
            "Pre-beta: versiones tempranas para pruebas concretas.",
            "Beta: versiones más completas que aún pueden cambiar.",
            "Stable: la versión recomendada para el uso general."
          ]
        },
        "Separar canales evita que una prueba sustituya a la versión estable y permite que cada publicación tenga su propio historial.",
        {
          heading: "Qué encontrarás en un anuncio"
        },
        "Cuando exista una actualización real, el artículo indicará el canal, la versión, los cambios confirmados y el enlace de descarga. No se anunciarán fechas ni funciones que todavía no formen parte de una ISO publicada.",
        "Si una versión se retira, su descarga histórica seguirá enlazada y el catálogo dejará claro cuál es la versión principal vigente."
      ]
    },
    {
      slug: "dentro-de-la-web-oficial-de-dylanos",
      title: "Dentro de la web oficial de DylanOS",
      category: "Desarrollo",
      date: "2026-11-08",
      author: "Equipo DylanOS",
      excerpt: "Cómo está construido el sitio: páginas ligeras, Node.js, Vercel, Supabase y pruebas automatizadas.",
      visual: "desarrollo",
      glyph: "</>",
      image: null,
      content: [
        "La web de DylanOS está pensada para ser rápida, fácil de mantener y coherente con el resto del proyecto. No necesita un framework pesado para mostrar el catálogo o la documentación: prioriza HTML, CSS y JavaScript, con un pequeño servidor Node.js para las rutas dinámicas.",
        {
          heading: "Piezas principales"
        },
        {
          list: [
            "Páginas estáticas para el inicio, el equipo, la documentación y el blog.",
            "Un servidor Node.js 20 para desarrollo local y rutas compartidas.",
            "Funciones serverless en Vercel para configuración, estadísticas y asistente.",
            "Supabase para los metadatos del sistema de versiones.",
            "SourceForge para alojar las ISOs fuera de la web."
          ]
        },
        {
          heading: "El blog como parte del sitio"
        },
        "El blog comparte la navegación, el pie y los estilos base con la web principal. Los artículos viven en un archivo de contenido independiente, se renderizan sin dependencias externas y se publican con URLs propias para que cada entrada pueda enlazarse y compartirse.",
        {
          heading: "Pruebas antes de publicar"
        },
        "El repositorio incluye pruebas con node:test para el servidor, las rutas de API, el sistema de versiones y la documentación. También hay pruebas de navegador con Playwright para los flujos principales. Antes de desplegar, se ejecutan las pruebas y se revisa que las rutas del blog respondan correctamente.",
        "La seguridad también forma parte del diseño: las rutas estáticas se normalizan para impedir salir del directorio raíz, se bloquean archivos ocultos y las credenciales de administración nunca se envían al navegador."
      ]
    },
    {
      slug: "consultar-versiones-desde-la-cli",
      title: "Consultar versiones desde la CLI",
      category: "Tutoriales",
      date: "2026-10-30",
      author: "Equipo DylanOS",
      excerpt: "Comandos básicos para revisar el estado, el historial y las publicaciones del sistema de versiones.",
      visual: "tutoriales",
      glyph: ">_",
      image: null,
      content: [
        "El repositorio incluye una CLI para consultar y administrar las versiones de DylanOS. Estas operaciones de lectura son el punto de partida para entender qué hay publicado en cada canal.",
        {
          heading: "Requisitos"
        },
        {
          list: [
            "Node.js 20 o superior.",
            "Dependencias instaladas con npm install.",
            "Variables de Supabase configuradas en .env.local para las operaciones que consultan la base de datos."
          ]
        },
        {
          heading: "Estado y listado"
        },
        {
          code: "npm run releases:status\nnpm run releases:list",
          lang: "bash"
        },
        "El primer comando resume el estado del sistema. El segundo lista las versiones registradas. Para consultar el historial de un canal concreto:",
        {
          code: "npm run releases:history -- --channel \"pre-beta\"",
          lang: "bash"
        },
        {
          heading: "Publicar una versión"
        },
        "La publicación se hace desde la CLI o desde el panel de administración. Un ejemplo de publicación con promoción inmediata:",
        {
          code: "npm run releases:publish -- \\\n  --file \"./dist/DylanOS-Crimson.iso\" \\\n  --name \"DylanOS Crimson 0.3.0\" \\\n  --version \"0.3.0-prebeta\" \\\n  --channel \"pre-beta\"",
          lang: "bash"
        },
        "Añadiendo --draft, la versión se guarda como borrador y no aparece en el catálogo público hasta que se promueva.",
        {
          heading: "Qué hace la CLI"
        },
        {
          list: [
            "Valida el archivo, el canal y la versión.",
            "Calcula el SHA-256 por streaming.",
            "Crea una ruta inmutable con un identificador único.",
            "Sube la ISO con rsync reanudable.",
            "Espera a que el enlace público informe el tamaño exacto.",
            "Inserta el registro en Supabase y, si corresponde, promueve la versión."
          ]
        },
        "Las credenciales SSH y la clave de servicio de Supabase deben permanecer en el equipo autorizado. Nunca se incluyen en la salida de los comandos ni en el navegador."
      ]
    },
    {
      slug: "el-diseno-de-dylanos-coherencia-antes-que-ruido",
      title: "El diseño de DylanOS: coherencia antes que ruido",
      category: "Desarrollo",
      date: "2026-10-20",
      author: "Equipo DylanOS",
      excerpt: "Menos elementos, mejores decisiones: los principios visuales que comparten el sistema y la web.",
      visual: "desarrollo",
      glyph: "</>",
      image: null,
      content: [
        "DylanOS busca una identidad reconocible sin recurrir a efectos innecesarios. La web y el sistema comparten una idea sencilla: la interfaz debe ayudar a trabajar y desaparecer cuando ya no hace falta.",
        {
          heading: "Principios que guían la interfaz"
        },
        {
          list: [
            "Contraste claro entre fondo, superficies y contenido.",
            "Un acento de color con intención, no decoración constante.",
            "Tipografía legible y jerarquías evidentes.",
            "Movimiento breve, natural y respetuoso con prefers-reduced-motion.",
            "Componentes coherentes entre páginas y estados."
          ]
        },
        {
          heading: "Una identidad compartida"
        },
        "La paleta oscura, el acento rojo y las superficies translúcidas aparecen tanto en la web como en los materiales del sistema. No se trata de copiar una estética ajena, sino de mantener decisiones consistentes de color, espacio y movimiento.",
        {
          heading: "Diseñar también es quitar"
        },
        "Cada sección debe justificar su presencia. Si un elemento no aporta información, navegación o contexto, se elimina. Esa disciplina hace que el catálogo, la documentación y el blog se sientan parte del mismo proyecto."
      ]
    },
    {
      slug: "como-seguir-el-proyecto-y-participar",
      title: "Cómo seguir el proyecto y participar",
      category: "Comunidad",
      date: "2026-10-12",
      author: "Equipo DylanOS",
      excerpt: "Los canales oficiales para seguir las novedades, leer la documentación y compartir ideas con el equipo.",
      visual: "comunidad",
      glyph: "@",
      image: null,
      content: [
        "DylanOS es un proyecto abierto a ideas, reportes y contribuciones. Estos son los canales oficiales para seguirlo y participar.",
        {
          heading: "Canales oficiales"
        },
        {
          list: [
            "GitHub: repositorio del proyecto, código y discusiones.",
            "Blog: noticias, desarrollo, tutoriales y releases.",
            "Documentación: guías técnicas y arquitectura del sistema.",
            "Correo: dylanoscontact@proton.me para contacto directo.",
            "Nuestro equipo: presentación de las personas detrás del proyecto."
          ]
        },
        {
          heading: "Cómo contribuir"
        },
        "Puedes abrir un issue para reportar un problema, proponer una mejora o plantear una duda. Si vas a enviar código, describe el cambio, ejecuta las pruebas y abre un pull request con el contexto necesario para revisarlo.",
        {
          heading: "Qué esperar de las publicaciones"
        },
        "Las novedades importantes se anunciarán en el blog y en el repositorio. Los anuncios de versiones incluirán el canal, la versión y los cambios confirmados. La documentación se actualizará junto con el sistema para que las guías no queden desfasadas.",
        "Gracias por formar parte de DylanOS. Cada reporte, idea y contribución ayuda a que el proyecto avance."
      ]
    }
  ];

  if (typeof module !== "undefined" && module.exports) {
    module.exports = posts;
  } else {
    global.DylanOSBlogPosts = posts;
  }
})(typeof window !== "undefined" ? window : globalThis);
