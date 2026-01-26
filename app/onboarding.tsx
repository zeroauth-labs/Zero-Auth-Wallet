import { useWalletStore } from '@/store/wallet-store';
import { useRouter } from 'expo-router';
import { Lock, ShieldCheck, Snowflake } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
    const router = useRouter();
    const initializeWallet = useWalletStore((state) => state.initializeWallet);
    const did = useWalletStore((state) => state.did);

    const [step, setStep] = useState<'welcome' | 'generating' | 'success'>('welcome');

    useEffect(() => {
        // Auto-start generation after slight delay
        if (step === 'welcome') {
            const timer = setTimeout(() => {
                setStep('generating');
                startGeneration();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const startGeneration = async () => {
        await initializeWallet();
        setStep('success');

        // Navigate after showing success
        setTimeout(() => {
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <SafeAreaView className="flex-1 bg-background items-center justify-center">

            {step === 'welcome' && (
                <Animated.View exiting={FadeOut} className="items-center">
                    <View className="mb-6 w-24 h-24 bg-card rounded-3xl items-center justify-center border border-primary/20 shadow-2xl shadow-primary/20">
                        <Snowflake size={48} color="#7aa2f7" />
                    </View>
                    <Text className="text-3xl font-bold text-foreground mb-2">Zero Auth</Text>
                    <Text className="text-muted-foreground text-center">Privacy First. Device Bound.</Text>
                </Animated.View>
            )}

            {step === 'generating' && (
                <Animated.View entering={FadeIn} exiting={FadeOut} className="items-center">
                    <View className="relative w-32 h-32 items-center justify-center mb-8">
                        <ActivityIndicator size="large" color="#7aa2f7" />
                    </View>
                    <Text className="text-xl font-bold text-foreground mb-4">Securing Identity...</Text>
                    <View className="bg-card px-4 py-2 rounded-lg border border-white/5">
                        <Text className="text-[#7aa2f7] font-mono text-xs">Generating Ed25519 Keypair</Text>
                    </View>
                </Animated.View>
            )}

            {step === 'success' && (
                <Animated.View entering={FadeInDown} className="items-center w-full px-8">
                    <View className="w-20 h-20 bg-success/10 rounded-full items-center justify-center mb-6 border border-success/20">
                        <ShieldCheck size={40} color="#9ece6a" />
                    </View>
                    <Text className="text-2xl font-bold text-foreground mb-2">Identity Secured</Text>
                    <Text className="text-muted-foreground text-center mb-8">Your wallet is now cryptographically bound to this device.</Text>

                    <View className="w-full bg-card p-4 rounded-xl border border-primary/20">
                        <Text className="text-muted-foreground text-xs uppercase font-bold mb-2">Your DID</Text>
                        <Text className="text-primary font-mono text-sm" numberOfLines={1} ellipsizeMode="middle">
                            {did || 'did:key:loading...'}
                        </Text>
                    </View>
                </Animated.View>
            )}

            {/* Footer */}
            <View className="absolute bottom-10">
                <View className="flex-row items-center gap-2 opacity-50">
                    <Lock size={12} color="#94a3b8" />
                    <Text className="text-slate-400 text-xs">Zero-Knowledge Architecture</Text>
                </View>
            </View>

        </SafeAreaView>
    );
}
