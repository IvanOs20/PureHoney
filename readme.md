# Pure Honey — Landing Page de Conversión

Una plataforma web de aterrizaje (Landing Page) optimizada y diseñada exclusivamente para la comercialización de miel 100% pura y natural en la región de Orizaba, Veracruz. El sitio web equilibra una experiencia estética premium con un flujo comercial altamente estructurado para mitigar la fricción de atención al cliente.

## 🎯 Enfoque Estratégico 

El objetivo primario de esta Landing Page es servir como un **filtro implacable contra dudas repetitivas**. Al responder de forma inmediata las inquietudes básicas del consumidor (autenticidad, costos precisos, logística de entrega y formas de pago), garantizamos que los prospectos redirigidos a canales de atención se encuentren en la etapa final de decisión de compra.

### Características Principales:
* **Diseño Visual Premium & Fluido:** Estilizado mediante Tailwind CSS utilizando tipografías con serifa de alta gama, microinteracciones limpias y una paleta cromática orgánica que evoca exclusividad artesanal.
* **Formulario Dinámico e Interactivo:** Los selectores cambian de estado de forma lógica al tacto (como los botones autogestionados de *A domicilio* / *Sucursal* y *Efectivo* / *Transferencia*), calculando el volumen requerido en tiempo real.
* **Estrategia de Conversión Superior:** Botón CTA estratégico colocado justo debajo de los bloques de valor ("above the fold") para captar la atención de inmediato.
* **Cierre de Ventas Omnicanal Seguro:** Enrutamiento automatizado a WhatsApp con plantillas de texto preestablecidas y procesamiento de correos mediante pasarelas seguras.

---

## 📂 Estructura Arquitectónica del Proyecto

Para mantener el entorno de desarrollo limpio, escalable y listo para producción, la distribución de directorios se organiza de la siguiente manera:

```text
├── index.html          # Interfaz de usuario (UI), estructura semántica y estilos via Tailwind
├── README.md           # Documentación técnica e instrucciones del sistema
├── img/                # Repositorio optimizado de recursos gráficos nativos
│   ├── logon.jpeg      # Logotipo corporativo de Pure Honey
│   └── Product.jpeg    # Fotografía principal del producto en alta definición
└── js/                 # Controladores y lógica de negocio del lado del cliente (Frontend)
    └── app.js          # Gestión del DOM, interacciones dinámicas y configuración comercial