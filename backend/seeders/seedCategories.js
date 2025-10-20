const Category = require('../models/Category');

// Nombres de las categorías que quieres asegurar que existan
const defaultCategories = [
    'Arduino',
    'Microcontroladores',
    'Sensores',
    'Componentes',
    'Herramientas'
];

const seedCategories = async () => {
    console.log('Verificando categorías por defecto...');
    try {
        for (const categoryName of defaultCategories) {
            // Intenta encontrar la categoría o crearla si no existe
            const [category, created] = await Category.findOrCreate({
                where: { name: categoryName },
                defaults: { name: categoryName } // Asegura que se cree con el nombre correcto
            });

            if (created) {
                console.log(`Categoría "${categoryName}" creada.`);
            }
        }
        console.log('Verificación de categorías completada.');
    } catch (error) {
        console.error('Error al sembrar categorías:', error);
    }
};

module.exports = seedCategories;