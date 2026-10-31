# AULA RAÍZ
## Ecosistema de inteligencia artificial para colegios rurales multigrado

**Documento de planeamiento para construir un MVP demostrable en un día**  
**Versión:** 1.0  
**Ámbito del piloto:** escuela primaria rural multigrado de referencia (Huarín, Huánuco)  
**Decisión de alcance:** se elimina por completo el módulo **Profesor IA**. AULA RAÍZ no pretende sustituir al docente; busca darle herramientas para diagnosticar, planificar, producir materiales y seguir los avances de sus estudiantes.

---

# PARTE I. CONCEPTO Y PITCH

## 1. Pitch de 3 minutos

### AULA RAÍZ: inteligencia artificial que llega a la escuela, incluso cuando no llega internet

En muchas escuelas rurales del Perú, un solo docente debe atender a estudiantes de distintos grados y niveles de aprendizaje. Además de enseñar, tiene que planificar actividades diferentes, preparar materiales y hacer seguimiento a cada niño, muchas veces con pocos recursos y una conexión a internet inestable.

En la escuela rural que tomamos como referencia, el director reportó que primaria cuenta con 35 estudiantes y cuatro docentes; hay aulas que agrupan distintos grados, no existe una biblioteca funcional, las tablets entregadas anteriormente están mayoritariamente fuera de servicio y la conexión puede ser intermitente. Cuando el director debe salir a realizar gestiones, deja fichas impresas para que sus estudiantes continúen trabajando.

Frente a esta realidad proponemos **AULA RAÍZ**, un ecosistema de inteligencia artificial diseñado para ayudar a los docentes de escuelas multigrado. No depende de que cada niño tenga una tablet ni de que el colegio tenga internet permanente.

AULA RAÍZ integra cinco componentes:

1. **NIVELA AI** realiza diagnósticos breves y organiza la información sobre las competencias que cada estudiante ya domina y aquellas que necesita reforzar.
2. **BIBLIOTECA IA** ayuda al docente a generar fichas, lecturas, ejercicios y evaluaciones diferenciadas por nivel, listas para imprimir y contextualizadas con situaciones de la comunidad.
3. **AULA BOX** es el centro local del sistema. Puede instalarse en una mini PC o computadora del colegio y crea una red Wi-Fi interna para que el docente acceda desde su celular, incluso sin internet externo.
4. **RADAR EDUCATIVO** muestra la evolución de los estudiantes, identifica competencias que necesitan atención y ayuda al docente a decidir qué contenidos reforzar. Sus alertas son orientativas, no diagnósticos automáticos.
5. **RADIO AULA** permite escuchar instrucciones, lecturas y explicaciones mediante un parlante, para sumar una forma de acceso que no dependa de una pantalla para cada estudiante.

¿Cómo funciona en una clase real? El docente registra una evaluación breve. NIVELA AI organiza los resultados por competencias. Después, BIBLIOTECA IA prepara actividades con distintos niveles de dificultad. El docente las imprime y organiza el trabajo del aula. Al terminar, registra los resultados y RADAR EDUCATIVO actualiza el seguimiento. Si se requiere, las instrucciones pueden reproducirse en audio mediante RADIO AULA.

La propuesta está pensada para funcionar primero en una red local, sin depender de internet. Cuando exista conectividad, se podrán actualizar los contenidos y sincronizar reportes, siempre con autorización y protección de los datos de los estudiantes.

En un primer piloto no necesitamos equipar a cada niño. Aprovechamos el celular del docente, la fotocopiadora que ya existe y una computadora local que actúe como AULA BOX.

**AULA RAÍZ no reemplaza al profesor: le devuelve tiempo para enseñar y permite que ningún grupo quede invisible dentro de un aula multigrado.** Queremos validar esta solución en una escuela real, medir cuánto reduce el tiempo de planificación y comprobar si facilita actividades más pertinentes para los distintos niveles de aprendizaje.

## 2. Versión breve de la propuesta de valor

> AULA RAÍZ convierte una computadora local en el centro de inteligencia de una escuela rural: ayuda a diagnosticar aprendizajes, generar materiales diferenciados, seguir avances y distribuir contenidos por audio, sin depender de internet permanente ni de una tablet por estudiante.

## 3. Mensajes clave para una presentación

- **Problema:** aulas multigrado, tiempo docente limitado, pocos materiales, conectividad intermitente y dispositivos que no siempre funcionan.
- **Usuario principal:** docente de primaria multigrado; el director también puede usar los reportes de gestión.
- **Beneficiario:** estudiante de primaria rural.
- **Diferenciador:** IA aplicada a las tareas concretas del docente y ejecutada desde una infraestructura local.
- **Enfoque offline:** sin internet externo, pero con el celular conectado por Wi-Fi a AULA BOX.
- **Resultado que se quiere validar:** menos tiempo de planificación, materiales diferenciados más rápidos y mejor visibilidad del progreso por competencia.

---

# PARTE II. PLANEAMIENTO DEL PRODUCTO

## 4. Problema y evidencia de partida

La entrevista al director de primaria rural de Huarín (30 de octubre de 2026) reporta lo siguiente:

- 35 estudiantes de primaria y cuatro docentes para los seis grados.
- Agrupación de grados en aulas, por ejemplo, primero con segundo y quinto con sexto.
- Conectividad intermitente y señal celular débil; en enero y febrero se corta el acceso a internet según lo reportado.
- No existe una biblioteca funcional; los libros disponibles estaban deteriorados o se habían perdido.
- De las tablets entregadas, solo quedaban aproximadamente tres o cuatro operativas, según el entrevistado.
- Existe una fotocopiadora antigua que todavía puede utilizarse, aunque falla.
- Cuando el director sale a realizar gestiones, deja fotocopias para que el grupo continúe trabajando.
- El entrevistado percibe que atender tomando como referencia el grado superior puede dejar menos atendidos a estudiantes del grado inferior. Esta es su percepción y debe validarse con la orientación pedagógica oficial.

El documento de contexto sobre primaria multigrado señala además que el Minedu venía impulsando conversiones de escuelas unidocentes a multigrado durante 2026, y destaca necesidades de diagnóstico por nivel real, planificación diferenciada, materiales y asistencia técnica.

**Importante:** las cifras de la entrevista son reportes de un entrevistado y no deben presentarse como estadísticas nacionales. El MVP se diseña para validar el problema en una escuela concreta.

## 5. Objetivo general

Construir un prototipo web progresivo (PWA) de AULA RAÍZ que permita a un docente de primaria multigrado registrar estudiantes, realizar un diagnóstico básico por competencias, agrupar necesidades de aprendizaje, generar una sesión y fichas imprimibles, y visualizar el avance, funcionando dentro de una red local sin requerir internet externo.

## 6. Objetivos específicos

1. Registrar estudiantes con código anónimo, grado y nivel de aprendizaje inicial.
2. Capturar resultados de un diagnóstico corto mediante preguntas y registro manual del docente.
3. Clasificar resultados mediante reglas transparentes y editables; no afirmar que existe un modelo predictivo entrenado.
4. Generar un plan de sesión y actividades diferenciadas para los grupos identificados.
5. Crear fichas imprimibles en blanco y negro, económicas en tinta y papel.
6. Mostrar indicadores básicos de progreso por estudiante y competencia.
7. Permitir escuchar instrucciones o contenidos mediante síntesis de voz del navegador, si el dispositivo la soporta.
8. Mantener la aplicación accesible en una red Wi-Fi local sin conexión a internet.

## 7. Alcance funcional del MVP de un día

### Incluido en la demostración

| Módulo | Funcionalidad mínima demostrable |
|---|---|
| AULA BOX | Aplicación servida desde una computadora local y accesible desde el celular por la misma red Wi-Fi. Indicador de estado local/sin internet. |
| NIVELA AI | Registro de evaluación breve, cálculo transparente de puntaje y asignación de nivel de apoyo a partir de reglas. |
| BIBLIOTECA IA | Formulario para generar una sesión y una ficha diferenciada. Debe existir un modo demostración con plantillas si no hay modelo de IA conectado. |
| RADAR EDUCATIVO | Panel de estudiantes, resultados recientes, competencias a reforzar y gráficos básicos. Utilizar datos de ejemplo claramente identificados. |
| RADIO AULA | Botón “Escuchar” que lee instrucciones o el texto de una actividad mediante la función de voz disponible en el navegador; debe tener alternativa visual si no funciona. |
| Material imprimible | Vista de ficha con diseño A4, opción de imprimir o guardar como PDF desde el navegador. |
| Datos locales | Persistencia en SQLite en el servidor local y datos de demostración precargados. |
| PWA | Manifest e interfaz instalable; caché de los archivos estáticos principales. |

### Fuera del alcance del primer día

- Entrenar un modelo propio de machine learning.
- Diagnosticar clínicamente, etiquetar discapacidades o predecir el futuro académico de un niño.
- Reconocimiento automático de escritura manuscrita en fotografías.
- Procesamiento robusto de audio de los estudiantes o grabación de sus voces.
- Generación garantizada de contenido curricular correcto sin revisión docente.
- Sincronización real con plataformas del Minedu o sistemas de la UGEL.
- Red de múltiples colegios, gemelo digital regional o panel B2G productivo.
- Construcción física de una caja con batería, panel solar y router dedicado.
- Funcionamiento completo del backend cuando el celular pierde la conexión Wi-Fi con el servidor local.

**Definición honesta de “offline”:** durante el piloto, AULA BOX es una computadora local que sirve la aplicación por Wi-Fi. El celular se conecta a esa red y puede usar el sistema aunque no exista internet externo. La PWA conserva su interfaz básica, pero las operaciones que necesitan la base de datos requieren que AULA BOX esté encendida y accesible en la red local.

## 8. Arquitectura funcional

```text
                 SIN INTERNET EXTERNO
                          │
                 Wi-Fi local del colegio
                          │
                  Celular del docente
                          │
                    PWA / navegador
                          │ HTTP en LAN
                          ▼
              ┌─────────────────────────┐
              │        AULA BOX         │
              │  computadora / mini PC │
              ├─────────────────────────┤
              │ Frontend React + Vite   │
              │ Backend FastAPI         │
              │ Base de datos SQLite    │
              │ Servicio de IA opcional │
              └─────────────────────────┘
                 │       │        │
                 ▼       ▼        ▼
              NIVELA  BIBLIOTECA  RADAR
                         │
                         ▼
                Fichas imprimibles A4

       Texto de actividades ──► RADIO AULA (TTS del navegador)

       FUTURO, cuando exista internet:
       actualización de contenidos y sincronización autorizada
       con un servidor remoto.
```

### Componentes

**Frontend:** interfaz responsive para celular y computadora, con navegación sencilla y botones grandes.

**Backend:** API local para almacenar estudiantes, diagnósticos, resultados, materiales y sesiones.

**Base de datos:** SQLite, por ser una base de datos de archivo adecuada para un prototipo local.

**Capa de IA:** proveedor intercambiable. Primero modo demostración/plantillas; opcionalmente Ollama para un modelo local. Un proveedor remoto puede añadirse más adelante, pero no será requisito para que el MVP funcione.

**Modo demostración:** si ningún modelo está disponible, el usuario debe poder completar todo el flujo usando plantillas deterministas. La interfaz debe indicar claramente “Contenido de demostración” para no fingir que una respuesta fue generada por IA.

## 9. Stack tecnológico recomendado

| Capa | Tecnología | Uso |
|---|---|---|
| Frontend | React + TypeScript | Aplicación web |
| Build/dev server | Vite | Desarrollo y compilación |
| Estilos | Tailwind CSS | Diseño responsive |
| Componentes | shadcn/ui o componentes accesibles propios | Formularios, tarjetas, diálogos y navegación |
| Gráficos | Recharts | Visualización de progreso |
| PWA | vite-plugin-pwa + Workbox | Manifest y caché de recursos estáticos |
| Backend | Python + FastAPI | API REST local |
| Validación/modelos | Pydantic / SQLModel | Esquemas y persistencia |
| Base de datos | SQLite | Persistencia en AULA BOX |
| IA local opcional | Ollama API | Conectar un LLM que se ejecute en la computadora local |
| Voz | Web Speech API (`speechSynthesis`) | Leer instrucciones en el dispositivo compatible |
| Pruebas API | FastAPI TestClient / pytest | Pruebas mínimas |
| Control de versiones | Git | Historial del proyecto |

### Decisiones técnicas

- No introducir microservicios, Kubernetes, autenticación compleja ni nube en el MVP.
- No depender de Supabase/Firebase para las funciones esenciales, porque el servidor debe poder operar sin internet.
- Mantener la IA detrás de una interfaz `AIProvider` para cambiar de modo demo a Ollama sin reescribir la aplicación.
- Usar SQLite para el piloto. Si el sistema crece a varias escuelas y sincronización central, evaluar PostgreSQL.
- La IA debe devolver estructuras JSON validadas para sesiones y fichas. Si la respuesta no valida, usar plantilla de respaldo.
- No enviar datos personales de menores a un proveedor externo en el MVP.

## 10. Diseño de los módulos

### 10.1 AULA BOX — Centro local

Responsabilidades:
- Servir el frontend y API dentro de la red local.
- Guardar los datos del colegio en SQLite.
- Mostrar estado del servidor y del proveedor de IA.
- Permitir acceder desde un celular conectado a la misma Wi-Fi.

Pantalla de estado:
- “Servidor local: conectado”.
- “Internet externo: disponible / no disponible / no verificado”.
- “Motor IA: modo demostración / Ollama conectado”.
- “Última copia de seguridad”.

Para la demo, el equipo de desarrollo puede ejecutar el backend y frontend en una laptop. La laptop representa AULA BOX; no es necesario construir una carcasa física.

### 10.2 NIVELA AI — Diagnóstico y agrupación

Flujo:
1. El docente elige un área, competencia y grupo de grados.
2. El sistema presenta entre 5 y 8 preguntas breves de ejemplo.
3. El docente registra la respuesta correcta/incorrecta o ingresa el puntaje de una actividad aplicada en papel.
4. El sistema calcula el puntaje con una regla simple.
5. El sistema muestra un nivel de apoyo orientativo y la evidencia que lo sustenta.
6. El docente puede corregir el registro.

Ejemplo de regla configurable para la demo:
- 0–39 %: requiere acompañamiento prioritario.
- 40–69 %: en desarrollo.
- 70–100 %: desempeño esperado para la actividad aplicada.

Estos umbrales son únicamente parámetros ilustrativos del prototipo; no equivalen a niveles oficiales del Minedu ni permiten comparar grados diferentes sin una rúbrica validada.

Agrupación recomendada:
- Agrupar por competencia y necesidad de apoyo, no solamente por grado.
- Conservar siempre el grado escolar como dato contextual.
- Permitir al docente mover a un estudiante de grupo.
- Mostrar por qué se recomienda cada grupo.

### 10.3 BIBLIOTECA IA — Sesiones y fichas

Entrada del docente:
- área: Comunicación o Matemática para la demo;
- tema;
- grados presentes;
- grupos/niveles de aprendizaje;
- duración;
- recursos disponibles;
- contexto local opcional;
- formato: sesión o ficha.

Salida:
- propósito de la actividad;
- materiales de bajo costo;
- instrucciones breves;
- actividad por grupo;
- 3–5 preguntas o ejercicios;
- respuesta esperada o pauta de revisión;
- adaptación para reforzar o ampliar;
- indicación para imprimir.

La generación puede provenir de Ollama o de una plantilla. El profesor revisa y edita antes de imprimir. No mostrar una etiqueta de “alineado al CNEB” salvo que se incluya una referencia curricular concreta y comprobada.

### 10.4 RADAR EDUCATIVO — Seguimiento

Mostrar:
- total de estudiantes registrados;
- diagnósticos aplicados;
- distribución por nivel de apoyo;
- evolución por competencia;
- estudiantes con resultados pendientes de revisión;
- recomendación de siguiente actividad.

Para un día, usar indicadores descriptivos y reglas explícitas. No implementar un modelo predictivo ni un “riesgo de fracaso escolar”. Evitar semáforos estigmatizantes. Preferir expresiones como “requiere revisión docente” y “conviene reforzar”.

### 10.5 RADIO AULA — Acceso por voz

En la primera versión:
- botón para escuchar el enunciado o las instrucciones de la ficha;
- control reproducir/detener;
- opción de repetir;
- fallback: mostrar el texto completo para lectura del docente.

La disponibilidad y la voz dependen del navegador, sistema operativo y voces instaladas. No prometer que funcionará en todos los equipos ni que será completamente offline en cualquier teléfono. No grabar voces de estudiantes.

## 11. Pantallas necesarias

1. **Inicio / Dashboard:** resumen del aula, estado local, accesos rápidos.
2. **Estudiantes:** tabla con código, grado, grupo actual y último diagnóstico.
3. **Ficha del estudiante:** competencias, resultados y observaciones del docente.
4. **Diagnóstico:** selección de competencia, preguntas, puntuación y resultado.
5. **Grupos de aprendizaje:** agrupación sugerida y edición manual.
6. **Generador de sesión:** formulario con contexto, grados y grupos.
7. **Biblioteca / Materiales:** materiales generados, filtros y acciones de imprimir.
8. **Vista imprimible:** ficha A4 en blanco y negro, con espacio para nombre/código y respuestas.
9. **Radar:** gráficos sencillos y tabla de competencias que conviene reforzar.
10. **Configuración:** escuela, modo IA, estado de red y exportación de datos.

## 12. Datos de demostración

Utilizar datos ficticios, nunca nombres reales de niños. Ejemplo:

| Código | Grado | Competencia demo | Puntaje | Resultado orientativo |
|---|---:|---|---:|---|
| E-001 | 1 | Reconoce números | 35 % | Requiere acompañamiento prioritario |
| E-002 | 1 | Reconoce números | 55 % | En desarrollo |
| E-003 | 2 | Suma cantidades | 80 % | Desempeño esperado para la actividad |
| E-004 | 2 | Suma cantidades | 45 % | En desarrollo |
| E-005 | 3 | Comprensión de textos | 30 % | Requiere acompañamiento prioritario |
| E-006 | 3 | Comprensión de textos | 75 % | Desempeño esperado para la actividad |

Estos datos son sintéticos, solo para mostrar cómo funciona la interfaz. No representan a los estudiantes de Huarín.

## 13. Modelo de datos mínimo

### Student
- `id`: UUID o entero.
- `student_code`: código anónimo, único por escuela.
- `grade`: grado de 1 a 6.
- `classroom_group`: grupo de aula, opcional.
- `active`: booleano.
- `created_at`: fecha/hora.

### Competency
- `id`.
- `area`: Comunicación / Matemática.
- `name`.
- `description`.

### Assessment
- `id`.
- `student_id`.
- `competency_id`.
- `assessment_date`.
- `score`.
- `max_score`.
- `notes`.
- `source`: manual / quiz demo.

### LearningGroup
- `id`.
- `name`.
- `competency_id`.
- `support_level`.
- `description`.

### LearningGroupMember
- `id`.
- `group_id`.
- `student_id`.
- `assigned_by`: rule / teacher.

### GeneratedMaterial
- `id`.
- `title`.
- `area`.
- `topic`.
- `grade_range`.
- `content_json` o `content_markdown`.
- `provider`: demo / ollama.
- `created_at`.

### LessonPlan
- `id`.
- `title`.
- `topic`.
- `duration_minutes`.
- `content_json`.
- `created_at`.

No guardar nombre completo, dirección, fecha de nacimiento, fotografías, grabaciones ni otros datos sensibles en el MVP.

## 14. API mínima

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/health` | Estado del servidor y modo IA |
| GET | `/api/dashboard` | Resumen del aula |
| GET | `/api/students` | Listar estudiantes |
| POST | `/api/students` | Crear estudiante |
| GET | `/api/students/{id}` | Ver ficha del estudiante |
| POST | `/api/assessments` | Registrar diagnóstico/resultado |
| GET | `/api/assessments` | Consultar resultados |
| GET | `/api/groups` | Obtener grupos sugeridos |
| POST | `/api/groups/recalculate` | Recalcular agrupación por reglas |
| POST | `/api/materials/generate` | Generar ficha o actividad |
| GET | `/api/materials` | Listar materiales guardados |
| POST | `/api/lessons/generate` | Generar plan de sesión |
| GET | `/api/radar/summary` | Indicadores de seguimiento |
| GET | `/api/settings/ai` | Estado del proveedor IA |

## 15. Diseño visual y experiencia de usuario

**Concepto visual:** cálido, claro, confiable y práctico. Debe sentirse como una herramienta para docentes, no como un panel técnico.

- Interfaz en español.
- Diseño mobile-first.
- Navegación lateral en escritorio y barra inferior/menú compacto en celular.
- Tipografía legible y tamaños generosos.
- Fondo claro, acentos verde bosque y terracota, sin exceso de colores.
- Botones grandes con verbos: “Registrar diagnóstico”, “Crear ficha”, “Imprimir”, “Escuchar”.
- Evitar tablas demasiado densas en móvil.
- Mostrar siempre estados de conexión y modo IA.
- Todas las pantallas deben incluir estados vacíos, cargando y error.
- La ficha impresa debe ahorrar tinta: fondo blanco, texto negro y sin fotografías decorativas innecesarias.

## 16. Privacidad, seguridad y responsabilidad

- Usar códigos de estudiante en lugar de nombres completos.
- No procesar rostros, huellas, voces ni biometría de menores.
- No usar datos identificables en prompts enviados a modelos externos.
- Mantener la base de datos local durante el piloto.
- Dar al docente control para revisar y corregir resultados.
- Mostrar las reglas de clasificación y no presentar el nivel como diagnóstico definitivo.
- No permitir que la IA asigne calificaciones oficiales, promueva o desapruebe estudiantes.
- Revisar los materiales antes de imprimirlos.
- Guardar copia de seguridad local descargable.
- Para un piloto real, gestionar autorización institucional y los permisos aplicables para tratar información de menores.

---

# PARTE III. EJECUCIÓN EN UN DÍA

## 17. Qué significa “terminado en un día”

Al finalizar la jornada debe existir una demo navegable y ejecutable localmente que complete este recorrido:

1. Abrir AULA RAÍZ desde una computadora o celular conectado a la red local.
2. Ver un dashboard con estudiantes de demostración.
3. Abrir la lista y ficha de un estudiante.
4. Registrar un resultado de diagnóstico.
5. Ver el nivel orientativo y la agrupación recomendada.
6. Generar una ficha diferenciada mediante el modo demo o Ollama.
7. Imprimir o guardar la ficha como PDF.
8. Consultar un panel RADAR actualizado.
9. Escuchar las instrucciones si el navegador admite síntesis de voz.
10. Recargar la aplicación y comprobar que los datos persisten en SQLite.

No se considera terminado si solo existen pantallas estáticas sin guardar datos ni completar el recorrido.

## 18. Cronograma sugerido de 10 horas

| Hora | Trabajo | Entregable |
|---|---|---|
| 08:00–08:30 | Preparar repositorio, entorno y estructura | Proyecto corre localmente |
| 08:30–09:30 | Diseñar layout, navegación y tema visual | Shell responsive |
| 09:30–10:45 | Crear backend, SQLite y datos demo | API y persistencia |
| 10:45–12:00 | Estudiantes y dashboard | CRUD mínimo y resumen |
| 12:00–13:15 | Diagnóstico y reglas NIVELA | Registro de resultados y niveles |
| 13:15–14:00 | Pausa y revisión de integración | Flujo estable |
| 14:00–15:30 | Generador de sesión/fichas | BIBLIOTECA IA + modo demo |
| 15:30–16:15 | Plantilla A4 e impresión | Ficha imprimible |
| 16:15–17:00 | RADAR EDUCATIVO | Gráficos y alertas orientativas |
| 17:00–17:30 | RADIO AULA | Botón escuchar/detener |
| 17:30–18:00 | PWA, pruebas y corrección | Demo local validada |

**Regla de priorización:** si el tiempo se reduce, eliminar primero la integración Ollama y la síntesis de voz; nunca sacrificar persistencia, diagnóstico básico, generación de ficha por plantilla e impresión.

## 19. Criterios de aceptación

- [ ] La aplicación abre sin errores.
- [ ] Se adapta a celular y escritorio.
- [ ] El backend arranca y crea la base SQLite.
- [ ] Hay al menos 12 estudiantes ficticios precargados.
- [ ] Se puede crear y editar un estudiante.
- [ ] Se puede registrar un resultado de diagnóstico.
- [ ] La regla de clasificación se muestra de forma transparente.
- [ ] Se puede generar una ficha aunque no exista conexión a un modelo de IA.
- [ ] La ficha se imprime correctamente en tamaño A4.
- [ ] El dashboard/RADAR refleja los registros guardados.
- [ ] El servidor informa si el proveedor IA está disponible.
- [ ] La interfaz muestra que los datos son locales y que la IA está en modo demo cuando corresponda.
- [ ] Se puede reiniciar la aplicación sin perder los datos.

## 20. Pruebas manuales de demostración

**Prueba A — Sin modelo de IA:** apagar o no instalar Ollama. Generar una ficha. Debe responder el modo plantilla y marcar el material como demostración.

**Prueba B — Sin internet externo:** conectar celular y computadora al mismo router, desconectar el acceso WAN y abrir la app mediante la IP local del servidor. El flujo principal debe continuar.

**Prueba C — Persistencia:** crear un diagnóstico, reiniciar backend y comprobar que aparece en la ficha del estudiante y en Radar.

**Prueba D — Impresión:** imprimir una ficha desde Chrome/Edge usando “Guardar como PDF” y verificar que no se corte el contenido.

**Prueba E — Voz:** activar “Escuchar” en un navegador compatible. Si no hay soporte, el texto sigue visible y la aplicación no falla.

---

# PARTE IV. INSTRUCCIONES PARA EL GENERADOR DE CÓDIGO

## 21. Prompt maestro (copiar y pegar completo)

```text
Actúa como un equipo senior de producto, UX/UI, frontend, backend, IA aplicada y QA. Construye una aplicación funcional llamada AULA RAÍZ: un ecosistema de inteligencia artificial para colegios rurales multigrado.

OBJETIVO
Crear en una sola jornada un MVP demostrable, responsive y local-first. El producto ayuda al docente a registrar estudiantes, diagnosticar competencias, agrupar necesidades de aprendizaje, generar fichas imprimibles y revisar el progreso. NO debe incluir un módulo llamado Profesor IA ni un chatbot que pretenda reemplazar al docente.

CONTEXTO DE USO
La escuela puede tener pocos docentes, varios grados en una misma aula, recursos impresos limitados, conectividad intermitente y tablets que no funcionan. El usuario principal es el docente y normalmente accede desde su celular. No se debe requerir que cada estudiante tenga un dispositivo. La escuela puede tener una computadora local que actúe como servidor AULA BOX y un router Wi-Fi. El sistema debe funcionar sin internet externo mientras el teléfono esté conectado a la red local y el servidor esté encendido.

MÓDULOS OBLIGATORIOS
1. AULA BOX: backend/base de datos local, indicador de estado del servidor, estado de conectividad y estado del motor IA.
2. NIVELA AI: diagnóstico breve, registro de resultados, clasificación explicable por reglas y sugerencia de agrupación por competencia.
3. BIBLIOTECA IA: generación de sesiones y fichas diferenciadas, con plantillas deterministas si no hay modelo conectado.
4. RADAR EDUCATIVO: resumen de avances, resultados por competencia, distribución de niveles de apoyo y elementos que conviene revisar.
5. RADIO AULA: botón para leer instrucciones y contenido mediante speechSynthesis del navegador cuando esté disponible; debe haber fallback visual.

NO INCLUIR
- No crear Profesor IA.
- No crear chat libre para estudiantes.
- No usar reconocimiento facial ni biometría.
- No grabar voces de menores.
- No inventar datos o afirmar que hay IA conectada si se usa una plantilla.
- No implementar predicción de fracaso escolar ni diagnósticos clínicos.
- No depender de Firebase/Supabase/cloud para las operaciones esenciales.
- No crear microservicios ni arquitectura empresarial compleja.

STACK OBLIGATORIO
Frontend: React + TypeScript + Vite.
Estilos: Tailwind CSS. Puedes usar shadcn/ui si el setup no complica la entrega; de lo contrario, crea componentes accesibles propios.
Routing: React Router.
Gráficos: Recharts.
PWA: vite-plugin-pwa con Workbox para cachear el app shell y assets estáticos.
Backend: Python + FastAPI.
Validación/ORM: Pydantic + SQLModel.
Base de datos: SQLite en archivo local.
IA: capa abstracta AIProvider con dos modos: demo (por defecto, sin claves ni internet) y Ollama (opcional por API local). No hagas que Ollama sea requisito para arrancar.
Voz: Web Speech API speechSynthesis en el cliente, con feature detection.

ARQUITECTURA
El celular del docente abre la PWA desde la IP local de la computadora AULA BOX. El frontend llama al backend FastAPI en la misma red local. FastAPI lee/escribe SQLite. La generación de materiales usa AIProvider. En modo demo devuelve contenido didáctico de plantilla y la interfaz debe mostrar “Modo demostración — plantilla local”. En modo Ollama intenta conectarse al endpoint local configurado; si falla, vuelve a modo demo e informa el estado.

ESTRUCTURA DE REPOSITORIO
/ frontend/ (React, Vite, TypeScript, Tailwind, PWA)
/ backend/ (FastAPI, SQLModel, SQLite, AIProvider)
/ README.md (instalación, ejecución, acceso desde celular, limitaciones offline)
/ .env.example

PANTALLAS
1. Dashboard con nombre AULA RAÍZ, escuela demo, tarjetas de resumen, estado AULA BOX y accesos rápidos.
2. Estudiantes: lista con código anónimo, grado, competencia reciente y nivel orientativo. Crear/editar estudiante.
3. Ficha del estudiante: resultados de evaluaciones y competencias.
4. Diagnóstico: elegir estudiante, área, competencia y preguntas; permitir registrar respuestas o puntaje manual.
5. Grupos: mostrar agrupaciones sugeridas por competencia y permitir mover estudiantes manualmente.
6. Biblioteca IA: formulario para área, tema, grados, grupos, duración, contexto local y tipo de material.
7. Vista de sesión/ficha generada: mostrar propósito, materiales, instrucciones, actividades diferenciadas, preguntas y pauta de revisión.
8. Vista de impresión A4: blanco y negro, ahorro de tinta, sin navegación ni botones al imprimir.
9. Radar: gráficos simples con Recharts, resultados por competencia y lista “Conviene reforzar”.
10. Configuración: estado del motor IA, modo demo/Ollama, estado local y exportación de respaldo si es viable.

DISEÑO UX/UI
Todo en español. Visual limpio, moderno, cálido y profesional, inspirado en la educación rural pero sin clichés visuales. Paleta: verde bosque como color principal, terracota como acento, fondos marfil/blanco. Responsive mobile-first. Botones grandes. Navegación sencilla. Evitar dashboards saturados. Incluir skeleton/loading, empty states, errores legibles y confirmaciones. No utilizar datos personales reales. Identificar los registros de ejemplo como ficticios.

REGLAS PEDAGÓGICAS DEL MVP
- Guardar grado y competencia por separado.
- Agrupar por competencia/necesidad de apoyo, no solo por grado.
- Para puntajes de demo, usar umbrales configurables: 0–39% “Requiere acompañamiento prioritario”; 40–69% “En desarrollo”; 70–100% “Desempeño esperado para esta actividad”. Mostrar que son umbrales ilustrativos configurables, no niveles oficiales del Minedu.
- Todo agrupamiento es una sugerencia editable por el docente.
- No llamar “predicción” a una regla.
- No afirmar alineación al CNEB sin referencia concreta validada.
- El docente revisa el material antes de usarlo.

MODELO DE DATOS MÍNIMO
Student(id, student_code, grade, classroom_group, active, created_at)
Competency(id, area, name, description)
Assessment(id, student_id, competency_id, assessment_date, score, max_score, notes, source)
LearningGroup(id, name, competency_id, support_level, description)
LearningGroupMember(id, group_id, student_id, assigned_by)
GeneratedMaterial(id, title, area, topic, grade_range, content_json/content_markdown, provider, created_at)
LessonPlan(id, title, topic, duration_minutes, content_json, created_at)

DATOS DEMO
Precargar por lo menos 12 estudiantes ficticios de grados 1 a 6, varias competencias de Matemática y Comunicación, evaluaciones y materiales de ejemplo. No usar nombres reales; utilizar códigos E-001, E-002, etc. Incluir registros variados para que el dashboard y gráficos no aparezcan vacíos. Etiquetar todos los datos como demostración.

API MÍNIMA
GET /api/health
GET /api/dashboard
GET /api/students
POST /api/students
GET /api/students/{id}
PUT /api/students/{id}
POST /api/assessments
GET /api/assessments
GET /api/groups
POST /api/groups/recalculate
POST /api/materials/generate
GET /api/materials
POST /api/lessons/generate
GET /api/radar/summary
GET /api/settings/ai

IA Y GENERACIÓN
Implementa AIProvider con DemoAIProvider y OllamaAIProvider. DemoAIProvider debe devolver estructuras completas y de buena calidad para una sesión y una ficha, utilizando plantillas parametrizadas por área, tema, grados y niveles. OllamaAIProvider debe ser opcional, configurable por variables de entorno OLLAMA_BASE_URL y OLLAMA_MODEL. Usa el endpoint de chat de Ollama con timeout. Exige una salida JSON validable; si falla, retorna fallback de DemoAIProvider. No expongas secretos en frontend. No pases nombres completos ni datos identificables de estudiantes al LLM.

FICHA IMPRIMIBLE
A4, fondo blanco, tinta mínima, título, área, tema, grado/grupo, instrucciones, ejercicios y espacio para responder. Crear CSS @media print que oculte sidebar, botones y navegación. Añadir botón “Imprimir / Guardar PDF”.

OFFLINE
Usar vite-plugin-pwa para precachear app shell, JS, CSS, iconos y recursos estáticos. Las operaciones de datos requieren la red local hacia AULA BOX. Explicar en README que offline significa sin internet externo, pero con el celular conectado al Wi-Fi local y servidor encendido. No simular sincronización cloud inexistente.

SEGURIDAD Y PRIVACIDAD
Usar códigos anónimos. No capturar audio ni imagen de estudiantes. No crear reconocimiento facial. No enviar datos de menores a la nube. Añadir una nota visible de que es un prototipo y que los materiales y niveles requieren revisión docente. Configurar CORS solo para el entorno de desarrollo/red local necesaria.

CALIDAD Y ENTREGA
- Entregar código real, no solo mockups.
- No dejar botones sin acción; si una función es futura, marcarla “Próximamente” y no presentarla como implementada.
- Comprobar que frontend y backend arrancan siguiendo README.
- Añadir manejo de errores y validaciones.
- Probar crear estudiante, registrar evaluación, generar ficha, imprimir y comprobar Radar.
- Crear .env.example.
- Mantener el proyecto simple y ejecutable en una laptop.
- Prioriza el flujo vertical completo sobre decoraciones.

ORDEN DE IMPLEMENTACIÓN
1. Estructura y setup.
2. Backend SQLite y seed de datos.
3. Dashboard y estudiantes.
4. Diagnóstico NIVELA y agrupación por reglas.
5. BIBLIOTECA IA con demo provider.
6. Vista imprimible.
7. RADAR con datos reales de SQLite.
8. RADIO AULA con speechSynthesis.
9. PWA, estado local, pruebas y README.

Antes de finalizar, entrega un resumen de archivos creados, comandos para ejecutar frontend/backend, URL local, cómo acceder desde otro celular en la misma Wi-Fi, endpoints y limitaciones conocidas. Si no puedes completar algo dentro del tiempo, prioriza un flujo funcional y documenta claramente lo pendiente. No afirmes que una función está terminada si no lo está.
```

## 22. Prompts de continuación para el generador

Usa estos prompts después del prompt maestro, solo si el generador se queda a mitad de camino o necesitas revisar calidad.

### Prompt A — Completar flujo funcional

```text
Revisa el proyecto completo y no te concentres en rediseñar. Ejecuta mentalmente el flujo de extremo a extremo: crear estudiante, registrar diagnóstico, recalcular grupos, generar ficha, guardar, imprimir y visualizar el resultado en Radar. Corrige imports, rutas, tipos, CORS, validaciones y errores de persistencia. No dejes botones decorativos. Mantén el modo demo funcional sin Ollama ni internet.
```

### Prompt B — Mejorar UX de docente

```text
Optimiza la experiencia para un docente que usa un celular Android de gama media y tiene poco tiempo. Reduce pasos, usa textos directos, botones grandes, formularios breves, contraste alto y estados claros. En el Dashboard coloca primero: estudiantes, diagnósticos pendientes, grupos sugeridos y crear ficha. No agregues funcionalidades nuevas ni complejidad.
```

### Prompt C — Probar operación local sin internet

```text
Revisa el despliegue local. El frontend debe compilarse y servirse desde la computadora AULA BOX, y el celular debe acceder por la IP LAN de esa computadora. Asegura que la PWA cachee el app shell y que la API use una URL configurable por entorno, no localhost fijo dentro del navegador del celular. Documenta comandos, puertos, firewall y prueba sin WAN. No afirmes que el backend funciona si AULA BOX está apagada.
```

### Prompt D — Revisión pedagógica y privacidad

```text
Audita el contenido y los textos de la aplicación. Elimina cualquier afirmación de que la IA diagnostica oficialmente, predice fracaso o reemplaza al docente. Los niveles deben llamarse orientativos y las agrupaciones editables. No mostrar nombres de niños en prompts ni enviar datos sensibles a Ollama/cloud. Añade una advertencia de revisión docente a cada material generado.
```

## 23. Comandos de arranque esperados

El generador debe adaptarlos a los archivos reales del proyecto. No asumir que se ejecutan exactamente así si el generador elige otro empaquetado.

### Backend (ejemplo)

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (ejemplo)

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

### Acceso desde un celular

1. Conectar laptop y celular al mismo router Wi-Fi.
2. Obtener la IP local de la laptop (por ejemplo, `192.168.1.20`).
3. Configurar el frontend para llamar a `http://192.168.1.20:8000` o usar un proxy/reverse proxy documentado.
4. Abrir desde el celular la dirección local del frontend.
5. Asegurar que el firewall permita los puertos utilizados.
6. Para probar sin internet, desconectar el acceso WAN del router, pero mantener activo el Wi-Fi local.

Para una demo más simple, el generador puede configurar FastAPI para servir el frontend compilado desde el mismo puerto, reduciendo problemas de CORS y URLs.

## 24. Riesgos y mitigaciones

| Riesgo | Mitigación para el MVP |
|---|---|
| El modelo local no corre por falta de RAM | Modo demo por plantillas, siempre disponible |
| Internet ausente | Servidor local y Wi-Fi LAN; no usar nube en funciones esenciales |
| La IA genera errores | Plantillas, estructura validada y revisión docente |
| Diagnóstico poco confiable | Reglas visibles, evidencia por pregunta y puntaje editable |
| Datos de menores expuestos | Códigos anónimos y sin envío de datos identificables |
| Tiempo insuficiente | Priorizar el flujo principal, diferir integraciones avanzadas |
| La voz no funciona en el teléfono | Texto visible y ficha impresa como alternativa |
| Falla la fotocopiadora | Exportación PDF para imprimir en otro lugar; no es solución total al problema de impresión |

## 25. Próximas etapas después de la demo

1. Validar con el director y dos o más docentes si los diagnósticos, agrupaciones y fichas se ajustan a su trabajo real.
2. Contrastar las actividades con docentes y especialistas curriculares; verificar pertinencia y adecuación al CNEB.
3. Medir tiempo de planificación antes/después y uso real de materiales.
4. Probar AULA BOX en una computadora de bajo consumo con router y respaldo energético.
5. Comparar modelos locales según RAM, velocidad, calidad en español y costo energético.
6. Añadir OCR para analizar fichas fotografiadas, solo después de validar privacidad y precisión.
7. Incorporar sincronización segura con una instancia central para reportes de UGEL, con consentimiento y minimización de datos.
8. Validar materiales en castellano y, donde sea pertinente, lenguas originarias con hablantes competentes.
9. Estudiar despliegue en varias escuelas y un modelo de soporte/mantenimiento.

---

# PARTE V. FUENTES Y SUPUESTOS

## 26. Materiales de referencia del proyecto

1. **Entrevista 01 – Director de primaria rural (Huarín), 30 de octubre de 2026.** Fuente de evidencia cualitativa para la escuela piloto: composición docente, estudiantes, grupos multigrado, conectividad, materiales, tablets y uso de fotocopias.
2. **Primaria multigrado en el Perú: información actualizada 2024–2026.** Documento de contexto sobre acciones del Minedu, normativa, aprendizaje y oportunidades de mejora en educación multigrado.

## 27. Documentación técnica

- Vite – guía de inicio: https://vite.dev/guide/
- FastAPI – bases de datos SQL y SQLModel: https://fastapi.tiangolo.com/tutorial/sql-databases/
- SQLModel – tutorial: https://sqlmodel.tiangolo.com/
- vite-plugin-pwa – documentación: https://vite-pwa-org.netlify.app/
- Ollama – API: https://docs.ollama.com/api

## 28. Supuestos que deben validarse

- La escuela dispone de una computadora o se puede llevar una laptop que actúe temporalmente como AULA BOX.
- El docente cuenta con un celular capaz de conectarse al Wi-Fi local.
- Existe una fuente de energía suficientemente estable para la computadora y el router; panel solar y batería se evaluarán después.
- El docente acepta registrar resultados con códigos anónimos.
- Las fichas generadas son revisadas por el docente antes de aplicarse.
- La entrevista representa la experiencia de una escuela y no permite generalizar automáticamente a todas las escuelas rurales del Perú.

---

## Resumen ejecutivo final

**En un día se debe construir una demo local, no un producto nacional terminado.** El éxito del día consiste en demostrar un flujo real: registrar estudiantes, diagnosticar una competencia, sugerir grupos, generar una ficha diferenciada, imprimirla y observar el resultado en Radar, todo desde una computadora local sin internet externo. AULA BOX representa esa computadora; NIVELA AI, BIBLIOTECA IA, RADAR EDUCATIVO y RADIO AULA son los módulos del MVP. Profesor IA queda eliminado.
