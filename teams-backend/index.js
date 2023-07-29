const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const usuarios = require('./data/usuarios.json');
const conversaciones = require('./data/conversaciones.json');
const grupos = require('./data/grupos.json');

app.use(express.json());
app.use(cors());

// Endpoint para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// Endpoint para el inicio de sesión
app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  const usuarioEncontrado = usuarios.find(user => user.nombre === usuario && user.contrasena === contrasena);
  if (usuarioEncontrado) {
    let u = {...usuarioEncontrado};
    delete u.contrasena;
    delete u.conversaciones;
    res.json({ exito: true, mensaje: 'Inicio de sesión exitoso', usuario: u });
  } else {
    res.status(401).json({ exito: false, mensaje: 'Credenciales inválidas' });
  }
});

// Endpoint para obtener un usuario específico
app.get('/usuarios/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const usuario = usuarios.find(user => user.id === userId);
  if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

// Endpoint para crear un nuevo usuario
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = req.body;
  // Asigna un ID único al usuario
  nuevoUsuario.id = usuarios.length + 1;
  usuarios.push(nuevoUsuario);
  res.json(nuevoUsuario);
});

// Endpoint para enviar un mensaje
app.post('/mensajes', (req, res) => {
  const nuevoMensaje = req.body;
  // Determina si el mensaje es individual o grupal
  if (nuevoMensaje.idGrupo) {
    const grupo = grupos.find(grupo => grupo.id === nuevoMensaje.idGrupo);
    if (grupo) {
      delete nuevoMensaje.idGrupo;
      grupo.mensajes.push(nuevoMensaje);
      res.json(nuevoMensaje);
    } else {
      res.status(404).json({ error: 'Grupo no encontrado' });
    }
  } else {
    const conversacion = conversaciones.find(conversacion => conversacion.id === nuevoMensaje.idConversacion);
    if (conversacion) {
      delete nuevoMensaje.idConversacion;
      conversacion.mensajes.push(nuevoMensaje);
      res.json(nuevoMensaje);
    } else {
      res.status(404).json({ error: 'Conversación no encontrada' });
    }
  }
});

// Endpoint para obtener todas las conversaciones de un usuario
app.get('/usuarios/:id/conversaciones', (req, res) => {
  const userId = parseInt(req.params.id);
  const usuario = usuarios.find(user => user.id === userId);
  if (usuario) {
    const conversacionesUsuario = usuario.conversaciones.map(conversacion => {
      if (conversacion.tipo === 'individual') {
        const destinatario = usuarios.find(user => user.id === conversacion.idDestinatario);
        return { ...conversacion, nombreDestinatario: destinatario.nombre, imagenDestinatario: destinatario.imagen };
      } else {
        const grupo = grupos.find(grupo => grupo.id === conversacion.idGrupo);
        return { ...conversacion, nombreDestinatario: grupo.nombreGrupo, imagenDestinatario: null };
      }
    });
    res.json(conversacionesUsuario);
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

// Endpoint para obtener los mensajes de una conversación específica
app.get('/conversaciones/:id/mensajes', (req, res) => {
  const conversacionId = parseInt(req.params.id);
  const conversacion = conversaciones.find(conv => conv.id === conversacionId);
  if (conversacion) {
    res.json(conversacion.mensajes);
  } else {
    res.status(404).json({ error: 'Conversación no encontrada' });
  }
});

// Endpoint para ver los mensajes de una conversación de un grupo
app.get('/grupos/:id/mensajes', (req, res) => {
  const grupoId = parseInt(req.params.id);
  const grupo = grupos.find(grupo => grupo.id === grupoId);
  if (grupo) {
    const mensajesConUsuarios = grupo.mensajes.map(mensaje => {
      const emisor = usuarios.find(user => user.id === mensaje.emisor);
      return {
        ...mensaje,
        emisor: {
          id: emisor.id,
          nombre: emisor.nombre,
          imagen: emisor.imagen
        }
      };
    });
    res.json(mensajesConUsuarios);
  } else {
    res.status(404).json({ error: 'Grupo no encontrado' });
  }
});

// Endpoint para obtener los miembros de un grupo
app.get('/grupos/:id/miembros', (req, res) => {
  const grupoId = parseInt(req.params.id);
  const grupo = grupos.find(grupo => grupo.id === grupoId);
  if (grupo) {
    const miembros = grupo.miembros.map(miembro => {
      const usuario = usuarios.find(user => user.id === miembro.id);
      return {
        id: usuario.id,
        nombre: usuario.nombre,
        imagen: usuario.imagen
      };
    });
    res.json(miembros);
  } else {
    res.status(404).json({ error: 'Grupo no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
