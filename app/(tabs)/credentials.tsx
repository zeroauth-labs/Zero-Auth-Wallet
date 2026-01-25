import { useAuthStore } from '@/store/auth-store';
import clsx from 'clsx';
import { BadgeCheck, Fingerprint, FolderLock } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function CredentialCard({ credential }: { credential: any }) {
    // Mock styles based on issuer
    const isGovt = credential.issuer.includes('Government');
    const bgClass = isGovt ? 'bg-primary/10 border-primary/30' : 'bg-secondary/10 border-secondary/30';
    const iconColor = isGovt ? '#7aa2f7' : '#bb9af7';

    return (
        <View className={clsx("p-5 rounded-2xl border mb-4 relative overflow-hidden", bgClass)}>
            {/* Background Decoration */}
            <View className="absolute -right-10 -bottom-10 opacity-10">
                <Fingerprint size={120} color={iconColor} />
            </View>

            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <Text className="text-[#565f89] text-xs uppercase font-bold tracking-widest mb-1">{credential.issuer}</Text>
                    <Text className="text-foreground text-xl font-bold">{credential.type}</Text>
                </View>
                {credential.verified && (
                    <View className="bg-success/20 px-2 py-1 rounded flex-row items-center gap-1">
                        <BadgeCheck size={14} color="#9ece6a" />
                        <Text className="text-success text-xs font-bold uppercase">Verified</Text>
                    </View>
                )}
            </View>

            <View>
                <Text className="text-[#565f89] text-xs mb-2">Attributes</Text>
                <View className="flex-row flex-wrap gap-2">
                    {Object.keys(credential.attributes).map((key) => (
                        <View key={key} className="bg-background/50 border border-border px-3 py-1.5 rounded-lg">
                            <Text className="text-[#a9b1d6] text-xs font-mono">
                                {key.replace(/_/g, ' ')}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
}

export default function CredentialsScreen() {
    const credentials = useAuthStore((state) => state.credentials);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="flex-1 px-4">
                <View className="py-4 mb-2">
                    <Text className="text-primary font-bold text-sm tracking-wider uppercase">My Wallet</Text>
                    <Text className="text-foreground text-2xl font-bold">Credentials</Text>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                    {credentials.length > 0 ? (
                        credentials.map((cred) => (
                            <CredentialCard key={cred.id} credential={cred} />
                        ))
                    ) : (
                        <View className="items-center justify-center py-20">
                            <View className="w-20 h-20 rounded-full bg-card items-center justify-center mb-4">
                                <FolderLock size={32} color="#565f89" />
                            </View>
                            <Text className="text-muted-foreground text-center">No credentials added yet.</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
