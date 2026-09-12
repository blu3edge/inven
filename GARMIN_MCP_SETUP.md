# Configuración del MCP de Garmin

Guía para conectar [Taxuspt/garmin_mcp](https://github.com/Taxuspt/garmin_mcp) a un cliente MCP
(Claude Desktop, Codex, etc.).

## Requisitos

- Python 3.12+
- `uv` / `uvx` ([instalación](https://docs.astral.sh/uv/getting-started/installation/))
- Cuenta de Garmin Connect (con código MFA a mano si lo tienes activado)

> El paquete **no está publicado en PyPI**: se instala directamente desde el repositorio de GitHub.
> `pip install garmin-mcp` no funciona.

## Paso 1 — Autenticarse una sola vez

```bash
uvx --python 3.12 --from git+https://github.com/Taxuspt/garmin_mcp garmin-mcp-auth
```

Te pedirá email, contraseña y código MFA (si aplica). Los tokens OAuth quedan guardados en
`~/.garminconnect`, así que la contraseña no vuelve a hacer falta.

Verificar que las credenciales siguen siendo válidas:

```bash
uvx --python 3.12 --from git+https://github.com/Taxuspt/garmin_mcp garmin-mcp-auth --verify
```

## Paso 2 — Configurar el cliente MCP

Claude Desktop:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "garmin": {
      "command": "uvx",
      "args": [
        "--python",
        "3.12",
        "--from",
        "git+https://github.com/Taxuspt/garmin_mcp",
        "garmin-mcp"
      ]
    }
  }
}
```

**No pongas `GARMIN_EMAIL` ni `GARMIN_PASSWORD` en la configuración.** El servidor usa los tokens
guardados en el paso 1; mantener la contraseña fuera del archivo de configuración es más seguro.

## Paso 3 — Reiniciar el cliente

Al reiniciar, las herramientas de Garmin quedan disponibles.

## Reducir el número de herramientas

El servidor registra 110+ herramientas, lo que consume bastante contexto. Se puede filtrar:

| Variable | Efecto |
|---|---|
| `GARMIN_ENABLED_TOOLS` | Lista blanca — solo se registran estas. |
| `GARMIN_DISABLED_TOOLS` | Lista negra — se omiten estas (se ignora si hay lista blanca). |

```json
"env": {
  "GARMIN_ENABLED_TOOLS": "list_activities,get_activity,get_sleep_data,get_stress_data"
}
```

Los nombres no distinguen mayúsculas. Un nombre que no coincida con ninguna herramienta se ignora
con un aviso por stderr.

## Categorías de herramientas

| Categoría | Nº | Contenido |
|---|---|---|
| Activity Management | 20 | Listar, detallar y editar actividades |
| Health & Wellness | 33 | Pasos, FC, sueño, estrés, respiración |
| Training & Performance | 13 | Estado de entrenamiento, CTL/ATL/TSB, HRV, VO2 max |
| Workouts | 8 | Entrenamientos y planes |
| Devices | 7 | Dispositivos vinculados |
| Gear Management | 5 | Equipamiento y notas |
| Weight Tracking | 5 | Peso y composición corporal |
| Challenges & Badges | 10 | Retos e insignias |
| Nutrition | 9 | Registro de comidas e ingesta |
| Women's Health | 3 | Ciclo menstrual y embarazo |
| User Profile | 3 | Perfil de usuario |
| Courses | 5 | Rutas, subida/descarga de GPX |
| Activity Analysis | 2 | Análisis FIT, curva de potencia |
| File Downloads | 2 | Descarga en FIT, GPX, TCX, CSV |

La lista exacta de nombres está en el README del repositorio original.

## Notas

- **Descargas de archivos:** `download_activity_file` pide un directorio la primera vez; se fija con
  `set_fit_download_dir` o con la variable `GARMIN_FIT_DOWNLOAD_DIR`.
- **Varias cuentas:** un proceso del servidor se vincula a una sola cuenta. Para varias, ejecuta una
  instancia por cuenta con su propio `GARMINTOKENS`.
- **Análisis de ciclismo:** las herramientas de análisis avanzado requieren medidor de potencia y/o
  cambio electrónico Di2/eTap.

## Referencias

- MCP server: https://github.com/Taxuspt/garmin_mcp
- Librería subyacente: https://github.com/cyberjunky/python-garminconnect
- Protocolo MCP: https://modelcontextprotocol.io
