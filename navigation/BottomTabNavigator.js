import React from 'react';
import { Platform, View, StyleSheet, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, PieChart, RefreshCw, BarChart2, MoreHorizontal } from 'react-native-feather';
import DashboardScreen from '../screens/(dashboard)/Dashboard.js';
import PortfolioScreen from '../screens/(dashboard)/Portfolio';
import TradingViewWidget from '../screens/(dashboard)/MarketScreen';
import MenuScreen from '../screens/(dashboard)/MenuScreen';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: Platform.OS === 'android' ? 70 : 0,  // Adds padding only for Android
    },
});

function DashboardStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </Stack.Navigator>
    );
}

function PortfolioStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Portfolio" component={PortfolioScreen} />
        </Stack.Navigator>
    );
}

function MenuStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Menu"
                options={{ headerShown: false }}
                component={MenuScreen}
            />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <View style={globalStyles.container}>
            <StatusBar hidden={Platform.OS === 'android'} />
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#000',
                        borderTopColor: '#222',
                    },
                    tabBarActiveTintColor: '#7B61FF',
                    tabBarInactiveTintColor: '#666',
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={DashboardStack}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Home stroke={color} width={24} height={24} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="My Assets"
                    component={PortfolioStack}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <PieChart stroke={color} width={24} height={24} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Markets"
                    component={TradingViewWidget}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <BarChart2 stroke={color} width={24} height={24} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="More"
                    component={MenuStack}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <MoreHorizontal stroke={color} width={24} height={24} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}
