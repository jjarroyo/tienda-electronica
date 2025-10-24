const Product = require('../../models/Product');
const Category = require('../../models/Category');
const fs = require('fs');
const path = require('path');
exports.createProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, error: 'Se requiere una imagen.' });
        }

        // Construye la URL relativa para guardar en la BD
        const relativeImagePath = `/public/uploads/products/${req.file.filename}`;

        const productData = {
            ...req.body, // Incluye nombre, descripción, precio, stock, CategoryId
            imagenUrl: relativeImagePath, // Guarda la ruta relativa
        };

        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        // Si hay error, elimina la imagen subida si existe
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err)
                    console.error('Error eliminando archivo tras fallo:', err);
            });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findByPk(req.params.id);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, error: 'Producto no encontrado' });
        }

        const updateData = { ...req.body };
        let oldImagePath = product.imagenUrl; // Guarda la ruta antigua

        // Si se sube una nueva imagen
        if (req.file) {
            const relativeImagePath = `/public/uploads/products/${req.file.filename}`;
            updateData.imagenUrl = relativeImagePath;

            // Intenta eliminar la imagen antigua (si existe y no es la imagen por defecto)
            if (oldImagePath) {
                const absoluteOldPath = path.join(
                    __dirname,
                    '..',
                    '..',
                    oldImagePath
                );
                if (fs.existsSync(absoluteOldPath)) {
                    fs.unlink(absoluteOldPath, (err) => {
                        if (err)
                            console.error(
                                'Error eliminando archivo antiguo:',
                                err
                            );
                    });
                }
            }
        }

        product = await product.update(updateData);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        // Si hay error y se subió archivo nuevo, eliminarlo
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err)
                    console.error('Error eliminando archivo tras fallo:', err);
            });
        }
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

// @desc    Eliminar un producto
// @route   DELETE /api/productos/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res
                .status(404)
                .json({ success: false, error: 'Producto no encontrado' });
        }
        await product.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};
