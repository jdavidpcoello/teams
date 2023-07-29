
async function obtenerDatosJson() {
    try {
      const response = await fetch('localhost:3000/usuarios');
      const data = await response.json();
  
      // Acceder a las propiedades del objeto JSON
      console.log(data.nombre);
      console.log(data.contrasena);
      console.log(data.imagen);
    } catch (error) {
      console.error('Error al cargar el archivo JSON:', error);
    }
  }
  
  obtenerDatosJson();
  for (let i=0;i<10;i++){//Generar 5 categorias
      document.getElementById("mainSec").innerHTML += `<div class="conversation">    
      <div id="convModul">
          <img src="../logo.png" alt="404" id="profileImg">
          <div> 
              <div class="nombre">Teams Group</div>
              <div class="msjHora">Mensaje</div>
          </div>
      </div>    
      <div class="msjHora">hora</div>
  </div> `
}
  
 
