import { Credential, useAuthStore } from '@/store/auth-store';
import clsx from 'clsx';
import { useRouter } from 'expo-router';
import { BadgeCheck, FolderLock, GraduationCap, Landmark, Plus, Trash2 } from 'lucide-react-native';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function CredentialCard({ credential }: { credential: Credential }) {
    const removeCredential = useAuthStore((state) => state.removeCredential); // Need to add this action to store

    // Logic for Dynamic Icons
    const isUniversity = credential.type === 'Student ID';
    const Icon = isUniversity ? GraduationCap : Landmark;
    const bgClass = isUniversity ? 'bg-secondary/10 border-secondary/30' : 'bg-primary/10 border-primary/30';
    const iconColor = isUniversity ? '#bb9af7' : '#7aa2f7';
    const displayType = isUniversity ? 'University ID' : credential.type;

    const handleRemove = () => {
        Alert.alert(
            "Revoke Credential?",
            "Removing this credential will deactivate all active Zero-Knowledge circuits associated with it. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Revoke",
                    style: "destructive",
                    onPress: () => removeCredential(credential.id)
                }
            ]
        );
    };

    return (
        <View className={clsx("p-5 rounded-2xl border mb-4 relative overflow-hidden", bgClass)}>
            {/* Background Decoration */}
            <View className="absolute -right-10 -bottom-10 opacity-10">
                <Icon size={120} color={iconColor} />
            </View>

            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <Text className="text-[#565f89] text-xs uppercase font-bold tracking-widest mb-1">{credential.issuer}</Text>
                    <Text className="text-foreground text-xl font-bold">{displayType}</Text>
                </View>
                {credential.verified && (
                    <View className="bg-success/20 px-2 py-1 rounded flex-row items-center gap-1">
                        <BadgeCheck size={14} color="#9ece6a" />
                        <Text className="text-success text-xs font-bold uppercase">Verified</Text>
                    </View>
                )}
            </View>

            <View className="mb-4">
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

            {/* Actions */}
            <View className="flex-row justify-end border-t border-border/10 pt-4">
                <TouchableOpacity onPress={handleRemove} className="flex-row items-center gap-2 bg-black/20 px-3 py-2 rounded-lg">
                    <Trash2 size={14} color="#f7768e" />
                    <Text className="text-error text-xs font-bold">Revoke</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function CredentialsScreen() {
    const credentials = useAuthStore((state) => state.credentials);
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="flex-1 px-4">
                <View className="py-4 mb-2 flex-row justify-between items-end">
                    <View>
                        <Text className="text-primary font-bold text-sm tracking-wider uppercase">My Wallet</Text>
                        <Text className="text-foreground text-2xl font-bold">Credentials</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/add-credential')}
                        className="w-10 h-10 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/30"
                    >
                        <Plus size={24} color="#1a1b26" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                    {credentials.length > 0 ? (
                        credentials.map((cred) => (
                            <CredentialCard key={cred.id} credential={cred} />
                        ))
                    ) : (
                        <View className="items-center justify-center py-20">
                            <View className="w-20 h-20 rounded-full bg-card items-center justify-center mb-4 border border-border">
                                <FolderLock size={32} color="#565f89" />
                            </View>
                            <Text className="text-muted-foreground text-center mb-6">No credentials added yet.</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/add-credential')}
                                className="bg-card border border-primary/50 px-6 py-3 rounded-xl"
                            >
                                <Text className="text-primary font-bold">Add Your First ID</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
