import { useAuthStore } from '@/store/auth-store';
import { Calendar, CheckCircle2, ShieldCheck, Fingerprint } from 'lucide-react-native';
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
                            <View key={session.id} className="bg-card border border-white/5 p-5 rounded-2xl mb-4 shadow-sm">
                                <View className="flex-row justify-between items-start mb-4">
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 items-center justify-center">
                                            <ShieldCheck size={20} color="#9ece6a" />
                                        </View>
                                        <View>
                                            <Text className="text-foreground font-bold text-lg">{session.serviceName}</Text>
                                            <Text className="text-[#565f89] text-[10px] font-mono">{session.verifierDid}</Text>
                                        </View>
                                    </View>
                                    <View className="bg-[#1a1b26] px-2 py-1 rounded">
                                        <Text className="text-[#565f89] text-[10px] uppercase font-bold">ZK Verified</Text>
                                    </View>
                                </View>

                                <View className="mb-4">
                                    <Text className="text-[#565f89] text-[10px] uppercase font-bold mb-2 tracking-widest">Attributes Disclosed</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {session.infoRequested.map((claim, idx) => (
                                            <View key={idx} className="bg-primary/5 border border-primary/10 px-2 py-1 rounded-md">
                                                <Text className="text-primary text-[10px] font-medium">{claim}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                <View className="flex-row justify-between items-center pt-3 border-t border-white/5">
                                    <View className="flex-row items-center gap-1.5">
                                        <Calendar size={12} color="#565f89" />
                                        <Text className="text-[#565f89] text-xs font-medium">{formatDate(session.startTime)}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-1">
                                        <Fingerprint size={12} color="#9ece6a" />
                                        <Text className="text-success text-[10px] font-bold">Proof Signed</Text>
                                    </View>
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
