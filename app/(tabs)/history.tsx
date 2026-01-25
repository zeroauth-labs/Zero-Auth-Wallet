import { useAuthStore } from '@/store/auth-store';
import { Calendar, CheckCircle2 } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const formatDate = (ms: number) => {
    return new Date(ms).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
};

export default function HistoryScreen() {
    const history = useAuthStore((state) => state.history);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="flex-1 px-4">
                <View className="py-4 mb-2">
                    <Text className="text-primary font-bold text-sm tracking-wider uppercase">Activity Log</Text>
                    <Text className="text-foreground text-2xl font-bold">History</Text>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                    {history.length > 0 ? (
                        history.map((session) => (
                            <View key={session.id} className="bg-card border border-border p-4 rounded-xl mb-3 flex-row items-center gap-3">
                                <View className="w-10 h-10 rounded-full bg-[#1a1b26] border border-border items-center justify-center">
                                    <CheckCircle2 size={18} color="#565f89" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-foreground font-medium text-base">{session.serviceName}</Text>
                                    <View className="flex-row items-center gap-1 mt-1">
                                        <Calendar size={12} color="#565f89" />
                                        <Text className="text-[#565f89] text-xs">{formatDate(session.startTime)}</Text>
                                    </View>
                                </View>
                                <View className="items-end">
                                    <Text className="text-muted-foreground text-xs uppercase font-bold text-[#565f89]">Expired</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="items-center justify-center py-10 opacity-50">
                            <Text className="text-foreground">No history available</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
