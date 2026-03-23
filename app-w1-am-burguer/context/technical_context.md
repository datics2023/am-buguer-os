# technical_context.md — AM Burguer MVP
# Versión: 0.2

---

## Perfil del proyecto
- **Propietario (Product Owner):** Perfil no técnico — las decisiones técnicas las toma el consultor
- **Prioridad:** Solución de bajo costo (Free Tier) y escalable
- **UX/UI:** Extremadamente intuitiva para entorno de alta presión (cocina, tráiler, movimiento)

---

## Decisiones técnicas tomadas (no re-discutir)

| Decisión | Tecnología | Razón |
|---|---|---|
| Base de datos | **Supabase (PostgreSQL)** | Free tier, RLS nativo, Storage incluido, escalable |
| Frontend | **HTML + CSS + JS vanilla** (MVP) | Sin dependencias, carga rápida en celulares con señal débil |
| Autenticación | Supabase Auth (pendiente implementar) | Nativo en Supabase, sin costo adicional |
| Almacenamiento de comprobantes | Supabase Storage | Bucket privado, integrado con la BD |
| Fase 1 | App web (link compartible) | No requiere instalación, funciona en cualquier celular |
| Fase 2 (futuro) | WhatsApp Business API | Automatización de captura de pedidos |

---

## Arquitectura del sistema (Fase 1 MVP)

```
Cliente (celular)
    ↓ link
Formulario Web (HTML/JS)
    ↓ fetch / supabase-js
Supabase
    ├── PostgreSQL (tablas)
    ├── Storage (comprobantes)
    └── Auth (roles: andrea, cocina, domiciliario, andres)
    ↓ realtime subscriptions
Pantallas internas (Andrea, Cocina, Domiciliario, Andrés)
```

---

## Roles y acceso (Row Level Security)

| Rol | Acceso |
|---|---|
| `cliente` (anónimo) | Solo INSERT en pedidos propios, SELECT productos |
| `andrea` | CRUD pedidos, clientes, pagos |
| `cocina` | SELECT pedidos en_cocina, UPDATE estado a listo |
| `domiciliario` | SELECT pedidos asignados, UPDATE estado a entregado |
| `admin` (Andrés) | SELECT todo, UPDATE configuracion, metodos_pago |

---

## Restricciones técnicas

- Sin app nativa (Play Store / App Store) — solo web
- Sin costo adicional al free tier de Supabase en Fase 1
- Mobile-first — diseñado para pantallas de 390px
- Sin frameworks pesados en MVP — vanilla JS para velocidad de carga
- Imágenes del menú embebidas en base64 en el prototipo — en producción se sirven desde Supabase Storage

---

## Stack confirmado

```
Frontend:   HTML5 + CSS3 + JavaScript (vanilla)
Database:   Supabase — PostgreSQL
Storage:    Supabase Storage (comprobantes + imágenes menú)
Auth:       Supabase Auth
Hosting:    Por definir (opciones: Vercel, Netlify, Supabase Edge — todas free tier)
```