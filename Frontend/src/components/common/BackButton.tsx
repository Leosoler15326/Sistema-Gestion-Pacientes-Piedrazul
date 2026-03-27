import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
}

export default function BackButton({ label = 'Volver' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
    >
      {label}
    </button>
  );
}