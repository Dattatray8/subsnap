import AuthContainer from '@/components/auth/AuthContainer';
import ErrorAlert from '@/components/auth/ErrorAlert';
import SegmentedLink from '@/components/auth/SegmentedLink';
import SubmitButton from '@/components/auth/SubmitButton';
import TextInputField from '@/components/auth/TextInputField';
import {
    validateEmail,
    validatePassword,
    validatePasswordMatch,
    validateVerificationCode,
} from '@/lib/auth-validation';
import { useSignUp } from '@clerk/expo';
import { useRouter, type Href } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Email verification state
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const confirmPasswordRef = useRef<TextInput>(null);

  /**
   * Handle initial sign-up with email/password
   */
  const handleSignUp = async () => {
    setValidationErrors({});
    setGlobalError('');

    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);

    const newValidationErrors: Record<string, string> = {};
    if (!emailValidation.valid) newValidationErrors.email = emailValidation.message || '';
    if (!passwordValidation.valid) newValidationErrors.password = passwordValidation.message || '';
    if (!passwordMatchValidation.valid) newValidationErrors.confirmPassword = passwordMatchValidation.message || '';

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    try {
      const { error } = await signUp.password({
        emailAddress: email,
        password,
      });

      if (error) {
        const errorMessage = error?.message || 'Sign-up failed. Please try again.';
        setGlobalError(errorMessage);
        console.error('Sign-up error:', error);
        return;
      }

      // Send email verification code
      await signUp.verifications.sendEmailCode();
      setShowVerification(true);
    } catch (err: any) {
      console.error('Sign-up exception:', err);
      setGlobalError(err?.message || 'An error occurred. Please try again.');
    }
  };

  /**
   * Handle email verification code submission
   */
  const handleVerifyEmail = async () => {
    const codeValidation = validateVerificationCode(verificationCode);
    if (!codeValidation.valid) {
      setVerificationError(codeValidation.message || '');
      return;
    }

    try {
      setVerificationError('');

      await signUp.verifications.verifyEmailCode({ code: verificationCode });

      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            // Handle session tasks if needed
            if (session?.currentTask) {
              console.log('Session task:', session.currentTask);
              return;
            }

            // Navigate to home
            const url = decorateUrl('/(tabs)');
            if (url.startsWith('http')) {
              window.location.href = url;
            } else {
              router.push(url as Href);
            }
          },
        });
      } else {
        setVerificationError('Email verification failed. Please try again.');
      }
    } catch (err: any) {
      setVerificationError(err?.message || 'Verification failed. Please try again.');
      console.error('Verification error:', err);
    }
  };

  /**
   * Resend verification code
   */
  const handleResendCode = async () => {
    try {
      setVerificationError('');
      await signUp.verifications.sendEmailCode();
      setVerificationError('New code sent to your email.');
    } catch (err: any) {
      setVerificationError(err?.message || 'Failed to resend code.');
    }
  };

  if (showVerification) {
    return (
      <AuthContainer>
        <View className="mb-6 gap-2">
          <Text className="text-2xl font-sans-bold text-primary">Verify your email</Text>
          <Text className="text-sm font-sans-regular text-muted-foreground">
            We sent a 6-digit code to {email}
          </Text>
        </View>

        <View className="mb-4 gap-2">
          <TextInputField
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
            maxLength={6}
            editable={fetchStatus !== 'fetching'}
          />
          {verificationError && <ErrorAlert message={verificationError} />}
        </View>

        <SubmitButton
          title="Verify Email"
          loading={fetchStatus === 'fetching'}
          disabled={fetchStatus === 'fetching'}
          onPress={handleVerifyEmail}
        />

        <SubmitButton
          title="Resend Code"
          disabled={fetchStatus === 'fetching'}
          onPress={handleResendCode}
        />
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      {/* Header */}
      <View className="mb-6 gap-2">
        <Text className="text-3xl font-sans-extrabold text-primary">Join SubSnap</Text>
        <Text className="text-sm font-sans-regular text-muted-foreground">
          Create an account to start managing your subscriptions smartly
        </Text>
      </View>

      {/* Email Field */}
      <View className="mb-4 gap-1">
        <TextInputField
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          editable={fetchStatus !== 'fetching'}
          error={validationErrors.email}
        />
      </View>

      {/* Password Field */}
      <View className="mb-4 gap-1">
        <TextInputField
          label="Password"
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={fetchStatus !== 'fetching'}
          error={validationErrors.password}
        />
      </View>

      <View className="mb-4 gap-1">
        <TextInputField
          ref={confirmPasswordRef}
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={fetchStatus !== 'fetching'}
          error={validationErrors.confirmPassword}
        />
      </View>

      {globalError && <ErrorAlert message={globalError} />}

      <SubmitButton
        title="Create Account"
        loading={fetchStatus === 'fetching'}
        disabled={fetchStatus === 'fetching' || !email || !password || !confirmPassword}
        onPress={handleSignUp}
      />

      <SegmentedLink
        text="Already have an account?"
        linkText="Sign in"
        href="/(auth)/login"
      />
    </AuthContainer>
  );
}
