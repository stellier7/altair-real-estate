# Bienes Raíces Altair (real-estate-1)

Sitio Next.js para **Bienes Raíces Altair**, con catálogo importado desde [bienesraicesaltair.com](https://bienesraicesaltair.com).

## Desarrollo local

```bash
npm install
python3 scripts/scrape-altair.py   # importa ~500 inmuebles a src/data/properties.json
npm run dev
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `scripts/scrape-altair.py` | Extrae agencia + listados + detalle desde el sitio Wasi |
| `scripts/bootstrap-origin-template.sh` | Clona `santiagotellier/real-estate-template` vía Origin CLI cuando hay `CURSOR_AUTH_TOKEN` |

## Despliegue

Compatible con Vercel (`vercel.json` incluido).
