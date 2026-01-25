import NotificationModal from '@/components/NotificationModal';
import SessionCard from '@/components/SessionCard';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import { Bell, QrCode } from 'lucide-react-native';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const router = useRouter();
  const sessions = useAuthStore((state) => state.sessions);
  const notifications = useAuthStore((state) => state.notifications);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <NotificationModal visible={showNotifications} onClose={() => setShowNotifications(false)} />
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center py-4 mb-2">
          <View>
            <Text className="text-primary font-bold text-sm tracking-wider uppercase">Zero Auth</Text>
            <Text className="text-foreground text-2xl font-bold">Dashboard</Text>
          </View>
          <TouchableOpacity onPress={() => setShowNotifications(true)} className="w-10 h-10 rounded-full bg-card items-center justify-center border border-border">
            <Bell size={20} color="#a9b1d6" />
            {notifications.length > 0 && <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error" />}
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            onPress={() => router.push('/my-qr')}
            className="flex-1 bg-primary/10 border border-primary/30 p-4 rounded-xl items-center justify-center flex-row gap-3 active:bg-primary/20"
          >
            <QrCode size={32} color="#7aa2f7" />
            <View>
              <Text className="text-foreground font-bold text-lg">My QR Code</Text>
              <Text className="text-primary text-xs">Show Zero ID</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text className="text-foreground text-lg font-bold mb-3">Active Sessions</Text>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7aa2f7" />
          }
        >
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <View className="items-center justify-center py-10 opacity-50">
              <Text className="text-foreground">No active sessions</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
