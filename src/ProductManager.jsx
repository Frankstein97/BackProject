
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

export default ProductManager