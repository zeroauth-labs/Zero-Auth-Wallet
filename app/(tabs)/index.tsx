import SessionCard from '@/components/SessionCard';
import { useAuthStore } from '@/store/auth-store';
import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const sessions = useAuthStore((state) => state.sessions);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center py-4 mb-2">
          <View>
            <Text className="text-primary font-bold text-sm tracking-wider uppercase">Zero Auth</Text>
            <Text className="text-foreground text-2xl font-bold">Dashboard</Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-card items-center justify-center border border-border">
            <Bell size={20} color="#a9b1d6" />
            <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error" />
          </View>
        </View>

        {/* Stats Summary */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-card p-3 rounded-xl border border-border">
            <Text className="text-[#565f89] text-xs font-bold uppercase">Active</Text>
            <Text className="text-foreground text-2xl font-bold">{sessions.length}</Text>
          </View>
          <View className="flex-1 bg-card p-3 rounded-xl border border-border">
            <Text className="text-[#565f89] text-xs font-bold uppercase">Protected</Text>
            <Text className="text-success text-2xl font-bold">100%</Text>
          </View>
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
