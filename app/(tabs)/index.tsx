import { Link } from "expo-router";
import { Text, View } from "react-native";
import {styled} from "nativewind";
import { SafeAreaView as SAV } from "react-native-safe-area-context";

const SafeAreaView = styled(SAV);

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl text-success font-sans-bold">
        Welcome to Nativewind!
      </Text>
      <Link href={'/login'} className="mt-4 rounded-full bg-accent py-4 px-8">
        <Text className="text-base font-sans-bold text-primary">
          Get Started
        </Text>
      </Link>
    </SafeAreaView>
  );
}