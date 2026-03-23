# operational_flow.md
## ¿Para qué sirve este archivo?
Describe paso a paso cómo opera el negocio en un día normal, desde que llega un pedido hasta que se entrega.

## ¿Qué va aquí?
- Flujo completo del pedido
- Estados del pedido: nuevo → en cocina → listo → en entrega → entregado
- Quién hace qué en cada paso (Andrea, cocinera, domiciliario)

# operational_flow.md — AM Burguer MVP
# Versión: 0.3

---

## Flujos de captura de pedido

El sistema tiene 3 formas de entrar un pedido. Todas convergen en la misma cola de cocina.

| Canal | Quién lo usa | Pantalla | `pedido_origen` |
|---|---|---|---|
| Link formulario | Cliente desde su celular | Formulario del cliente | `formulario_cliente` |
| Caja rápida | Andrea en el tráiler | Caja Rápida | `caja_rapida` |
| WhatsApp manual | Andrea recibe pedido por chat | Panel de Andrea (entrada manual) | `whatsapp_manual` |

---

## Flujo 1: Cliente nuevo (formulario)

```
1. Cliente abre el link (WhatsApp / Instagram)
2. Ingresa su celular
   → Sistema NO lo reconoce → flujo completo
3. Ingresa nombre y apellido
4. Selecciona productos y personaliza
5. Elige tipo de entrega (presencial / domicilio)
   → Si domicilio: ingresa dirección
6. Ingresa método de pago
7. Confirma pedido
8. Recibe código AM-XXXX en pantalla
9. Pedido entra como estado: nuevo
10. Andrea verifica pago → cambia a pago_confirmado → en_cocina
```

---

## Flujo 2: Cliente recurrente (formulario)

```
1. Cliente abre el link
2. Ingresa su celular
   → Sistema LO RECONOCE → precarga nombre, apellido y dirección habitual
3. Cliente confirma o modifica los datos precargados
4. Selecciona productos (puede repetir pedido anterior en el futuro)
5. Confirma
6. Si es cliente frecuente (es_cliente_frecuente = TRUE):
   → Pedido entra directo a en_cocina sin esperar verificación de pago
   → Andrea ve una etiqueta "Cliente frecuente" en el panel
```

> **Regla:** El sistema marca a un cliente como frecuente automáticamente cuando `total_pedidos >= 5` (valor configurable por Andrés).

---

## Flujo 3: Pedido presencial — Caja Rápida

```
1. Cliente llega al tráiler y hace su pedido verbalmente
2. Andrea abre la Caja Rápida en su celular/tablet
3. Toca los productos que el cliente pide (máx 3 toques)
4. Opcionalmente agrega nombre del cliente
5. Confirma — el pedido entra DIRECTO a en_cocina con prioridad alta
6. No requiere verificación de pago (se paga en el momento)
```

> **Por qué no usa el formulario del cliente:** El formulario tiene 4 pasos para una experiencia individual y sin presión. La caja rápida tiene 1 paso para una operación de alta velocidad con un cliente esperando.

---

## Flujo 4: Estados del pedido (todos los canales)

```
nuevo
  ↓ (Andrea confirma pago, o cliente frecuente automático)
pago_confirmado
  ↓ (Andrea envía a cocina, o automático si es frecuente/caja rápida)
en_cocina  ← cronómetro inicia aquí (hora_cocina)
  ↓ (cocinera marca listo)
listo  ← Andrea ve en su panel
  ↓ (Andrea asigna domiciliario, o cliente recoge)
en_entrega  ← solo si es domicilio
  ↓ (domiciliario confirma entrega)
entregado
```

### Prioridad en la cola de cocina
Los pedidos se muestran en cocina ordenados así:
1. Primero: `es_prioritario = TRUE` (presenciales y caja rápida)
2. Segundo: orden por `hora_cocina` (más antiguo primero)

---

## Flujo 5: Despacho y equidad de domiciliarios

```
1. Pedido llega a estado "listo"
2. Andrea ve en su panel los pedidos listos para despacho
3. El sistema sugiere el domiciliario con menor entregas_hoy
4. Andrea confirma la asignación
5. El domiciliario ve el pedido en su pantalla
6. Domiciliario confirma recogida → estado: en_entrega
7. Domiciliario confirma entrega → estado: entregado
```

---

## Flujo 6: Modificación de pedido por Andrea

```
1. Cliente pide cambio después de confirmar
2. Andrea entra al pedido en su panel y edita
3. Sistema registra en historial_modificaciones:
   - campo modificado
   - valor anterior
   - valor nuevo
   - timestamp
4. Campo modificado_por_andrea = TRUE en el pedido
5. Si el pedido ya estaba en cocina → cocina ve la comanda actualizada
```

---

## Reglas de operación

| Regla | Descripción |
|---|---|
| Pedido presencial = prioridad | Siempre encabeza la cola de cocina |
| Cliente frecuente = confianza | Pasa directo a cocina sin esperar pago |
| Caja rápida = directo a cocina | Sin pasos intermedios, pago en el momento |
| Equidad de domicilios | Sistema sugiere al de menor carga del día |
| Costo domicilio | Se lee de `configuracion` — Andrés lo actualiza cuando quiera |
| Horario | Sistema puede mostrar mensaje de "cerrado" fuera del horario configurado |