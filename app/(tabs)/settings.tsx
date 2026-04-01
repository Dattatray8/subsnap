import { useClerk, useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { styled } from "nativewind";
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView as SAV } from "react-native-safe-area-context";

const SafeAreaView = styled(SAV);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background pb-20">
      <View className="flex-1 px-5 py-6 gap-6">
        {/* Header */}
        <View className="gap-2">
          <Text className="text-2xl font-sans-bold text-primary">Settings</Text>
          <Text className="text-sm font-sans-regular text-muted-foreground">
            Manage your account
          </Text>
        </View>

        {/* Account Info Card */}
        <View className="rounded-lg border border-border bg-card p-4 gap-3">
          <View className="gap-1">
            <Text className="text-xs font-sans-semibold text-muted-foreground uppercase">
              Account Email
            </Text>
            <Text className="text-base font-sans-medium text-primary">{user?.emailAddresses[0]?.emailAddress}</Text>
          </View>
          <View className="h-px bg-border" />
          <View className="gap-1">
            <Text className="text-xs font-sans-semibold text-muted-foreground uppercase">
              Member Since
            </Text>
            <Text className="text-base font-sans-medium text-primary">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable
          className="mt-auto rounded-lg bg-destructive py-4 px-6"
          disabled={isLoggingOut}
          onPress={handleLogout}
        >
          <Text className="text-center font-sans-bold text-base text-white">
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default Settings