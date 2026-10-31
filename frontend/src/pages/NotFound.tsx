import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-forest-800">Pagina no encontrada</h2>
      <Link to="/" className="text-forest-600 underline mt-3 inline-block">
        Volver al inicio
      </Link>
    </div>
  );
}
