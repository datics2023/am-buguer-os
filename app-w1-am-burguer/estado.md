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
# Última actualización: Sesión 2

## RESUMEN EJECUTIVO
Dos pantallas prototipadas. Flujo de roles definido y corregido.
Siguiente prioridad: Pantalla de Cocina + crear base de datos en Supabase.

## PANTALLAS DEL MVP

| Pantalla | Estado | Notas |
|---|---|---|
| Formulario del cliente | ✅ Prototipo v2 | Con fotos reales, precios 2026, personalización |
| Caja Rápida | ✅ Prototipo v1 | Andrea toma pedidos presenciales — van directo a cocina |
| Pantalla de cocina | 🔴 Pendiente Sesión 3 | Bloqueante: sin esta pantalla el flujo no cierra |
| Panel de Andrea | ⬜ Pendiente | Depende de pantalla cocina |
| Pantalla del domiciliario | ⬜ Pendiente | |
| Panel de Andrés / Cierre de caja | ⬜ Pendiente | |

## ARCHIVOS DEL PROYECTO

| Archivo | Versión | Estado |
|---|---|---|
| schema.md | v0.4 | ✅ Aprobado |
| estado.md | v0.2 | ✅ Este archivo |
| formulario-cliente-v2.html | v2.0 | ✅ Prototipo listo |
| caja-rapida-v1.html | v1.0 | ✅ Prototipo listo |

## DECISIONES TOMADAS

| # | Decisión |
|---|---|
| DEC-001 | Supabase como motor de base de datos |
| DEC-002 | Número de pedido consecutivo global, formato AM-XXXX |
| DEC-003 | Cliente se identifica por número de celular |
| DEC-004 | Caja Rápida como pantalla separada del formulario |
| DEC-005 | Costo domicilio configurable desde tabla configuracion |
| DEC-006 | Cliente frecuente auto-marcado al llegar a 5 pedidos |
| DEC-007 | Extras cuestan $3.000 c/u |
| DEC-008 | Pedido de Caja Rápida va directo a en_cocina |
| DEC-009 | Andrea NO puede marcar listo — solo la cocinera puede |

## ROLES Y ACCIONES POR PANTALLA

| Pantalla | Quién | Puede hacer |
|---|---|---|
| Formulario cliente | Cliente | Crear pedido |
| Caja Rápida | Andrea | Crear pedido presencial, confirmar entrega |
| Pantalla cocina | Cocinera | Ver comandas, marcar listo |
| Pantalla domiciliario | Domiciliario | Ver pedidos listos, confirmar entrega |
| Panel Andrés | Andrés | Ver resumen del día, cierre de caja |

## PRÓXIMA SESIÓN — SESIÓN 3

### Orden sugerido
1. Pantalla de Cocina (cocinera marca listo → Andrea recibe notificación)
2. Crear proyecto en Supabase + tablas
3. Seed data: productos y configuración inicial

## RIESGOS IDENTIFICADOS

| Riesgo | Nivel | Mitigación |
|---|---|---|
| Sin autenticación — cualquiera puede abrir cualquier pantalla | 🔴 Alto | Resolver antes de producción |
| Ninguna pantalla conectada a BD todavía | 🟡 Medio | Sesión 3 |
| Formulario cliente sin validación de horario | 🟡 Medio | Agregar con campo horario_cierre de configuracion |
