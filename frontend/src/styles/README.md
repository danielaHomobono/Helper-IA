# 📁 Estructura de CSS Organizada

## 🎯 Filosofía de Organización

Como Senior Frontend Developer, mantenemos una estructura modular y escalable que facilita el mantenimiento y la colaboración en equipo.

## 📂 Estructura de Carpetas

```
src/
├── styles/
│   ├── index.css           # Estilos globales y variables CSS
│   ├── App.css             # Estilos del componente raíz
│   ├── components/         # Estilos de componentes reutilizables
│   │   ├── ChatWindow.css
│   │   ├── Message.css
│   │   └── MessageInput.css
│   └── pages/              # Estilos de páginas completas
│       └── ChatPage.css
```

## 🎨 Convenciones

### Variables CSS (index.css)
- Todos los colores, sombras, transiciones y radios están centralizados
- Usamos la nomenclatura `--nombre-categoria`
- Ejemplo: `--primary`, `--shadow-lg`, `--transition-base`

### Nomenclatura de Clases
- **BEM-like**: `.componente-elemento--modificador`
- **Específicas**: `.message-avatar`, `.chat-header-content`
- **Estados**: `.warning`, `.danger`, `.active`

### Imports
- Siempre usar rutas relativas desde `src/`
- Componentes: `'../styles/components/NombreComponente.css'`
- Páginas: `'../styles/pages/NombrePagina.css'`
- Global: `'./styles/index.css'`

## 🚀 React Icons

### Iconos Utilizados

#### Material Design (react-icons/md)
- `MdRefresh` - Botón limpiar chat
- `MdLockOpen` - Contraseñas
- `MdBeachAccess` - Vacaciones
- `MdPerson` - Usuario/Escalación

#### Bootstrap (react-icons/bs)
- `BsDiamondFill` - Logo principal y avatar IA
- `BsCircleFill` - Avatar usuario

#### Ionicons 5 (react-icons/io5)
- `IoSend` - Botón enviar
- `IoDocumentText` - Certificados
- `IoBookSharp` - Políticas
- `IoChatbubble` - Chat genérico

### Uso en Componentes
```jsx
import { BsDiamondFill } from 'react-icons/bs';

<BsDiamondFill className="logo-icon" />
```

## 📐 Tipografía

**Fuente Principal**: [Montserrat](https://fonts.google.com/specimen/Montserrat) via Google Fonts

### Pesos Disponibles
- 300 - Light
- 400 - Regular
- 500 - Medium  
- 600 - Semi-Bold (headers, botones)
- 700 - Bold (títulos)
- 800 - Extra-Bold
- 900 - Black

### Aplicación
```css
font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
```

## ✨ Mejores Prácticas

1. **Un archivo CSS por componente**
2. **Variables CSS para valores reutilizables**
3. **Mobile-first con media queries**
4. **Transiciones suaves** usando variables
5. **Comentarios descriptivos** en secciones complejas
6. **React Icons** en lugar de emojis o Unicode

## 🔄 Mantenimiento

- Revisar variables antes de agregar nuevos colores
- Verificar responsive en mobile (max-width: 768px)
- Testear transiciones y animaciones
- Validar accesibilidad (contraste, focus states)

---
**Última actualización**: Noviembre 2025
