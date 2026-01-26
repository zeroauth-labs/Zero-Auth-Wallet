import { useWalletStore } from '@/store/wallet-store';
import { useRouter } from 'expo-router';
import { Info, RefreshCw, Smartphone, Trash2 } from 'lucide-react-native';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const did = useWalletStore((state) => state.did);
    const publicKeyHex = useWalletStore((state) => state.publicKeyHex);
    const resetWallet = useWalletStore((state) => state.resetWallet);
    const router = useRouter();

    const handleReset = () => {
        Alert.alert(
            "Reset Wallet",
            "This will delete your private key and identity. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete & Reset",
                    style: "destructive",
                    onPress: async () => {
                        await resetWallet();
                        router.replace('/onboarding');
                    }
                }
            ]
        );
    };

    const handleReload = () => {
        // Expo Go specific reload or just navigation reset
        // Since full reload is hard inside React Comp without native modules sometimes, 
        // we will simulate by navigating to splash or onboarding check
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <View className="px-6 py-6 border-b border-white/5">
                <Text className="text-foreground text-3xl font-bold">Settings</Text>
                <Text className="text-muted-foreground">Manage your device identity</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">

                {/* Identity Card */}
                <View className="bg-card p-5 rounded-2xl border border-primary/20 shadow-sm mb-6">
                    <View className="flex-row items-center gap-2 mb-4">
                        <Smartphone size={20} color="#7aa2f7" />
                        <Text className="font-bold text-foreground text-lg">Device Identity</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-xs font-bold text-muted-foreground uppercase mb-1">DID (Decentralized ID)</Text>
                        <Text className="font-mono text-xs text-[#7aa2f7] bg-black/20 p-2 rounded border border-white/5">
                            {did || 'Not initialized'}
                        </Text>
                    </View>

                    <View>
                        <Text className="text-xs font-bold text-muted-foreground uppercase mb-1">Public Key Fingerprint</Text>
                        <Text className="font-mono text-xs text-[#7aa2f7] bg-black/20 p-2 rounded border border-white/5" numberOfLines={1} ellipsizeMode="middle">
                            {publicKeyHex || 'Loading...'}
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <Text className="text-sm font-bold text-muted-foreground uppercase mb-3 px-1">Actions</Text>

                <TouchableOpacity
                    onPress={handleReset}
                    className="bg-card p-4 rounded-xl border border-error/20 flex-row items-center gap-4 mb-3 active:bg-error/10"
                >
                    <View className="w-10 h-10 bg-error/10 rounded-full items-center justify-center">
                        <Trash2 size={20} color="#f7768e" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-foreground font-bold">Reset Wallet</Text>
                        <Text className="text-muted-foreground text-xs">Wipe keys and start fresh</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleReload}
                    className="bg-card p-4 rounded-xl border border-primary/20 flex-row items-center gap-4 active:bg-primary/10"
                >
                    <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                        <RefreshCw size={20} color="#7aa2f7" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-foreground font-bold">Reload App</Text>
                        <Text className="text-muted-foreground text-xs">Refresh wallet state</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>

            {/* Footer */}
            <View className="p-6 items-center">
                <View className="flex-row items-center gap-2 mb-1">
                    <Info size={14} color="#94a3b8" />
                    <Text className="text-slate-400 font-bold">Zero Auth Wallet</Text>
                </View>
                <Text className="text-slate-500 text-xs">Version 0.0.4 (Dev)</Text>
            </View>
        </SafeAreaView>
    );
}
