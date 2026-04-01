import { View, Text } from 'react-native'
import React from 'react'
import {styled} from "nativewind";
import { SafeAreaView as SAV } from "react-native-safe-area-context";

const SafeAreaView = styled(SAV);

const insights = () => {
  return (
    <SafeAreaView>
      <Text>insights</Text>
    </SafeAreaView>
  )
}

export default insights