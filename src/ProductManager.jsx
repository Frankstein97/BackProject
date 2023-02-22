/* Consigna 
Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).
La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.
Debe guardar objetos con el siguiente formato:
id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
title (nombre del producto)
description (descripción del producto)
price (precio)
thumbnail (ruta de imagen)
code (código identificador)
stock (número de piezas disponibles)
Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto
Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 
Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.
*/

const fs = require("fs");

class ProductManager {
  #path = "";

  constructor(path) {
    this.#path = path;
  }

  async getProducts() {
    try {
      const products = await fs.promises.readFile(this.#path, "utf-8");
      return JSON.parse(products);
    } catch {
      return [];
    }
  }

  async getAllIds() {
    let products = await this.getProducts();
    let ids = products.map((p) => p.id);

    let LastId = Math.max(...ids);
    if (LastId === -Infinity) {
      return 0;
    } else {
      return LastId;
    }
  }

  //☝ Este codigo resuelve incrementar el ID generando un arreglo de ids, y sumandoselo al id del nuevo objeto creado.

  async addProduct(title, description, price, thumbnail, code, stock) {
    let LastId = await this.getAllIds();

    const product = {
      id: ++LastId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    let products = await this.getProducts();

    // Se declaran variables que van a validar que los datos se carguen correctamente o no se carguen duplicados.

    let inspection = Object.values(product);
    let sameCode = products.find((prod) => prod.code === code);

    if (inspection.includes(undefined)) {
      throw new Error(
        ` ${product.title} no se puede cargar, falta completar uno o mas campos obligatorios".`
      );
    }
    if (sameCode) {
      throw new Error(
        `Ya hay un producto con este mismo Code: ${product.title} , codigo repetido `
      );
    }

    products = [...products, product];
    console.log(`se cargo el producto ${product.title} a la base de datos.`);

    await fs.promises.writeFile(this.#path, JSON.stringify(products));
  }
  async getProductById(id) {
    let products = await this.getProducts();
    let element = products.find((elem) => elem.id === id);
    if (element) {
      return element;
    } else {
      throw new Error("No se encuentra producto con ese ID.");
    }
  }

  // Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID

  async updateProduct(id, propModify) {
    let products = await this.getProducts();
    let productModify = products.find((i) => i.id === id);

    if (!productModify) {
      throw new Error("No hay productos con este id.");
    }

    if (Object.keys(propModify).includes("id")) {
      throw new Error("NO DEBE BORRARSE SU ID");
    }

    if (Object.keys(propModify).includes("code")) {
      let sameCode = products.some((i) => i.code === propModify.code);
      if (sameCode) {
        throw new Error("El code no debe ser igual a otro que ya existe");
      }
    }
// Si pasa se debe modificar el producto y sobreescribir el json.

    productModify = { ...productModify, ...propModify };
    let newArray = products.filter((p) => p.id !== id);
    newArray = [...newArray, productModify];
    await fs.promises.writeFile(this.#path, JSON.stringify(newArray));
    console.log("se ha modificado la base de datos");
  }

// Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.

  async deleteProduct(id) {
    let products = await this.getProducts();
    let newArray = products.filter((p) => p.id !== id);
    await fs.promises.writeFile(this.#path, JSON.stringify(newArray));
    console.log("Producto eliminado con éxito");
  }
}

// El main es como se llama a las funciones principales

async function main() {
  const manager1 = new ProductManager("./products.json");
  await manager1.addProduct(
    "Batman",
    "E un vampiro",
    10000000,
    "img/batman",
    "76756",
    1
  );
  await manager1.addProduct(
    "Superman",
    "El hombre de acero",
    300,
    "img/superman",
    "62352",
    1
  );
  await manager1.addProduct(
    "Aquaman",
    "Un pejelagarto",
    1000,
    "img/aquaman",
    "53453",
    1
  );
  await manager1.addProduct(
    "Flash",
    "Ezra Miller ",
    1000,
    "img/flash",
    "34535",
    2
  );
}

main();

// Se creará una instancia de la clase “ProductManager”
// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
// Se llamará al método “addProduct” con los campos:
// title: “producto prueba”
// description:”Este es un producto prueba”
// price:200,
// thumbnail:”Sin imagen”
// code:”abc123”,
// stock:25
// El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
// Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
// Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
// Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
// Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
