import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default function Index() {
    const { isAuthenticated, isLoading, user } = useAuth();

    // Show loading while checking auth state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // Not authenticated - go to login
    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    // Authenticated but terms not accepted - go to terms
    if (!user?.termsAccepted) {
        return <Redirect href="/accept-terms" />;
    }

    // Authenticated and terms accepted - go to main app
    return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
});
