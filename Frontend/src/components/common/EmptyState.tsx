interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'No hay información disponible',
  description = 'Todavía no existen datos para mostrar en esta sección.',
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}