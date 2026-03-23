# decisions.md
## ¿Para qué sirve este archivo?
Registro de las decisiones importantes que se tomaron durante el proyecto y por qué se tomaron.

## ¿Qué va aquí?
- Fecha de la decisión
- Qué se decidió
- Por qué (contexto y razón)
- Quién lo decidió
Ejemplo: '2025-06-01 — Se decidió usar app web en lugar de WhatsApp bot para el MVP porque es más rápido de construir'

# decisions.md — AM Burguer MVP
# Registro de Decisiones del Proyecto

---

## SESIÓN 1

### DEC-001 — Motor de base de datos
**Fecha:** Sesión 1
**Decisión:** Usar Supabase (PostgreSQL) como base de datos
**Razón:** Free tier suficiente para el volumen del MVP, PostgreSQL robusto, Row Level Security nativo, Storage incluido para comprobantes de pago
**Quién decidió:** Product Owner

---

### DEC-002 — Número de pedido global
**Fecha:** Sesión 1
**Decisión:** El `numero_pedido` es un consecutivo global que NUNCA se reinicia
**Razón:** Reiniciarlo cada día crearía colisiones en análisis histórico. El formato AM-XXXX usando los últimos 4 dígitos es legible para Andrea sin perder unicidad
**Alternativa descartada:** Consecutivo diario (1, 2, 3 por noche)

---

### DEC-003 — Identificación de cliente sin cuenta
**Fecha:** Sesión 1
**Decisión:** Los clientes se identifican únicamente por número de celular — sin registro, sin contraseña
**Razón:** Fricción mínima. El cliente no necesita recordar nada. El celular es el identificador natural en un negocio por WhatsApp
**Implicación:** El sistema precarga datos si el celular ya existe en la BD

---

### DEC-004 — Caja Rápida como pantalla separada
**Fecha:** Sesión 1
**Decisión:** La toma de pedidos presenciales en el tráiler se hace desde una pantalla dedicada (Caja Rápida), NO desde el formulario del cliente
**Razón:** El formulario tiene 4 pasos diseñados para una experiencia individual sin presión. Con un cliente parado frente al tráiler, Andrea necesita máximo 3 toques. Son contextos completamente distintos
**Alternativa descartada:** Andrea usa el mismo formulario del cliente

---

### DEC-005 — Costo domicilio configurable
**Fecha:** Sesión 1
**Decisión:** El costo del domicilio vive en la tabla `configuracion` y Andrés lo edita desde su panel sin tocar código
**Razón:** El precio puede cambiar por zona, época o decisión del negocio. No puede depender de un desarrollador para actualizarlo
**Implementación:** Tabla `configuracion` con clave `costo_domicilio`

---

### DEC-006 — Cliente frecuente auto-marcado
**Fecha:** Sesión 1
**Decisión:** Un cliente se marca como frecuente automáticamente cuando `total_pedidos >= 5`
**Razón:** Elimina la tarea manual de Andrea de marcar clientes. El umbral es configurable por Andrés
**Beneficio:** Clientes frecuentes pasan directo a cocina sin verificación de pago

---

### DEC-007 — Extras con costo fijo
**Fecha:** Sesión 1
**Decisión:** Las adiciones/extras cuestan $3.000 c/u (precio del menú real 2026)
**Razón:** El menú real de AM Burguer tiene una línea de "Adiciones" a $3.000. Se respeta ese precio
**Futuro:** Si los extras se vuelven más complejos, se crea tabla `extras_catalogo`

---

### DEC-008 — Pedido de Caja Rápida va directo a cocina
**Fecha:** Sesión 1
**Decisión:** Los pedidos creados desde la Caja Rápida entran con `estado = en_cocina` y `es_prioritario = TRUE` automáticamente, sin pasar por verificación de pago
**Razón:** El cliente está físicamente presente — el pago es en el momento. No tiene sentido una etapa de verificación