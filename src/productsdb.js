import PouchDB from "pouchdb";

export default class ProductsDB {
    constructor() {
        this.db = new PouchDB("products");
    }

    async getProducts() {
        let allProducts = await this.db.allDocs({ include_docs: true });
        let products = {};

        allProducts.rows.forEach(p => products[p.id] = p.doc);

        return products;
    }

    async newProduct(product) {
        product.createdAt = new Date();
        product.updateAt = new Date();

        const response = await this.db.post({ ...product });

        return response;
    }

    async updateProduct(product) {
        const products = Object.values(await this.getProducts());

        const p = products.filter(p => p.productName === product.productName)[0];

        product._id = p._id;
        product._rev = p._rev;
        product.updateAt = new Date();

        const response = await this.db.put({ ...product });

        return response;
    }

    async deleteProduct(product) {
        const response = await this.db.remove({ ...product });

        return response;
    }
}