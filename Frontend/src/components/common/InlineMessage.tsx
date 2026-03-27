interface InlineMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function InlineMessage({ type, message }: InlineMessageProps) {
  const styles = {
    success: 'border-green-200 bg-green-50 text-green-700',
    error: 'border-red-200 bg-red-50 text-red-700',
    info: 'border-blue-200 bg-blue-50 text-blue-700',
  };

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${styles[type]}`}>
      {message}
    </div>
  );
}