import { Tabs } from "expo-router";
import { LayoutDashboard, Package, Shield, User, Lightbulb } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

import Colors from "@/constants/colors";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textMuted,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.border,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
                    height: Platform.OS === 'ios' ? 84 : 60,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <LayoutDashboard color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: "Products",
                    tabBarIcon: ({ color, focused }) => (
                        <Package color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="violations"
                options={{
                    title: "Account",
                    tabBarIcon: ({ color, focused }) => (
                        <Shield color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="news"
                options={{
                    title: "Tips",
                    tabBarIcon: ({ color, focused }) => (
                        <Lightbulb color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <User color={color} size={focused ? 26 : 24} strokeWidth={focused ? 2.5 : 2} />
                    ),
                }}
            />
        </Tabs>
    );
}
