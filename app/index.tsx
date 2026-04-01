import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while auth is being determined
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#081126" />
      </View>
    );
  }

  // Redirect based on auth state
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
