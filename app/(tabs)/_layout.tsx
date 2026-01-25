import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import { History, LayoutDashboard, ScanLine, WalletCards } from 'lucide-react-native';
import React from 'react';
import { Platform, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1b26', // Tokyo Night Background
          borderTopColor: '#16161e',
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#7aa2f7',
        tabBarInactiveTintColor: '#565f89',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center -mt-6">
              <View className={`w-16 h-16 rounded-full items-center justify-center border-4 border-[#1a1b26] ${focused ? 'bg-primary shadow-lg shadow-primary/50' : 'bg-[#16161e]'}`}>
                <ScanLine size={28} color={focused ? '#1a1b26' : '#7aa2f7'} />
              </View>
            </View>
          ),
          tabBarLabel: () => null, // Hide label for custom button
        }}
      />
      <Tabs.Screen
        name="credentials"
        options={{
          title: 'Credentials',
          tabBarIcon: ({ color }) => <WalletCards size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
