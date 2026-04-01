import clsx from "clsx";
import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';

interface SubmitButtonProps extends PressableProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
}

const SubmitButton = ({ title, loading = false, disabled = false, ...props }: SubmitButtonProps) => {
  return (
    <Pressable
      className={clsx(
        'rounded-lg bg-accent py-4 px-6',
        (disabled || loading) && 'opacity-60'
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-center font-sans-bold text-base text-white">{title}</Text>
      )}
    </Pressable>
  );
};

export default SubmitButton;
