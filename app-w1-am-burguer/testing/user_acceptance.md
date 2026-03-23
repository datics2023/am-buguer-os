# User Acceptance Tests (UAT) - AM Burguer

## Escenario 1: El Pedido Presencial
- **Acción:** Registrar un pedido tipo 'Presencial' cuando ya hay 3 de 'WhatsApp' en cola.
- **Resultado esperado:** El pedido presencial debe aparecer automáticamente en la cima de la lista de cocina.

## Escenario 2: La Equidad de Domicilios
- **Acción:** El Domiciliario A ha entregado 5 pedidos, el Domiciliario B ha entregado 2.
- **Resultado esperado:** Al Andrea ir a despachar un nuevo pedido, el sistema debe sugerir por defecto al Domiciliario B.

## Escenario 3: Cliente de Confianza
- **Acción:** Crear un pedido y mandarlo a cocina sin marcar como 'Pagado'.
- **Resultado esperado:** El sistema debe permitirlo pero dejar un indicador visual de 'Deuda Pendiente'.