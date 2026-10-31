# AULA RAÍZ

Ecosistema de inteligencia artificial para colegios rurales multigrado. MVP local-first:
el docente registra estudiantes, diagnostica competencias, agrupa necesidades de
aprendizaje, genera fichas diferenciadas imprimibles y da seguimiento al avance, todo
desde una computadora local (**AULA BOX**) accesible por Wi-Fi, sin requerir internet
externo.

> No incluye un modulo "Profesor IA" ni chat libre para estudiantes. La IA apoya al
> docente; no reemplaza su criterio pedagogico.

## Estructura del repositorio

```
/backend    FastAPI + SQLModel + SQLite + AIProvider (demo / Ollama)
/frontend   React + TypeScript + Vite + Tailwind + PWA
```

## 1. Ejecucion local (modo AULA BOX — recomendado para el piloto)

### Backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env     # Windows: copy .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Al arrancar, el backend crea `backend/aula_raiz.db` (SQLite) y precarga 12 estudiantes
de demostracion, competencias, evaluaciones y un material de ejemplo, **solo si la base
esta vacia** (no se duplican datos en reinicios posteriores).

Verificar: abrir `http://localhost:8000/api/health` → debe responder `{"status":"ok",...}`.
Documentacion interactiva de la API: `http://localhost:8000/docs`.

### Frontend (desarrollo)

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Abrir `http://localhost:5173`. El servidor de desarrollo de Vite ya tiene un proxy
configurado (`vite.config.ts`) que redirige `/api/*` hacia `http://127.0.0.1:8000`, asi
que no es necesario configurar variables de entorno para probar en la misma maquina.

### Modo recomendado para la demo: un solo puerto

Para evitar cualquier problema de CORS o de URLs al acceder desde el celular del
docente, compila el frontend y deja que FastAPI lo sirva desde el mismo puerto:

```bash
cd frontend
npm run build          # genera frontend/dist

cd ../backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

`backend/app/main.py` detecta `frontend/dist` y monta ahi el frontend compilado. Con
esto, **todo** (interfaz + API) se sirve desde `http://<IP-de-AULA-BOX>:8000`.

## 2. Acceso desde el celular del docente (sin internet externo)

1. Conectar la laptop (AULA BOX) y el celular al mismo router Wi-Fi.
2. En la laptop, obtener su IP local:
   - Windows: `ipconfig` → buscar "Direccion IPv4" (ej. `192.168.1.20`).
   - macOS/Linux: `ifconfig` o `ip addr`.
3. En el celular, abrir el navegador y entrar a `http://192.168.1.20:8000`
   (ajustar la IP real).
4. Verificar que el firewall de la laptop permita conexiones entrantes al puerto 8000.
5. **Prueba sin internet:** desconectar el acceso WAN del router (dejando el Wi-Fi
   local activo) y confirmar que la aplicacion sigue funcionando igual. Esta es la
   definicion real de "offline" en este MVP: sin internet externo, pero con AULA BOX
   encendida y el celular conectado a su red local.

Si se ejecuta el frontend con `npm run dev` en un puerto distinto (5173) en vez del
modo de un solo puerto, define `VITE_API_BASE_URL` en `frontend/.env` apuntando a la
IP LAN del backend (ver `frontend/.env.example`), porque el celular no puede resolver
`localhost` como la laptop.

## 3. Motor de IA: demo vs Ollama

Por defecto, `AI_PROVIDER=demo` (backend/.env). En este modo, BIBLIOTECA IA genera
fichas y sesiones mediante plantillas deterministas, sin internet ni modelo instalado.
La interfaz y el contenido generado indican explicitamente "Contenido de demostracion".

Para usar un modelo real corriendo localmente:

1. Instalar [Ollama](https://ollama.com) en la misma red/maquina.
2. Descargar un modelo con soporte de español, por ejemplo: `ollama pull llama3.1`
3. En `backend/.env`:
   ```
   AI_PROVIDER=ollama
   OLLAMA_BASE_URL=http://127.0.0.1:11434
   OLLAMA_MODEL=llama3.1
   ```
4. Reiniciar el backend. Si Ollama no responde o la respuesta no es JSON valido, el
   sistema retorna automaticamente al modo demo para esa generacion (no rompe el flujo).

Ollama **no es requisito** para que el MVP funcione de principio a fin.

## 4. Pruebas manuales sugeridas (ver tambien el documento de planeamiento, seccion 20)

- Generar una ficha con `AI_PROVIDER=demo` (sin Ollama) y confirmar que se marca como
  demostracion.
- Desconectar el WAN del router y confirmar que el flujo completo sigue funcionando
  dentro de la red local.
- Crear un diagnostico, reiniciar el backend y confirmar que persiste (SQLite).
- Imprimir una ficha desde Chrome/Edge ("Guardar como PDF") y revisar que no se corte
  el contenido en A4.
- Activar "Escuchar" (RADIO AULA) en un navegador compatible; en uno que no lo soporte,
  debe seguir mostrando el texto sin fallar.

## 5. Endpoints principales

| Metodo | Ruta | Funcion |
|---|---|---|
| GET | `/api/health` | Estado del servidor y modo IA |
| GET | `/api/dashboard` | Resumen del aula |
| GET/POST | `/api/students` | Listar / crear estudiantes |
| GET/PUT | `/api/students/{id}` | Ver / actualizar un estudiante |
| GET | `/api/students/{id}/assessments` | Evaluaciones de un estudiante |
| GET | `/api/competencies` | Listar competencias |
| GET/POST | `/api/assessments` | Consultar / registrar diagnosticos |
| GET | `/api/assessments/rule` | Explicacion de la regla de clasificacion |
| GET | `/api/groups` | Grupos sugeridos |
| POST | `/api/groups/recalculate` | Recalcular agrupacion por reglas |
| POST | `/api/groups/move` | Mover un estudiante de grupo manualmente |
| GET/POST | `/api/materials` `/api/materials/generate` | Fichas generadas |
| GET/POST | `/api/lessons` `/api/lessons/generate` | Sesiones generadas |
| GET | `/api/radar/summary` | Indicadores de seguimiento |
| GET | `/api/settings/ai` | Estado del proveedor de IA |

## 6. Despliegue de un demo publico (Vercel + Render)

Este modo es **solo para mostrar el prototipo en internet** (por ejemplo a un jurado o
a un aliado). No reemplaza el despliegue local en AULA BOX, que es el que debe usarse
en la escuela real sin depender de internet.

### Backend en Render

1. Subir este repositorio a GitHub.
2. En [Render](https://render.com) → "New Web Service" → conectar el repo → carpeta
   raiz del servicio: `backend`.
3. Render puede leer `backend/render.yaml` (Blueprint) o configurarse manualmente:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Variable de entorno `CORS_ORIGINS`: la URL que te asigne Vercel (paso siguiente),
     por ejemplo `https://aula-raiz.vercel.app`.
4. Al desplegar, Render entrega una URL publica, por ejemplo
   `https://aula-raiz-backend.onrender.com`.

El plan gratuito de Render usa disco efimero (se reinicia en cada redeploy o tras
inactividad prolongada). Como el backend siembra datos demo automaticamente si la base
esta vacia, el demo nunca se muestra roto: en el peor caso, vuelve a los 12 estudiantes
de ejemplo.

### Frontend en Vercel

1. En [Vercel](https://vercel.com) → "Add New Project" → importar el mismo repo →
   Root Directory: `frontend`.
2. Vercel detecta Vite automaticamente (`vercel.json` ya incluido fija
   `npm run build` / `dist`).
3. Agregar la variable de entorno `VITE_API_BASE_URL` con la URL del backend en Render
   (ej. `https://aula-raiz-backend.onrender.com`).
4. Desplegar. Vercel entrega una URL publica, por ejemplo
   `https://aula-raiz.vercel.app`.
5. Volver a Render y actualizar `CORS_ORIGINS` con esa URL exacta de Vercel, para que
   el backend acepte peticiones del frontend desplegado.

No se requiere Supabase, Firebase ni ninguna base de datos externa para este demo
publico: sigue usando SQLite dentro del contenedor de Render.

## 7. Limitaciones conocidas

- "Offline" significa sin internet externo, pero con el celular conectado a la red
  Wi-Fi local y AULA BOX encendida. Si AULA BOX se apaga, el backend no responde.
- RADIO AULA depende de que el navegador/sistema operativo tenga sintesis de voz
  (`speechSynthesis`) y voces en español instaladas; no esta garantizado en todos los
  equipos.
- Los niveles de apoyo son reglas simples y transparentes, no diagnosticos clinicos ni
  niveles oficiales del Minedu.
- El modo demostracion de IA usa plantillas, no un modelo entrenado; Ollama es opcional.
- El demo publico en Vercel/Render usa datos ficticios y disco efimero; no debe usarse
  para datos reales de estudiantes.
- No hay autenticacion de usuarios en este MVP (pensado para un solo docente/escuela
  en su red local).

## 8. Privacidad

- Los estudiantes se identifican con codigos anonimos (`E-001`, `E-002`, ...), nunca
  nombres completos.
- No se captura audio, imagenes ni biometria de estudiantes.
- No se envian datos identificables a Ollama ni a ningun proveedor externo.
- Los materiales y niveles generados deben ser revisados por el docente antes de
  aplicarse; la interfaz lo recuerda explicitamente.
