import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, PieChart, RefreshCw, BarChart2, Settings, MoreHorizontal } from 'react-native-feather';
import DashboardScreen from '../screens/(dashboard)/Dashboard.js';
import CoinDetailScreen from '../screens/(dashboard)/CoinDetailScreen';
import PortfolioScreen from '../screens/(dashboard)/Portfolio';
import TradingViewWidget from '../screens/(dashboard)/MarketScreen';
import MenuScreen from '../screens/(dashboard)/MenuScreen';
import SupportScreen from '../screens/(dashboard)/SupportScreen';
import TermsScreen from '../screens/(dashboard)/TermsScreen';
import ReceiveScreen from '../screens/(dashboard)/Receive';
import SendScreen from '../screens/(dashboard)/Send';
import SwapScreen from '../screens/(dashboard)/Swap';
import P2PTransferScreen from '../screens/(dashboard)/P2P.js';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DashboardStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="CoinDetailScreen" component={CoinDetailScreen} />
            <Stack.Screen name="Receive" component={ReceiveScreen} />
            <Stack.Screen name="Send" component={SendScreen} />
            <Stack.Screen name="Swap" component={SwapScreen} />
        </Stack.Navigator>
    );
}


function PortfolioStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Portfolio" component={PortfolioScreen} />
            <Stack.Screen name="CoinDetailScreen" component={CoinDetailScreen} />
        </Stack.Navigator>
    );
}


function MenuStack() {
    return (
        <Stack.Navigator >
            <Stack.Screen name="Menu" options={{ headerShown: false }} component={MenuScreen} />
            <Stack.Screen name="Portfolio"  component={PortfolioStack} />
            <Stack.Screen name="Support" component={SupportScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
        </Stack.Navigator>
    );
}

export default function BottomTabNavigator() {
    return (
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
                component={DashboardStack} // Use the stack navigator here
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
                name="P2P"
                component={P2PTransferScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <RefreshCw stroke={color} width={24} height={24} />
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
    );
}
