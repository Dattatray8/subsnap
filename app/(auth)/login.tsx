import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const login = () => {
  return (
    <View>
      <Text>login</Text>
      <Link href={'/(auth)/register'} className="mt-4 rounded-full bg-accent py-4 px-8">
        <Text className="text-base font-sans-bold text-primary">
          Register
        </Text>
      </Link>
    </View>
  )
}

export default login