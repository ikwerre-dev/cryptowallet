import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, StatusBar,StyleSheet,View } from 'react-native'; // Import StatusBar and Platform
import { Home, PieChart, RefreshCw, BarChart2, Settings, MoreHorizontal,Clock } from 'react-native-feather';
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
import TransactionsScreen from '../screens/(dashboard)/HistoryScreen.js';
import NotificationScreen from '../screens/(dashboard)/NotificationScreen.js';
import PersonalDetailsScreen from '../screens/(dashboard)/ProfileScreen.js';

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
            <Stack.Screen name="CoinDetailScreen" component={CoinDetailScreen} />
            <Stack.Screen name="Receive" component={ReceiveScreen} />
            <Stack.Screen name="Send" component={SendScreen} />
            <Stack.Screen name="Swap" component={SwapScreen} />
            <Stack.Screen
                name="Notification"
                options={{
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    headerTintColor: '#fff',
                    headerShown: true,
                }}
                component={NotificationScreen}
            />
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


function MarketStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Portfolio" component={TradingViewWidget} />
            <Stack.Screen name="CoinDetailScreen" component={CoinDetailScreen} />
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
            <Stack.Screen
                name="Portfolio"
                component={PortfolioStack}
                options={{
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="Support"
                component={SupportScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="Terms"
                component={TermsScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="Transactions"
                component={TransactionsScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    headerTintColor: '#fff',
                }}
            />
            <Stack.Screen
                name="Profile"
                component={PersonalDetailsScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default function BottomTabNavigator() {
    return (
        <>
            <View style={globalStyles.container}>

                {Platform.OS === 'android' && <StatusBar hidden={true} />}
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
                            tabBarIcon: ({ color }) => <Home stroke={color} width={24} height={24} />,
                        }}
                    />
                    <Tab.Screen
                        name="My Assets"
                        component={PortfolioStack}
                        options={{
                            tabBarIcon: ({ color }) => <PieChart stroke={color} width={24} height={24} />,
                        }}
                    />
                    <Tab.Screen
                        name="P2P"
                        component={P2PTransferScreen}
                        options={{
                            tabBarIcon: ({ color }) => <RefreshCw stroke={color} width={24} height={24} />,
                        }}
                    />
                    <Tab.Screen
                        name="Transactions"
                        component={TransactionsScreen}
                        options={{
                            tabBarIcon: ({ color }) => <Clock stroke={color} width={24} height={24} />,
                        }}
                    />
                    <Tab.Screen
                        name="More"
                        component={MenuStack}
                        options={{
                            tabBarIcon: ({ color }) => <MoreHorizontal stroke={color} width={24} height={24} />,
                        }}
                    />
                </Tab.Navigator>
            </View>
        </>
    );
}