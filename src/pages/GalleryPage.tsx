import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchGalleryItems,
  GalleryItem,
} from "@/lib/features/gallery/gallerySlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, ServerCrash, CameraOff } from "lucide-react";

// --- Componente para cada tarjeta de imagen en la galería ---
const GalleryImageCard = ({ item }: { item: GalleryItem }) => {
  return (
    <Card className="rounded-xl overflow-hidden group relative border-2 border-transparent hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-xl">
      <a href={item.secure_url} target="_blank" rel="noopener noreferrer">
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={item.secure_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>
        {/* Overlay que aparece al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg drop-shadow-md">
            {item.title}
          </h3>
          <p className="text-orange-300 text-sm font-semibold">
            {item.category}
          </p>
        </div>
      </a>
    </Card>
  );
};

// --- Componente principal de la página de la galería ---
const GalleryPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items, status, error } = useSelector(
    (state: RootState) => state.gallery
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // Carga las imágenes solo si no se han cargado antes
    if (status === "idle") {
      dispatch(fetchGalleryItems());
    }
  }, [status, dispatch]);

  // Memoiza las categorías únicas para el filtro
  const uniqueCategories = useMemo(() => {
    if (!items) return [];
    const categories = new Set(items.map((item) => item.category));
    return ["All", ...Array.from(categories)];
  }, [items]);

  // Memoiza los items filtrados para optimizar el rendimiento
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") {
      return items;
    }
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="mt-4 text-slate-600">Cargando nuestra galería...</p>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-red-50/50 p-8 rounded-xl">
          <ServerCrash className="h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-xl font-semibold text-red-700">
            ¡Oh no! Algo salió mal
          </h3>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      );
    }

    if (status === "succeeded" && filteredItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-slate-100/50 p-8 rounded-xl">
          <CameraOff className="h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-xl font-semibold text-slate-700">
            No se encontraron imágenes
          </h3>
          <p className="mt-2 text-slate-500">
            {selectedCategory === "All"
              ? "Nuestra galería parece estar vacía en este momento."
              : `No hay imágenes en la categoría "${selectedCategory}".`}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <GalleryImageCard key={item._id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#F7FAFA] min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* --- Cabecera de la página --- */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Nuestra Galería de Proyectos
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Explora una colección de nuestros mejores diseños y proyectos.
            Inspírate para tu próximo hogar.
          </p>
        </div>

        {/* --- Barra de Filtros --- */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-xs">
            <label className="block text-center text-sm font-medium text-slate-700 mb-2">
              Filtrar por categoría
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-12 text-base bg-white shadow-sm border-slate-300 focus:ring-orange-500">
                <SelectValue placeholder="Seleccionar categoría..." />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-base"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- Contenido de la Galería --- */}
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
