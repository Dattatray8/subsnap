import AuthContainer from '@/components/auth/AuthContainer';
import ErrorAlert from '@/components/auth/ErrorAlert';
import SegmentedLink from '@/components/auth/SegmentedLink';
import SubmitButton from '@/components/auth/SubmitButton';
import TextInputField from '@/components/auth/TextInputField';
import { validateEmail, validatePassword, validateVerificationCode } from '@/lib/auth-validation';
import { useSignIn } from '@clerk/expo';
import { useRouter, type Href } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // MFA verification state
  const [showMFAVerification, setShowMFAVerification] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');

  const passwordRef = useRef<TextInput>(null);

  /**
   * Handle initial sign-in with email/password
   */
  const handleSignIn = async () => {
    setValidationErrors({});
    setGlobalError('');

    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.valid || !passwordValidation.valid) {
      setValidationErrors({
        email: emailValidation.message || '',
        password: passwordValidation.message || '',
      });
      return;
    }

    try {
      const { error } = await signIn.password({
        emailAddress: email,
        password,
      });

      if (error) {
        const errorMessage = error?.message || 'Sign-in failed. Please try again.';
        setGlobalError(errorMessage);
        console.error('Sign-in error:', error);
        return;
      }

      // Check sign-in status
      if (signIn.status === 'complete') {
        // Redirect to home
        router.push('/(tabs)' as Href);
      } else if (signIn.status === 'needs_second_factor') {
        // User has MFA enabled
        setShowMFAVerification(true);
      } else if (signIn.status === 'needs_client_trust') {
        // Email code verification required
        setShowMFAVerification(true);
      }
    } catch (err) {
      console.error('Sign-in exception:', err);
      setGlobalError('An error occurred. Please try again.');
    }
  };

  /**
   * Handle MFA verification code submission
   */
  const handleMFASubmit = async () => {
    const codeValidation = validateVerificationCode(mfaCode);
    if (!codeValidation.valid) {
      setMfaError(codeValidation.message || '');
      return;
    }

    try {
      setMfaError('');
      await signIn.mfa.verifyEmailCode({ code: mfaCode });

      if (signIn.status === 'complete') {
        await signIn.finalize({
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
        setMfaError('Verification code is invalid. Please try again.');
      }
    } catch (err: any) {
      setMfaError(err?.message || 'Code verification failed. Please try again.');
      console.error('MFA error:', err);
    }
  };

  /**
   * Resend MFA code
   */
  const handleResendCode = async () => {
    try {
      setMfaError('');
      await signIn.mfa.sendEmailCode();
      setMfaError('New code sent to your email.');
    } catch (err: any) {
      setMfaError(err?.message || 'Failed to resend code.');
    }
  };

  if (showMFAVerification) {
    return (
      <AuthContainer>
        <View className="mb-6 gap-2">
          <Text className="text-2xl font-sans-bold text-primary">One more step</Text>
          <Text className="text-sm font-sans-regular text-muted-foreground">
            We sent a verification code to {email}
          </Text>
        </View>

        <View className="mb-4 gap-2">
          <TextInputField
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={mfaCode}
            onChangeText={setMfaCode}
            keyboardType="numeric"
            maxLength={6}
            editable={fetchStatus !== 'fetching'}
          />
          {mfaError && <ErrorAlert message={mfaError} />}
        </View>

        <SubmitButton
          title="Verify"
          loading={fetchStatus === 'fetching'}
          disabled={fetchStatus === 'fetching'}
          onPress={handleMFASubmit}
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
        <Text className="text-3xl font-sans-extrabold text-primary">Welcome Back</Text>
        <Text className="text-sm font-sans-regular text-muted-foreground">
          Sign in to manage your subscriptions with SubSnap
        </Text>
      </View>

      {/* Email Field */}
      <View className="mb-6 gap-1">
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
      <View className="gap-1">
        <TextInputField
          ref={passwordRef}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          editable={fetchStatus !== 'fetching'}
          error={validationErrors.password}
        />
      </View>

      {globalError && <ErrorAlert message={globalError} />}

      <SubmitButton
        title="Continue"
        loading={fetchStatus === 'fetching'}
        disabled={fetchStatus === 'fetching' || !email || !password}
        onPress={handleSignIn}
      />

      <SegmentedLink
        text="Don't have an account?"
        linkText="Create one"
        href="/(auth)/register"
      />
    </AuthContainer>
  );
}

