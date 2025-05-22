import readline from 'readline';
import chalk from 'chalk';
import Table from 'cli-table3';

const URL_BASE = "https://fakestoreapi.com/products";

const menu = `\tSeleccione opción:
1_ Ver listado completo
2_ Ver por ID
3_ Crear Producto
4_ Eliminar
5_ Salir`;

const lerline = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para usar readline.question con promesas y await
const pregunta = (query) => {
  return new Promise(resolve => {
    lerline.question(query, resolve);
  });
};

const data = async (tipo, url, id = null, body = null) => {
  let finalURL = id ? `${url}/${id}` : url;

  const options = {
    method: tipo,
    headers: { 'Content-Type': 'application/json' }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(finalURL, options);
  return await response.json();
};

const mostrarTablaProductos = (productos) => {
  const tabla = new Table({
    head: [
      chalk.cyan('ID'),
      chalk.yellow('Título'),
      chalk.green('Precio'),
      chalk.magenta('Categoría')
    ],
    style: {
      head: ['bold'],
      border: ['grey']
    }
  });

  productos.forEach(p => {
    tabla.push([
      chalk.cyan(p.id),
      chalk.yellow(p.title.length > 25 ? p.title.substring(0, 25) + '…' : p.title),
      chalk.green(`$${p.price}`),
      chalk.magenta(p.category)
    ]);
  });

  console.log(tabla.toString());
};

async function main() {
  let opcion = '';
  while (opcion !== '5') {
    console.log(chalk.green(menu) + "\n_______________________\n");
    opcion = await pregunta(chalk.yellow('Ingrese una opción (1-5): '));

    switch (opcion) {
      case '1': { // Ver todos
        try {
          const productos = await data('GET', URL_BASE);
          mostrarTablaProductos(productos);
        } catch (e) {
          console.error(chalk.red(" Error al obtener productos:"), e);
        }
        break;
      }

      case '2': { // Ver por ID
        const id = await pregunta('Ingrese el ID del producto: ');
        try {
          const producto = await data('GET', URL_BASE, id);
          mostrarTablaProductos([producto]);
        } catch (e) {
          console.error(chalk.red(" Error al obtener producto:"), e);
        }
        break;
      }

      case '3': { // Crear producto
        const title = await pregunta('Título: ');
        const price = await pregunta('Precio: ');
        const description = await pregunta('Descripción: ');
        const category = await pregunta('Categoría: ');
        const image = await pregunta('URL de imagen: ');

        const nuevoProducto = {
          title,
          price: parseFloat(price),
          description,
          category,
          image
        };

        try {
          const creado = await data('POST', URL_BASE, null, nuevoProducto);
          console.log('\n Producto creado:', creado);
        } catch (e) {
          console.error(chalk.red(" Error al crear producto:"), e);
        }
        break;
      }

      case '4': { // Eliminar producto
        const id = await pregunta('Ingrese el ID del producto a eliminar: ');
        try {
          const eliminado = await data('DELETE', URL_BASE, id);
          console.log('\n Producto eliminado:', eliminado);
        } catch (e) {
          console.error(chalk.red(" Error al eliminar producto:"), e);
        }
        break;
      }

      case '5': {
        console.log(' ¡Hasta luego!');
        break;
      }

      default:
        console.log(chalk.yellow(' Opción no válida.'));
    }
  }
  lerline.close();
}

main();
