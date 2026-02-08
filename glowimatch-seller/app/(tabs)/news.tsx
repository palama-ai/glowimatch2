import { Stack } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Lightbulb,
  TrendingUp,
  Shield,
  Users,
  Package,
  Star,
} from 'lucide-react-native';

import Colors from '@/constants/colors';

interface NewsTip {
  id: string;
  icon: typeof Lightbulb;
  title: string;
  description: string;
  category: string;
}

const NEWS_TIPS: NewsTip[] = [
  {
    id: '1',
    icon: Lightbulb,
    title: 'Complete Product Information',
    description:
      'Products with detailed descriptions, high-quality images, and complete ingredient lists get 3x more views.',
    category: 'Best Practice',
  },
  {
    id: '2',
    icon: Shield,
    title: 'Safety First',
    description:
      'Always disclose all ingredients accurately. Our safety system checks for toxic ingredients to protect customers.',
    category: 'Safety',
  },
  {
    id: '3',
    icon: TrendingUp,
    title: 'Update Regularly',
    description:
      'Keep your product information up-to-date. Regular updates help maintain customer trust and improve visibility.',
    category: 'Growth',
  },
  {
    id: '4',
    icon: Users,
    title: 'Customer Engagement',
    description:
      'Respond to customer feedback and keep your profile active. Engaged sellers see 50% more conversions.',
    category: 'Tips',
  },
  {
    id: '5',
    icon: Package,
    title: 'Organize Your Catalog',
    description:
      'Use categories and skin type tags effectively. Well-organized products are easier for customers to find.',
    category: 'Organization',
  },
  {
    id: '6',
    icon: Star,
    title: 'Quality Over Quantity',
    description:
      'Focus on listing quality products with accurate information rather than adding many incomplete listings.',
    category: 'Strategy',
  },
];

export default function NewsScreen() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Best Practice':
        return Colors.primary;
      case 'Safety':
        return Colors.error;
      case 'Growth':
        return Colors.success;
      case 'Tips':
        return Colors.secondary;
      case 'Organization':
        return Colors.accent;
      case 'Strategy':
        return Colors.warning;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.header}
        >
          <Text style={styles.title}>News & Tips</Text>
          <Text style={styles.subtitle}>Stay informed and grow your business</Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.announcementCard}>
            <Text style={styles.announcementBadge}>Platform Update</Text>
            <Text style={styles.announcementTitle}>Welcome to Glowimatch Seller!</Text>
            <Text style={styles.announcementText}>
              We&apos;re excited to have you on board. Check out the tips below to make
              the most of your seller experience.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Seller Tips</Text>
          {NEWS_TIPS.map((tip) => {
            const IconComponent = tip.icon;
            return (
              <View key={tip.id} style={styles.tipCard}>
                <View
                  style={[
                    styles.tipIcon,
                    { backgroundColor: `${getCategoryColor(tip.category)}20` },
                  ]}
                >
                  <IconComponent color={getCategoryColor(tip.category)} size={24} />
                </View>
                <View style={styles.tipContent}>
                  <View style={styles.tipHeader}>
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: getCategoryColor(tip.category) },
                      ]}
                    >
                      <Text style={styles.categoryText}>{tip.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            );
          })}

          <View style={styles.bottomCard}>
            <Text style={styles.bottomTitle}>Need Help?</Text>
            <Text style={styles.bottomText}>
              If you have questions or need support, check out our help center or
              contact our seller support team.
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.textLight,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  announcementCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  announcementBadge: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 8,
    textTransform: 'uppercase' as const,
  },
  announcementTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  announcementText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  tipDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bottomCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  bottomTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  bottomText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
