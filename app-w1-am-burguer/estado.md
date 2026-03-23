# Instrucciones del archivo estado 
- Genera el resumen de esta sesión para pegar en el archivo decisions.md
- Documentame los errores y su solución para el archivo errors.md
- Lee el 

# Flujo real de trabajo:
1. Abres chat nuevo (Usuario)
2. Me pegas el contenido de estado.md ("aquí estamos") (Usuario)
3. Trabajamos (AI+Usuario)
4. Al cerrar: me pides el resumen (Usuario)
5. Pegas el resumen en tus archivos (Usuario)
6. Recordar al usuario este flujo al terminar la sesion 

# AM Burguer — Estado del Proyecto
Fecha: [DD/MM/AAAA] - Actualiza la fecha de trabajo

## Dónde estamos
<!-- Una línea: qué fue lo último que hicimos -->

# Ejemplo:
## Pantallas
| Pantalla              | Estado |
|-----------------------|--------|
| Formulario cliente    | ⬜ Pendiente |
| Panel Andrea          | ⬜ Pendiente |
| Pantalla cocina       | ⬜ Pendiente |
| Pantalla domiciliario | ⬜ Pendiente |
| Cierre de caja        | ⬜ Pendiente |

<!-- Estados posibles: ✅ Hecho · 🔨 En progreso · ⬜ Pendiente -->

## Último código trabajado
<!-- Archivo o componente en el que estábamos -->


## Bloqueantes actuales
<!-- Qué no funciona o qué nos detuvo. Si no hay, escribe "Ninguno" -->


## Objetivo de esta sesión
<!-- Qué queremos lograr hoy -->


## Stack actual
<!-- Qué herramientas estamos usando -->


## Links útiles
- App: 
- Base de datos:

# estado.md — AM Burguer MVP
# Estado del Proyecto
# Última actualización: Sesión 1 | Motor: Supabase (PostgreSQL)

---

## RESUMEN EJECUTIVO

El proyecto está en **fase de diseño y prototipado**. La arquitectura de datos está definida, los flujos de negocio están documentados y el primer artefacto visual (Formulario del Cliente) está construido con datos y fotos reales del negocio.

---

## PANTALLAS DEL MVP

| Pantalla | Estado | Notas |
|---|---|---|
| Formulario del cliente | ✅ Prototipo v2 construido | Con fotos reales, precios 2026, personalización |
| Caja Rápida (Andrea - presencial) | 🔴 Pendiente — Sesión 2 | Prioridad alta: es la pantalla más usada en operación |
| Panel de Andrea | ⬜ Pendiente | Depende de Caja Rápida |
| Pantalla de cocina | ⬜ Pendiente | |
| Pantalla del domiciliario | ⬜ Pendiente | |
| Panel de Andrés / Cierre de caja | ⬜ Pendiente | |

---

## ARCHIVOS DEL PROYECTO

| Archivo | Versión | Estado | Ubicación |
|---|---|---|---|
| `schema.md` | v0.4 | ✅ Aprobado | `database/schema.md` |
| `product.md` | v0.3 | ✅ Aprobado | `docs/product.md` |
| `operational_flow.md` | v0.3 | ✅ Aprobado | `context/operational_flow.md` |
| `business_context.md` | v0.1 | ✅ Sin cambios | `context/business_context.md` |
| `technical_context.md` | v0.2 | ✅ Actualizado | `context/technical_context.md` |
| `estado.md` | v0.1 | ✅ Este archivo | `logs/estado.md` |
| `formulario-cliente-v2.html` | v2.0 | ✅ Prototipo listo | `assets/ui_mockups/` |

---

## BASE DE DATOS — TABLAS DEFINIDAS

| Tabla | Estado | Notas |
|---|---|---|
| `clientes` | ✅ Definida | Incluye `total_pedidos` y reconocimiento por celular |
| `pedidos` | ✅ Definida | Incluye `pedido_origen` para distinguir canal |
| `items_pedido` | ✅ Definida | Extras y exclusiones como texto libre |
| `productos` | ✅ Definida | Menú real de AM Burguer con precios 2026 |
| `metodos_pago` | ✅ Definida | Dinámica — Andrés gestiona sin código |
| `domiciliarios` | ✅ Definida | Con celular para login |
| `pagos` | ✅ Definida | Con comprobante_url para Supabase Storage |
| `historial_modificaciones` | ✅ Definida | Trazabilidad completa de cambios de Andrea |
| `tickets_comanda` | ✅ Definida | Código AM-XXXX para seguimiento |
| `configuracion` | ✅ Definida | Costo domicilio, horarios, umbral cliente frecuente |

> ⚠️ Las tablas están definidas en schema.md pero **NO están creadas en Supabase todavía**. Ese paso es Sesión 2 o 3.

---

## DECISIONES TOMADAS

| Decisión | Detalle |
|---|---|
| Motor de base de datos | Supabase (PostgreSQL) — free tier |
| Número de pedido | Consecutivo global, nunca se reinicia. Formato: AM-XXXX |
| Identificación de cliente | Por número de celular — sin cuenta ni contraseña |
| Pantalla presencial | Caja Rápida separada del formulario del cliente |
| Costo domicilio | Configurable por Andrés desde tabla `configuracion` — sin tocar código |
| Cliente frecuente | Auto-marcado cuando `total_pedidos >= 5` (configurable) |
| Extras | Cobran $3.000 c/u — texto libre en MVP |
| Fase 2 | WhatsApp Business API — fuera del MVP actual |

---

## MENÚ REAL — PRECIOS 2026

### Hamburguesas
| Producto | Precio |
|---|---|
| Clásica | $14.000 |
| Doble Carne | $18.000 |
| Burger Pollo | $14.000 |
| BBQ | $19.000 |
| Mex | $19.000 |
| Cheese | $19.000 |
| Pepperoni | $19.000 |

### Perros
| Producto | Precio |
|---|---|
| Hot Dog | $9.000 |
| Mr Dog | $11.000 |
| Choriperro | $11.000 |

### Especiales
| Producto | Precio |
|---|---|
| Salchipapa | $16.000 |
| Mazorcada | $24.000 |
| Choripapa | $24.000 |
| Adición | $3.000 |

### Bebidas y Combos
| Producto | Precio |
|---|---|
| Bebida personal | $3.500 |
| Bebida familiar | $7.000 |
| Papa francesa | $3.000 |
| Combo personal (bebida + papa) | $6.500 |
| Combo Pareja | $38.000 |
| Promo KJ | $68.000 |

---

## PRÓXIMA SESIÓN — SESIÓN 2

### Objetivos
1. **Construir la Caja Rápida** — pantalla de Andrea para pedidos presenciales
2. **Crear las tablas en Supabase** — pasar del diseño a la base de datos real
3. **Conectar el formulario del cliente a Supabase** — primer flujo funcional de extremo a extremo

### Orden sugerido
```
1. Caja Rápida (artefacto visual)
2. Crear proyecto en Supabase + tablas
3. Seed data: productos y configuración inicial
4. Conectar formulario → Supabase (insertar pedido real)
```

---

## RIESGOS IDENTIFICADOS

| Riesgo | Nivel | Mitigación |
|---|---|---|
| Supabase free tier tiene límites de conexiones concurrentes | 🟡 Medio | Suficiente para el MVP (50-70 pedidos/noche) |
| Formulario del cliente no tiene validación de horario | 🟡 Medio | Agregar en Sesión 2 con campo `horario_cierre` de `configuracion` |
| Sin autenticación aún — cualquiera puede abrir el panel de Andrea | 🔴 Alto | Resolver antes de lanzar a producción |
| Reconocimiento de cliente recurrente no está conectado a BD todavía | 🟡 Medio | Está en el prototipo como simulación — se activa al conectar Supabase |