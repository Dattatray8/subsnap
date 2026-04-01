import { styled } from 'nativewind';
import { View, ViewProps } from 'react-native';
import { SafeAreaView as SAV } from 'react-native-safe-area-context';

const SafeAreaView = styled(SAV);

interface AuthContainerProps extends ViewProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children, ...props }: AuthContainerProps) => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-5 gap-4" {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default AuthContainer;
