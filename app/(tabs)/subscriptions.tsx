import SubscriptionCard from '@/components/SubscriptionCard';
import { useSubscriptions } from '@/lib/SubscriptionsContext';
import { styled } from "nativewind";
import React, { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView as SAV } from "react-native-safe-area-context";

const SafeAreaView = styled(SAV);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { subscriptions } = useSubscriptions();

  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return subscriptions
    }

    const query = searchQuery.toLowerCase()
    return subscriptions.filter((sub) => 
      sub.name.toLowerCase().includes(query) ||
      sub.category?.toLowerCase().includes(query) ||
      sub.plan?.toLowerCase().includes(query)
    )
  }, [searchQuery, subscriptions])

  const handleCardPress = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const renderSubscriptionCard = ({ item }: { item: Subscription }) => (
    <View className='mb-3'>
      <SubscriptionCard
        {...item}
        expanded={expandedId === item.id}
        onPress={() => handleCardPress(item.id)}
      />
    </View>
  )

  return (
    <SafeAreaView className='flex-1 bg-background pb-20'>
      <View className='px-4 py-4'>
        <Text className='text-2xl font-bold text-foreground mb-4'>Subscriptions</Text>
        
        <TextInput
          placeholder='Search by name, category, or plan...'
          placeholderTextColor='#888'
          value={searchQuery}
          onChangeText={setSearchQuery}
          className='bg-card text-foreground px-4 py-3 rounded-lg mb-4 border border-border'
        />
      </View>

      {filteredSubscriptions.length > 0 ? (
        <FlatList
          data={filteredSubscriptions}
          renderItem={renderSubscriptionCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        />
      ) : (
        <View className='flex-1 items-center justify-center px-4'>
          <Text className='text-gray-500 text-center text-lg'>
            No subscriptions found for &apos;{searchQuery}&apos;
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Subscriptions