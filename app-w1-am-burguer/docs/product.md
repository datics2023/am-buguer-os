# product.md

# Guia para proyectos nuevos

## 1. Definición del Problema (The "Pain")
* ¿Qué proceso manual o ineficiente se está intentando eliminar?
* ¿Qué pasa si este problema NO se resuelve hoy?
* ¿Cuál es el "momento de frustración" más crítico del usuario actual?

## 2. Propuesta de Valor (The "Gain")
* ¿Qué hace que esta app sea mejor que un cuaderno o un Excel?
* ¿Cuál es la funcionalidad "estrella" que define el éxito del MVP?

## 3. Perfil del Usuario (User Personas)
* **Usuario A:** [Nombre/Rol] - ¿Cuál es su nivel de habilidad tecnológica? ¿En qué entorno físico usará la app (oficina, calle, cocina)?
* **Usuario B:** [Nombre/Rol] - ¿Qué información necesita ver de un solo vistazo?

## 4. Reglas de Negocio "Invisibles"
* ¿Qué excepciones ocurren con frecuencia? (Ej: devoluciones, cancelaciones, falta de stock).
* ¿Qué datos NO pueden ser vistos por ciertos roles?

## 5. Criterios de Éxito del MVP
* Definir 3 acciones que, si funcionan, significan que la app es productiva.

## ¿Para qué sirve este archivo?
Aquí describes QUÉ es el producto: su propósito, a quién va dirigido y qué problema resuelve.
Es el punto de partida antes de escribir cualquier código.

## ¿Qué va aquí?
- Nombre y descripción del producto
- Problema que resuelve
- Usuario principal
- Funcionalidades clave del MVP


# product.md — AM Burguer MVP
# Versión: 0.3

---

## Propósito
Digitalizar la cadena de valor de un tráiler de comida rápida para eliminar el uso de cuadernos y comandas físicas, permitiendo una transición fluida entre la toma del pedido y la entrega final.

## Problema que resuelve
- **Caos Operativo:** Pérdida de pedidos por toma manual en WhatsApp/Cuaderno.
- **Opacidad de Tiempos:** Desconocimiento del tiempo real de preparación en cocina.
- **Inequidad en Domicilios:** Distribución manual y subjetiva de entregas entre motorizados.
- **Fuga de Información:** Dificultad para conciliar ventas diarias y gestionar inventarios.
- **Fricción para clientes frecuentes:** Un cliente que pide todos los días no debería volver a escribir su nombre y dirección cada vez.

## Usuarios del sistema

| Usuario | Rol | Pantalla principal |
|---|---|---|
| Cliente final | Hace su pedido | Formulario del cliente (link) |
| Andrea | Operadora general | Panel de Andrea + Caja Rápida |
| Cocinera | Prepara pedidos | Pantalla de cocina |
| Domiciliario | Entrega pedidos | Pantalla del domiciliario |
| Andrés | Administrador y analítica | Panel de Andrés / Cierre de caja |

---

## Funcionalidades del MVP

### 1. Formulario del cliente (link compartible)
El cliente abre el link por WhatsApp o Instagram, construye su pedido, elige entrega y paga.

**Flujo cliente nuevo:**
celular → nombre/apellido → menú → personalización → tipo entrega → método pago → confirmar

**Flujo cliente recurrente (ya existe en base de datos):**
celular → sistema reconoce → datos precargados → menú → confirmar
> 2 pasos menos. La experiencia mejora con cada pedido.

### 2. Caja Rápida (pantalla de Andrea para pedidos presenciales)
Pantalla separada, diseñada para levantar un pedido en 3 toques cuando el cliente está parado frente al tráiler.

**Características:**
- Botones grandes por producto, sin scroll innecesario
- No requiere datos del cliente (anónimo o nombre rápido)
- El pedido entra directo a cocina con prioridad alta
- Método de pago: efectivo por defecto (ajustable)
- Se registra como `pedido_origen = caja_rapida`

**Por qué es una pantalla separada y no el formulario del cliente:**
El formulario del cliente tiene 4 pasos pensados para una persona sola en su celular. La caja rápida tiene 1 paso pensado para Andrea parada frente a un cliente. Son contextos de uso completamente distintos.

### 3. Panel de Andrea
Gestión de todos los pedidos entrantes (formulario + caja rápida + WhatsApp manual).
- Vista de pedidos por estado
- Confirmación de pago
- Edición de pedidos post-confirmación (con trazabilidad)
- Asignación de domiciliarios

### 4. Pantalla de cocina
Solo lectura. Muestra comandas con resumen de ingredientes.
- Resumen: "5 carnes para 5 comandas en cola"
- Cronómetro por pedido
- Sin precios ni datos del cliente

### 5. Pantalla del domiciliario
- Login por número de celular
- Pedidos listos asignados
- Confirmar recogida y entrega

### 6. Panel de Andrés / Cierre de caja
- Resumen del día: ventas, ticket promedio, productos más vendidos
- Configuración del negocio: costo domicilio, métodos de pago, horarios
- Solo lectura de operación

---

## Criterios de éxito del MVP
1. Andrea puede levantar un pedido presencial en menos de 30 segundos desde la Caja Rápida
2. Un cliente recurrente puede hacer un pedido en menos de 60 segundos (datos precargados)
3. Cocina nunca pierde una comanda — todo lo que entra al sistema llega a la pantalla de cocina

---

## Decisiones tomadas (no re-discutir)
- **Fase 1:** App web, no app nativa, no WhatsApp bot
- **Fase 2 (futuro):** WhatsApp Business API para captura automática
- **Base de datos:** Supabase (PostgreSQL, free tier)
- **Número de pedido:** Consecutivo global, nunca se reinicia
- **Identificación cliente:** Por número de celular, sin cuenta ni contraseña