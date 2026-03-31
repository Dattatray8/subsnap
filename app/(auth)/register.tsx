import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const register = () => {
    return (
        <View>
            <Text>register</Text>
            <Link href={'/(auth)/login'} className="mt-4 rounded-full bg-accent py-4 px-8">
                <Text className="text-base font-sans-bold text-primary">
                    Login
                </Text>
            </Link>
        </View>
    )
}

export default register