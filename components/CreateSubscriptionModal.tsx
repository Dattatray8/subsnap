import { icons } from '@/constants/icons';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { usePostHog } from 'posthog-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

interface CreateSubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubscriptionCreated: (subscription: Subscription) => void;
}

const CATEGORIES = ['Entertainment', 'AI Tools', 'Developer Tools', 'Design', 'Productivity', 'Cloud', 'Music', 'Other'] as const;

const CATEGORY_COLORS: Record<typeof CATEGORIES[number], string> = {
  Entertainment: '#ff6b6b',
  'AI Tools': '#4ecdc4',
  'Developer Tools': '#45b7d1',
  Design: '#f5c542',
  Productivity: '#96ceb4',
  Cloud: '#dfe6e9',
  Music: '#a29bfe',
  Other: '#74b9ff',
};

interface FormState {
  name: string;
  price: string;
  frequency: 'Monthly' | 'Yearly';
  category: typeof CATEGORIES[number];
}

interface FormErrors {
  name?: string;
  price?: string;
}

const CreateSubscriptionModal = ({
  isVisible,
  onClose,
  onSubscriptionCreated,
}: CreateSubscriptionModalProps) => {
  const posthog = usePostHog();
  const [formState, setFormState] = useState<FormState>({
    name: '',
    price: '',
    frequency: 'Monthly',
    category: 'Other',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormState({
      name: '',
      price: '',
      frequency: 'Monthly',
      category: 'Other',
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formState.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formState.price)) || parseFloat(formState.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const now = new Date();
      const startDate = now.toISOString();

      // Calculate renewal date based on frequency
      let renewalDate: string;
      if (formState.frequency === 'Monthly') {
        renewalDate = dayjs(startDate).add(1, 'month').toISOString();
      } else {
        renewalDate = dayjs(startDate).add(1, 'year').toISOString();
      }

      const newSubscription: Subscription = {
        id: `subscription-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        icon: icons.wallet,
        name: formState.name,
        category: formState.category,
        status: 'active',
        startDate,
        price: parseFloat(formState.price),
        currency: 'USD',
        billing: formState.frequency,
        renewalDate,
        color: CATEGORY_COLORS[formState.category],
      };

      // Simulate async operation (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 300));

      onSubscriptionCreated(newSubscription);

      posthog.capture('subscription_created', {
        name: newSubscription.name ?? '',
        category: newSubscription.category ?? '',
        price: newSubscription.price,
        billing: newSubscription.billing ?? '',
      });

      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="modal-overlay">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="modal-container">
            {/* Header */}
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable
                onPress={handleClose}
                className="modal-close"
              >
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            {/* Body */}
            <ScrollView
              className="modal-body"
              showsVerticalScrollIndicator={false}
            >
              {/* Name Field */}
              <View className="gap-2">
                <Text className="text-sm font-sans-semibold text-primary">Name</Text>
                <TextInput
                  className={clsx(
                    'auth-input',
                    errors.name && 'border-destructive'
                  )}
                  placeholder="e.g., Netflix"
                  placeholderTextColor="#999"
                  value={formState.name}
                  onChangeText={(text) => {
                    setFormState((prev) => ({ ...prev, name: text }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  editable={!isSubmitting}
                />
                {errors.name && (
                  <Text className="text-xs font-sans-regular text-destructive">{errors.name}</Text>
                )}
              </View>

              {/* Price Field */}
              <View className="gap-2">
                <Text className="text-sm font-sans-semibold text-primary">Price (USD)</Text>
                <TextInput
                  className={clsx(
                    'auth-input',
                    errors.price && 'border-destructive'
                  )}
                  placeholder="9.99"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={formState.price}
                  onChangeText={(text) => {
                    setFormState((prev) => ({ ...prev, price: text }));
                    if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
                  }}
                  editable={!isSubmitting}
                />
                {errors.price && (
                  <Text className="text-xs font-sans-regular text-destructive">{errors.price}</Text>
                )}
              </View>

              {/* Frequency Selection */}
              <View className="gap-2">
                <Text className="text-sm font-sans-semibold text-primary">Billing Frequency</Text>
                <View className="picker-row">
                  {(['Monthly', 'Yearly'] as const).map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => setFormState((prev) => ({ ...prev, frequency: option }))}
                      disabled={isSubmitting}
                      className={clsx(
                        'picker-option',
                        formState.frequency === option && 'picker-option-active'
                      )}
                    >
                      <Text
                        className={clsx(
                          'picker-option-text',
                          formState.frequency === option && 'picker-option-text-active'
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Category Selection */}
              <View className="gap-2">
                <Text className="text-sm font-sans-semibold text-primary">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((category) => (
                    <Pressable
                      key={category}
                      onPress={() => setFormState((prev) => ({ ...prev, category }))}
                      disabled={isSubmitting}
                      className={clsx(
                        'category-chip',
                        formState.category === category && 'category-chip-active'
                      )}
                    >
                      <Text
                        className={clsx(
                          'category-chip-text',
                          formState.category === category && 'category-chip-text-active'
                        )}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting || !formState.name.trim() || !formState.price.trim()}
                className={clsx(
                  'auth-button',
                  (isSubmitting || !formState.name.trim() || !formState.price.trim()) && 'auth-button-disabled',
                  'mt-6'
                )}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#081126" />
                ) : (
                  <Text className="auth-button-text">Create Subscription</Text>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
