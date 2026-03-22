interface InlineMessageProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function InlineMessage({ type, message }: InlineMessageProps) {
  const styles = {
    success: 'bg-green-50 text-green-700 border-green-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}