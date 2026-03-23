# schema.md — AM Burguer MVP
# Base de Datos: Estructura de Tablas
# Versión: 0.4 | Motor: Supabase (PostgreSQL)

---

## TABLA 1: `clientes`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | Primary key |
| `nombre` | TEXT | Nombre del cliente |
| `apellido` | TEXT | Apellido del cliente |
| `celular` | TEXT | Identificador único (ej: 3001234567) — se usa para reconocerlo |
| `direccion_habitual` | TEXT | Última dirección usada — se precarga automáticamente |
| `es_cliente_frecuente` | BOOLEAN | Activa flujo de confianza sin pago previo |
| `total_pedidos` | INTEGER | Contador histórico de pedidos — se incrementa automáticamente |
| `ultimo_pedido_en` | TIMESTAMP | Se actualiza automáticamente en cada pedido |
| `creado_en` | TIMESTAMP | Fecha de primer pedido |

> **Reconocimiento de cliente recurrente:** El sistema identifica al cliente por `celular`. Si existe en la tabla, precarga `nombre`, `apellido` y `direccion_habitual` en el formulario. El cliente solo confirma — no vuelve a escribir nada.

---

## TABLA 2: `pedidos`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | Primary key (uso interno del sistema) |
| `numero_pedido` | INTEGER | Consecutivo global, nunca se reinicia. Se muestra como AM-1047 |
| `cliente_id` | UUID | FK → clientes |
| `tipo_entrega` | ENUM | `presencial` / `domicilio` |
| `direccion_entrega` | TEXT | Solo si es domicilio |
| `estado` | ENUM | nuevo / pago_confirmado / en_cocina / listo / en_entrega / entregado |
| `es_prioritario` | BOOLEAN | TRUE si es presencial — sube a la cima de la cola en cocina |
| `pedido_origen` | ENUM | `formulario_cliente` / `caja_rapida` / `whatsapp_manual` |
| `metodo_pago_id` | UUID | FK → metodos_pago |
| `pago_verificado` | BOOLEAN | FALSE permite flujo cocina sin pago (clientes frecuentes) |
| `total` | INTEGER | Valor total en pesos COP |
| `costo_domicilio` | INTEGER | Valor del domicilio al momento del pedido |
| `domiciliario_id` | UUID | FK → domiciliarios |
| `modificado_por_andrea` | BOOLEAN | TRUE si Andrea editó el pedido post-confirmación |
| `hora_creacion` | TIMESTAMP | Cuando el cliente (o Andrea) confirmó |
| `hora_cocina` | TIMESTAMP | Cuando entró a producción |
| `hora_listo` | TIMESTAMP | Cuando cocina marcó listo |
| `hora_entrega` | TIMESTAMP | Cuando domiciliario confirmó entrega |
| `notas` | TEXT | Observaciones del cliente o de Andrea |

### Estados válidos del pedido
```
nuevo → pago_confirmado → en_cocina → listo → en_entrega → entregado
```
> Clientes frecuentes con `pago_verificado = FALSE` saltan de `nuevo` directo a `en_cocina`.
> Pedidos de `caja_rapida` entran con `estado = en_cocina` y `pago_verificado = TRUE` directamente.

---

## TABLA 3: `items_pedido`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | Primary key |
| `pedido_id` | UUID | FK → pedidos |
| `producto_id` | UUID | FK → productos |
| `cantidad` | INTEGER | Unidades del mismo producto |
| `extras` | TEXT | Ej: "extra queso, tocineta doble" |
| `exclusiones` | TEXT | Ej: "sin cebolla, sin lechuga" |
| `precio_unitario` | INTEGER | Precio al momento del pedido (protege historial) |
| `subtotal` | INTEGER | cantidad × precio_unitario |

> `extras` y `exclusiones` son texto libre en el MVP. Si en el futuro se cobra por extras, se crea tabla `extras_catalogo`.

---

## TABLA 4: `productos`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | Primary key |
| `nombre` | TEXT | Ej: "BBQ", "Mr Dog" |
| `categoria` | ENUM | `hamburguesa` / `perro` / `combo` / `bebida` / `especial` |
| `descripcion` | TEXT | Ingredientes |
| `precio` | INTEGER | Precio en COP |
| `disponible` | BOOLEAN | Si está activo en el menú hoy |

---

## TABLA 5: `metodos_pago`
Dinámica. Andrés agrega o desactiva métodos sin tocar código.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | Primary key |
| `nombre` | TEXT | Ej: "Nequi", "Bancolombia", "Efectivo" |
| `instrucciones` | TEXT | Ej: "Nequi al 3001234567 a nombre de Andrea" |
| `activo` | BOOLEAN | Si aparece disponible para el cliente |

### Datos iniciales
| nombre | activo |
|---|---|
| Nequi | TRUE |
| Daviplata / Llave | TRUE |
| Transferencia Bancolombia | TRUE |
| Efectivo | TRUE |

---

## TABLA 6: `domiciliarios`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | Primary key |
| `nombre` | TEXT | Nombre del domiciliario |
| `celular` | TEXT | Identificador para login en su pantalla |
| `activo_hoy` | BOOLEAN | Si está de turno |
| `entregas_hoy` | INTEGER | Contador del día para asignación equitativa |

---

## TABLA 7: `pagos`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | Primary key |
| `pedido_id` | UUID | FK → pedidos |
| `metodo_pago_id` | UUID | FK → metodos_pago |
| `valor` | INTEGER | Monto confirmado |
| `comprobante_url` | TEXT | Foto del comprobante en Supabase Storage |
| `confirmado_por` | TEXT | "andrea" o "sistema" |
| `confirmado_en` | TIMESTAMP | Hora de confirmación |

---

## TABLA 8: `historial_modificaciones`
Auditoría de cambios que Andrea hace sobre pedidos existentes.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | Primary key |
| `pedido_id` | UUID | FK → pedidos |
| `campo_modificado` | TEXT | Ej: "items_pedido", "direccion_entrega" |
| `valor_anterior` | TEXT | Snapshot antes del cambio |
| `valor_nuevo` | TEXT | Snapshot después del cambio |
| `modificado_en` | TIMESTAMP | Hora del cambio |

---

## TABLA 9: `tickets_comanda`
Ticket digital enviado al cliente para seguimiento y reclamos.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID | Primary key |
| `pedido_id` | UUID | FK → pedidos |
| `codigo_ticket` | TEXT | Código corto único. Formato: `AM-1047` |
| `enviado_en` | TIMESTAMP | Hora en que se generó |
| `canal_envio` | TEXT | `whatsapp` / `pantalla` / `impreso` |

---

## TABLA 10: `configuracion`
Parámetros del negocio que Andrés edita desde su panel sin tocar código.

| Campo | Tipo | Notas |
|---|---|---|
| `clave` | TEXT | Primary key. Nombre del parámetro |
| `valor` | TEXT | Valor del parámetro (siempre TEXT, se castea en código) |
| `descripcion` | TEXT | Explicación legible para Andrés |
| `actualizado_en` | TIMESTAMP | Última vez que se modificó |

### Datos iniciales
| clave | valor | descripcion |
|---|---|---|
| `costo_domicilio` | `3000` | Costo fijo del domicilio en pesos COP |
| `horario_apertura` | `17:00` | Hora de apertura del negocio |
| `horario_cierre` | `23:00` | Hora de cierre del negocio |
| `whatsapp_negocio` | `3001234567` | Número de WhatsApp de Andrea |
| `pedidos_minimo_frecuente` | `5` | Número de pedidos para marcar cliente como frecuente |

---

## RELACIONES CLAVE

```
clientes ──< pedidos ──< items_pedido >── productos
                │
                ├──> domiciliarios
                ├──> metodos_pago
                ├──< pagos
                ├──< historial_modificaciones
                └──< tickets_comanda

configuracion (tabla independiente, sin FK)
```

---

## REGLAS DE NEGOCIO CODIFICADAS

| Regla | Cómo se implementa |
|---|---|
| Reconocimiento de cliente recurrente | Buscar `celular` en `clientes` al inicio del formulario — si existe, precargar datos |
| Cliente frecuente pasa a cocina sin pago | `es_cliente_frecuente = TRUE` + `pago_verificado = FALSE` |
| Auto-marcar cliente frecuente | Trigger: cuando `total_pedidos >= configuracion.pedidos_minimo_frecuente`, activar `es_cliente_frecuente = TRUE` |
| Pedido presencial tiene prioridad | `es_prioritario = TRUE` cuando `tipo_entrega = presencial` |
| Pedido de caja rápida va directo a cocina | `pedido_origen = caja_rapida` → `estado = en_cocina` + `es_prioritario = TRUE` automáticamente |
| Equidad en domicilios | Asignar al domiciliario con menor `entregas_hoy` |
| Cronómetro de cocina | `hora_cocina` se registra al cambiar estado a `en_cocina` |
| Resumen cocina | GROUP BY `producto_id` en `items_pedido` donde pedido está `en_cocina` |
| Historial de cliente | `ultimo_pedido_en` y `total_pedidos` se actualizan con trigger en cada pedido |
| Trazabilidad de cambios de Andrea | Toda modificación queda en `historial_modificaciones` |
| Identificación rápida de pedido | Código `AM-XXXX` en `tickets_comanda` |
| Métodos de pago flexibles | Tabla `metodos_pago` — Andrés gestiona sin código |
| Costo domicilio configurable | Leer `configuracion WHERE clave = 'costo_domicilio'` — Andrés lo edita desde su panel |

---

## PANTALLAS DEL SISTEMA Y SU ORIGEN DE PEDIDO

| Pantalla | `pedido_origen` | Usuario | Dispositivo |
|---|---|---|---|
| Formulario del cliente | `formulario_cliente` | Cliente final | Celular del cliente |
| Caja rápida | `caja_rapida` | Andrea | Celular/tablet en el tráiler |
| Panel de Andrea | — (gestión, no captura) | Andrea | Celular o tablet |
| Pantalla de cocina | — (solo lectura) | Cocinera | Tablet fija |
| Pantalla domiciliario | — (solo lectura + confirmación) | Domiciliario | Celular |
| Panel Andrés / cierre | — (solo lectura) | Andrés | Celular |

---

## NOTAS TÉCNICAS — SUPABASE

- Todos los `id` se generan con `gen_random_uuid()` nativo de PostgreSQL
- `numero_pedido` usa una secuencia PostgreSQL (`SEQUENCE`) — nunca se reinicia
- `ultimo_pedido_en` y `total_pedidos` se actualizan con trigger automático al insertar en `pedidos`
- `es_cliente_frecuente` se activa automáticamente cuando `total_pedidos >= pedidos_minimo_frecuente`
- `comprobante_url` apunta a Supabase Storage (bucket privado)
- Row Level Security (RLS) controla qué ve cada rol: Andrea, Cocina, Domiciliario, Andrés
- `configuracion` solo es editable por el rol `admin` (Andrés)