module.exports = {
  async afterCreate(event) {
    const { result } = event;
    
    try {
      await strapi.plugins['email'].services.email.send({
        to: 'tomas.millan96@gmail.com', // Where you want to receive emails
        from: 'tomas.millan96@gmail.com', // From address
        subject: `Nuevo mensaje de contacto de ${result.nombre}`,
        text: `
          Nombre: ${result.nombre}
          Email: ${result.email}
          País: ${result.pais}
          Mensaje: ${result.mensaje}
        `,
        html: `
          <h1>Nuevo mensaje de contacto</h1>
          <p><strong>Nombre:</strong> ${result.nombre}</p>
          <p><strong>Email:</strong> ${result.email}</p>
          <p><strong>País:</strong> ${result.pais}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${result.mensaje}</p>
        `,
      });
    } catch (err) {
      console.error('Error sending email:', err);
    }
  },
};