"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { propertyTypes } from "@/lib/properties";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const tipo = params.get("tipo") ?? "todos";
    const tipoInmueble = params.get("tipoInmueble") ?? "all";
    const sp = new URLSearchParams();
    if (tipo !== "todos") sp.set("tipo", tipo);
    if (tipoInmueble !== "all") sp.set("tipoInmueble", tipoInmueble);
    if (query.trim()) sp.set("q", query.trim());
    router.push(`/propiedades?${sp.toString()}`);
  }

  const tipo = params.get("tipo") ?? "todos";
  const tipoInmueble = params.get("tipoInmueble") ?? "all";
  const types = propertyTypes();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end">
      <label className="flex flex-1 flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Buscar</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zona, título, ciudad…"
          className="rounded-xl border border-slate-200 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm md:w-40">
        <span className="font-medium text-slate-700">Negocio</span>
        <select
          className="rounded-xl border border-slate-200 px-3 py-2"
          value={tipo}
          onChange={(e) => {
            const sp = new URLSearchParams(params.toString());
            sp.set("tipo", e.target.value);
            router.push(`/propiedades?${sp.toString()}`);
          }}
        >
          <option value="todos">Todos</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm md:w-48">
        <span className="font-medium text-slate-700">Tipo de inmueble</span>
        <select
          className="rounded-xl border border-slate-200 px-3 py-2"
          value={tipoInmueble}
          onChange={(e) => {
            const sp = new URLSearchParams(params.toString());
            sp.set("tipoInmueble", e.target.value);
            router.push(`/propiedades?${sp.toString()}`);
          }}
        >
          <option value="all">Todos</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-800"
      >
        Buscar
      </button>
    </form>
  );
}
