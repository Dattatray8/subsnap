import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href={'/login'} className="mt-4 rounded-full bg-accent py-4 px-8">
        <Text className="text-base font-sans-bold text-primary">
          Get Started
        </Text>
      </Link>
    </View>
  );
}