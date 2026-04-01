import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

interface SegmentedLinkProps {
  text: string;
  linkText: string;
  href: string;
}

const SegmentedLink = ({ text, linkText, href }: SegmentedLinkProps) => {
  return (
    <View className="flex-row items-center justify-center gap-1">
      <Text className="font-sans-regular text-sm text-foreground">{text}</Text>
      <Link href={href} asChild>
        <Pressable>
          <Text className="font-sans-semibold text-sm text-accent">{linkText}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default SegmentedLink;
