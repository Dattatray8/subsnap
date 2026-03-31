import { View, Text } from 'react-native'
import React from 'react'
import {styled} from "nativewind";
import { SafeAreaView as SAV } from "react-native-safe-area-context";

const SafeAreaView = styled(SAV);

const settings = () => {
  return (
    <SafeAreaView>
      <Text>settings</Text>
    </SafeAreaView>
  )
}

export default settings