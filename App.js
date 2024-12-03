import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import OnboardingScreen from './screens/(auth)/OnboardingScreen';
import LoginScreen from './screens/(auth)/Login';
import RegisterScreen from './screens/(auth)/Register';
import DashboardScreen from './screens/(dashboard)/Dashboard';
import { ActivityIndicator, View } from 'react-native';
import SecureWalletScreen from './screens/(auth)/SecureWalletScreen.js';
import SeedPhraseScreen from './screens/(auth)/SeedPhraseScreen.js';
import RemindLaterScreen from './screens/(auth)/RemindLaterScreen.js';
import SeedPhraseRevealScreen from './screens/(auth)/SeedPhraseRevealScreen.js';
import ConfirmSeedPhraseScreen from './screens/(auth)/ConfirmSeedPhraseScreen.js';
import SeedPhraseSuccessScreen from './screens/(auth)/SeedPhraseSuccessScreen.js';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import CoinDetailScreen from './screens/(dashboard)/CoinDetailScreen.js'
const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={OnboardingScreen} />
      <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
      <Stack.Screen name="Register" options={{ headerShown: false }} component={RegisterScreen} />
      <Stack.Screen name="CreatePassword" options={{ headerShown: false }} component={RegisterScreen} />
      <Stack.Screen name="SecureWallet" options={{ headerShown: false }} component={SecureWalletScreen} />
      <Stack.Screen name="SeedPhrase" options={{ headerShown: false }} component={SeedPhraseScreen} />
      <Stack.Screen name="RemindLater" options={{ headerShown: false }} component={RemindLaterScreen} />
      <Stack.Screen name="SeedPhraseReveal" options={{ headerShown: false }} component={SeedPhraseRevealScreen} />
      <Stack.Screen name="ConfirmSeedPhrase" options={{ headerShown: false }} component={ConfirmSeedPhraseScreen} />
      <Stack.Screen name="SeedPhraseSuccess" options={{ headerShown: false }} component={SeedPhraseSuccessScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <BottomTabNavigator>
      <Stack.Navigator>
        <Stack.Screen name="CoinDetailScreen" options={{ headerShown: false }} component={CoinDetailScreen} />
      </Stack.Navigator>
    </BottomTabNavigator>

  );
};

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}