import { AppDataSource } from "../models/db";
import Product, { Type } from "../models/Product";

class ProductService {
    public async getAllProduct() {
        const products = await AppDataSource.getRepository(Product).find({
            where: {
                deletedAt: null,
            },
        });
        return products;
    }
    public async getProductById(id: number) {
        const product = await AppDataSource.getRepository(Product).findOne({
            where: {
                id,
                deletedAt: null,
            },
        });
        return product;
    }
    public async createProduct(
        name: string,
        price: number,
        type: Type,
        description: string,
        imageBase64: string,
        initialStock: number = 0
    ) {
        const product = new Product();
        product.name = name;
        product.price = price;
        product.type = type;
        product.stock = initialStock;
        product.description = description;
        product.imageBase64 = imageBase64;
        const result = await AppDataSource.getRepository(Product).save(product);
        return result;
    }
    public async updateProduct(product: Product) {
        const result = await AppDataSource.getRepository(Product).save(product);
        return result;
    }
    public async deleteProduct(id: number) {
        const product = await AppDataSource.getRepository(Product).findOne({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!product) {
            return false;
        }
        product.deletedAt = new Date();
        const result = await AppDataSource.getRepository(Product).save(product);
        return result;
    }
    public async getProductCategories() {
        const products = await AppDataSource.getRepository(Product).find({
            select: {
                type: true,
            },
        });
        const categories = products.map((product) => product.type);
        const uniqueCategories = Array.from(new Set(categories));
        return uniqueCategories;
    }
    public async getAllForSelect() {
        const products = await AppDataSource.getRepository(Product).find({
            where: {
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                price: true,
                stock: true,
            },
        });
        return products;
    }
}

export default new ProductService();
