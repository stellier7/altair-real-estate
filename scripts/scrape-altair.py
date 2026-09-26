#!/usr/bin/env python3
"""Scrape listings and details from bienesraicesaltair.com (Wasi)."""

from __future__ import annotations

import json
import re
import html as html_lib
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

BASE = "https://bienesraicesaltair.com"
OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "properties.json"

LISTING_SEEDS: list[tuple[str, str]] = [
    ("for_sale", "apartamento/ventas?id_property_type=2&business_type%5B0%5D=for_sale"),
    ("for_sale", "bodega/ventas?id_property_type=8&business_type%5B0%5D=for_sale"),
    ("for_sale", "casa/ventas?id_property_type=1&business_type%5B0%5D=for_sale"),
    ("for_sale", "casa-de-playa/ventas?id_property_type=24&business_type%5B0%5D=for_sale"),
    ("for_sale", "edificio/ventas?id_property_type=16&business_type%5B0%5D=for_sale"),
    ("for_sale", "finca/ventas?id_property_type=7&business_type%5B0%5D=for_sale"),
    ("for_sale", "local/ventas?id_property_type=3&business_type%5B0%5D=for_sale"),
    ("for_sale", "oficina/ventas?id_property_type=4&business_type%5B0%5D=for_sale"),
    ("for_sale", "terreno/ventas?id_property_type=32&business_type%5B0%5D=for_sale"),
    ("for_rent", "apartamento/alquileres?id_property_type=2&business_type%5B0%5D=for_rent"),
    ("for_rent", "bodega/alquileres?id_property_type=8&business_type%5B0%5D=for_rent"),
    ("for_rent", "casa/alquileres?id_property_type=1&business_type%5B0%5D=for_rent"),
    ("for_rent", "edificio/alquileres?id_property_type=16&business_type%5B0%5D=for_rent"),
    ("for_rent", "local/alquileres?id_property_type=3&business_type%5B0%5D=for_rent"),
    ("for_rent", "oficina/alquileres?id_property_type=4&business_type%5B0%5D=for_rent"),
    ("for_rent", "penthouse/alquileres?id_property_type=21&business_type%5B0%5D=for_rent"),
    ("for_rent", "terreno/alquileres?id_property_type=32&business_type%5B0%5D=for_rent"),
]

URL_RE = re.compile(
    r"https://bienesraicesaltair\.com/([a-z0-9-]+)/(\d+)", re.I
)
JSON_LD_RE = re.compile(
    r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>', re.S
)
LI_STRONG_RE = re.compile(
    r"<li[^>]*>\s*<strong>([^<]+)</strong>\s*([^<]*)", re.I
)
PRICE_RE = re.compile(
    r"<div class=\"areaPrecio\">.*?<span>([^<]+)</span>",
    re.S | re.I,
)
IMAGE_RE = re.compile(r"https://image\.wasi\.co/[^\"'\s>]+")


def fetch(url: str, retries: int = 3) -> str:
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "AltairMigrationBot/1.0 (+github.com/stellier7/altair-real-estate)"},
            )
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except (urllib.error.URLError, TimeoutError) as exc:
            last_err = exc
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"Failed to fetch {url}: {last_err}")


def collect_listing_urls() -> dict[str, str]:
    """Return map property_id -> canonical listing URL."""
    found: dict[str, str] = {}
    for _biz, path in LISTING_SEEDS:
        page = 1
        while True:
            sep = "&" if "?" in path else "?"
            url = f"{BASE}/s/{path}{sep}page={page}"
            body = fetch(url)
            matches = URL_RE.findall(body)
            if not matches:
                break
            new_on_page = 0
            for slug, pid in matches:
                full = f"{BASE}/{slug}/{pid}"
                if pid not in found:
                    found[pid] = full
                    new_on_page += 1
            if new_on_page == 0:
                break
            page += 1
            time.sleep(0.15)
    return found


def strip_html(text: str) -> str:
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    return html_lib.unescape(text).strip()


def parse_detail(url: str, pid: str) -> dict[str, Any]:
    body = fetch(url)
    slug = url.rsplit("/", 1)[0].rsplit("/", 1)[-1]

    ld: dict[str, Any] = {}
    m = JSON_LD_RE.search(body)
    if m:
        try:
            ld = json.loads(m.group(1))
        except json.JSONDecodeError:
            ld = {}

    attrs: dict[str, str] = {}
    for label, value in LI_STRONG_RE.findall(body):
        key = label.strip().rstrip(":").lower()
        val = html_lib.unescape(value.strip())
        if val:
            attrs[key] = val

    price_block = PRICE_RE.search(body)
    price_label = strip_html(price_block.group(1)) if price_block else ""

    images = list(dict.fromkeys(IMAGE_RE.findall(body)))

    business = attrs.get("tipo de negocio", "").lower()
    if "venta" in business:
        listing_type = "sale"
    elif "alquiler" in business:
        listing_type = "rent"
    else:
        listing_type = "unknown"

    name = ld.get("name") or attrs.get("título", slug.replace("-", " "))
    description_html = ld.get("description", "")
    description = strip_html(description_html) if description_html else ""

    if not price_label and description:
        pm = re.search(r"Precio\s*([^\n\r<]+)", description, re.I)
        if pm:
            price_label = pm.group(1).strip().rstrip(".")

    return {
        "id": pid,
        "slug": slug,
        "url": url,
        "title": name.strip(),
        "description": description,
        "descriptionHtml": description_html,
        "listingType": listing_type,
        "propertyType": attrs.get("tipo de inmueble", ""),
        "priceLabel": price_label,
        "country": attrs.get("país", "Honduras"),
        "region": attrs.get("estado / departamento", ""),
        "city": attrs.get("ciudad", ""),
        "condition": attrs.get("estado", ""),
        "bedrooms": attrs.get("alcobas") or ld.get("numberOfRooms"),
        "bathrooms": attrs.get("baños"),
        "garage": attrs.get("garaje"),
        "code": attrs.get("código", pid),
        "coverImage": ld.get("image") or (images[0] if images else ""),
        "images": images,
        "attributes": attrs,
        "schema": ld,
    }


def main() -> None:
    print("Collecting listing URLs…")
    urls = collect_listing_urls()
    print(f"Found {len(urls)} unique properties")

    properties: list[dict[str, Any]] = []
    for i, (pid, url) in enumerate(sorted(urls.items(), key=lambda x: int(x[0]), reverse=True), 1):
        if i % 25 == 0:
            print(f"  Detail {i}/{len(urls)}…")
        try:
            properties.append(parse_detail(url, pid))
        except Exception as exc:
            print(f"  WARN {pid}: {exc}")
        time.sleep(0.12)

    agency = {
        "name": "Bienes Raices Altair",
        "description": (
            "Somos una empresa de Bienes Raices en Tegucigalpa especializados en ventas y rentas "
            "de propiedades comerciales, residenciales e industriales."
        ),
        "logo": "https://images.wasi.co/empresas/b20190828112855.png",
        "address": {
            "street": "Condominios Metropolis, Torre 2, Local 21802",
            "city": "Tegucigalpa",
            "region": "Francisco Morazán",
            "country": "Honduras",
        },
        "phone": "+50422620218",
        "mobile": "+50498002237",
        "email": "ventas@bienesraicesaltair.com",
        "whatsapp": "+50498002237",
        "sourceWebsite": BASE,
        "scrapedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }

    payload = {
        "agency": agency,
        "properties": properties,
        "stats": {
            "total": len(properties),
            "forSale": sum(1 for p in properties if p["listingType"] == "sale"),
            "forRent": sum(1 for p in properties if p["listingType"] == "rent"),
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} ({payload['stats']})")


if __name__ == "__main__":
    main()
