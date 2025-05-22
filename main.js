import inquirer from "inquirer";
// import fetch from "node-fetch"; 

const BASE_URL = 'https://fakestoreapi.com/products';


const main = async () => {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: '¿Qué querés hacer?',
      choices: ['-------------------','Ver Todos productos', 'Buscar por ID','__________________','Crear Producto ','Borrar Product ', 'Salir',"",""]
    }
  ]);

  if (opcion === 'Ver Todos productos') {
    const res = await fetch(BASE_URL);
    const productos = await res.json();
    console.log(productos);
  }

  if (opcion === 'Buscar por ID') {
    const { id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Ingresá el ID del producto:'
      }
    ]);
    const res = await fetch(`${BASE_URL}/${id}`);
    const producto = await res.json();
    console.log(producto);
  }

  if (opcion === 'Salir') {
    console.log('¡Hasta luego!');
    process.exit();
  }
};

main();