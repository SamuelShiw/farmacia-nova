import { useEffect, useState } from "react";
import api from "../services/api";

export default function useProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return {
    productos,
    loading,
    cargarProductos,
    setProductos
  };
}