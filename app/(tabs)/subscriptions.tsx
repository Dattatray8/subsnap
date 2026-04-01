import { View, Text } from 'react-native'
import React from 'react'
import {styled} from "nativewind";
import { SafeAreaView as SAV } from "react-native-safe-area-context";

const SafeAreaView = styled(SAV);

const subscriptions = () => {
  return (
    <SafeAreaView>
      <Text>subscriptions</Text>
    </SafeAreaView>
  )
}

export default subscriptions