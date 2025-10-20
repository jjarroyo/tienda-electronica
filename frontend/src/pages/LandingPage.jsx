import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'; // Asegúrate que Footer esté en esta ruta

// Iconos para categorías (puedes ajustar o añadir más)
import { FaMicrochip, FaMemory, FaRegLightbulb, FaPlug, FaWrench } from 'react-icons/fa';

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Bienvenido a ElectroShop",
      subtitle: "Tu tienda de componentes electrónicos de confianza",
      button: "Ver Productos",
      link: "/products" // Link al catálogo
    },
    {
      title: "Arduino y Microcontroladores",
      subtitle: "Las mejores placas para tus proyectos",
      button: "Explorar Arduino",
      link: "/products?category=Arduino" // Link filtrado (ajusta si tu categoría es diferente)
    },
    {
      title: "Sensores y Módulos",
      subtitle: "Amplía las capacidades de tus proyectos",
      button: "Ver Sensores",
      link: "/products?category=Sensores" // Link filtrado (ajusta)
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer); // Limpia el intervalo al desmontar
  }, [nextSlide]);

  const categoryItems = [
    { name: 'Arduino', icon: <FaMicrochip className="w-12 h-12 md:w-16 md:h-16 text-white" />, color: 'from-cyan-400 to-blue-600', link: '/products?category=Arduino' },
    { name: 'Microcontroladores', icon: <FaMemory className="w-12 h-12 md:w-16 md:h-16 text-white" />, color: 'from-purple-400 to-pink-600', link: '/products?category=Microcontroladores' },
    { name: 'Sensores', icon: <FaRegLightbulb className="w-12 h-12 md:w-16 md:h-16 text-white" />, color: 'from-green-400 to-emerald-600', link: '/products?category=Sensores' },
    { name: 'Componentes', icon: <FaPlug className="w-12 h-12 md:w-16 md:h-16 text-white" />, color: 'from-orange-400 to-red-600', link: '/products?category=Componentes' },
    { name: 'Herramientas', icon: <FaWrench className="w-12 h-12 md:w-16 md:h-16 text-white" />, color: 'from-yellow-400 to-amber-600', link: '/products?category=Herramientas' },
  ];

  return (
    <>

      {/* Hero Slider */}
      <section className="relative h-96 md:h-[550px] overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
       

        {/* Slides */}
        <div id="slider" className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="text-center px-4 max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                <Link to={slide.link} className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full text-lg font-semibold transition-all transform hover:scale-105 inline-block">
                  {slide.button}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              // Estilos de los puntos: Círculo pequeño, cambia opacidad si está activo
              className={`w-3 h-3 rounded-full transition-opacity duration-300 ${
                index === currentSlide ? 'bg-white opacity-100' : 'bg-white opacity-50 hover:opacity-75'
              }`}
              aria-label={`Ir al slide ${index + 1}`} // Para accesibilidad
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Categorías Destacadas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {categoryItems.map((category) => (
             <Link to={category.link} key={category.name} className="category-card group">
                <div className="flex flex-col items-center">
                    <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-xl mb-4 group-hover:shadow-2xl transition-shadow duration-300`}>
                        {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{category.name}</h3>
                </div>
             </Link>
          ))}
        </div>
      </section>

       {/* Features Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
                {/* Repite la estructura para cada feature, actualizando el texto */}
                <div className="text-center">
                    {/* ... (icono Envío Rápido) ... */}
                    <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
                    <p>Entregamos tus productos en tiempo récord</p>
                </div>
                <div className="text-center">
                    {/* ... (icono Productos Garantizados) ... */}
                    <h3 className="text-xl font-semibold mb-2">Productos Garantizados</h3>
                    <p>Calidad certificada en cada componente</p>
                </div>
                <div className="text-center">
                    {/* ... (icono Soporte Técnico) ... */}
                    <h3 className="text-xl font-semibold mb-2">Soporte Técnico</h3>
                    <p>Te ayudamos con tus proyectos</p> {/* Texto actualizado */}
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">¿Listo para iniciar tu proyecto?</h2>
        <p className="text-xl text-gray-600 mb-8">Encuentra todo lo que necesitas para tus creaciones electrónicas</p>
        <Link to="/products" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 inline-block">
            Explorar Catálogo
        </Link>
      </section>

      
    </>
  );
}

export default LandingPage;