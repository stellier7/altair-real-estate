# Bienes Raíces Altair

Sitio basado en [stellier7/real-estate-template](https://github.com/stellier7/real-estate-template), con el catálogo completo importado desde [bienesraicesaltair.com](https://bienesraicesaltair.com).

## Desarrollo

```bash
npm install
python3 scripts/scrape-altair.py   # actualiza src/data/properties.json
npm run dev
```

## Datos

| Archivo | Contenido |
|---------|-----------|
| `src/data/properties.json` | Agencia + 475 inmuebles (scrape Wasi) |
| `src/content/site/config.ts` | Marca, contacto y navegación |
| `src/lib/properties/map-altair.ts` | Mapeo JSON → modelo del template |

## Despliegue

Ver `docs/DEPLOY-VERCEL.md`. Defina `NEXT_PUBLIC_SITE_URL` con la URL de producción.
