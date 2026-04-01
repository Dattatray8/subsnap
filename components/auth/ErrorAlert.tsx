import { clsx } from 'clsx';
import { Text, View } from 'react-native';

interface ErrorAlertProps {
  message?: string;
  type?: 'error' | 'warning' | 'info';
}

const ErrorAlert = ({ message, type = 'error' }: ErrorAlertProps) => {
  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-destructive' : type === 'warning' ? 'bg-accent' : 'bg-subscription';

  return (
    <View className={clsx('rounded-lg px-4 py-3', bgColor)}>
      <Text className="font-sans-medium text-sm text-white">{message}</Text>
    </View>
  );
};

export default ErrorAlert;
