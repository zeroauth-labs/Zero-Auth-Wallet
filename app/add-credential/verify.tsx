import { useAuthStore } from '@/store/auth-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
// import * as Haptics from 'expo-haptics'; // Will handle if not installed

export default function VerifyScreen() {
    const router = useRouter();
    const { issuerName, category, issuerId } = useLocalSearchParams<{ issuerName: string, category: string, issuerId: string }>();
    const addCredential = useAuthStore((state) => state.addCredential);

    const [step, setStep] = useState(0); // 0: Fetching, 1: Verifying ZK, 2: Success

    useEffect(() => {
        // Phase 1: Fetching
        const t1 = setTimeout(() => setStep(1), 2000);

        // Phase 2: Verifying
        const t2 = setTimeout(() => {
            setStep(2);

            // Success Action
            addCredential({
                id: Math.random().toString(36),
                issuer: issuerName,
                type: category === 'university' ? 'Student ID' : 'Government ID',
                issuedAt: Date.now(),
                verified: true,
                attributes: category === 'university' ? {
                    'is_student': true,
                    'university': issuerName,
                    'graduation_year': '2027',
                    'department': 'Computer Science'
                } : {
                    'age_over_18': true,
                    'residency': 'India'
                }
            });

        }, 4500);

        // Phase 3: Redirect
        const t3 = setTimeout(() => {
            router.dismissAll();
            router.navigate('/(tabs)/credentials');
        }, 6500);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    return (
        <View className="flex-1 bg-[#1a1b26] items-center justify-center p-8">
            {step < 2 ? (
                <>
                    <View className="w-20 h-20 rounded-full bg-card items-center justify-center mb-8 border border-primary/20">
                        <ActivityIndicator size="large" color="#7aa2f7" />
                    </View>
                    <Text className="text-foreground text-xl font-bold mb-2">
                        {step === 0 ? 'Connecting to Issuer...' : 'Generating Proof...'}
                    </Text>
                    <Text className="text-[#565f89] text-center">
                        {step === 0 ? `Fetching data from ${issuerName}` : 'Creating Zero-Knowledge Circuit'}
                    </Text>
                </>
            ) : (
                <>
                    <View className="w-24 h-24 rounded-full bg-success/10 items-center justify-center mb-6 border border-success/30">
                        <ShieldCheck size={48} color="#9ece6a" />
                    </View>
                    <Text className="text-foreground text-2xl font-bold mb-2 text-center">Successfully Verified!</Text>
                    <Text className="text-[#565f89] text-center mb-8">
                        Your credentials have been securely stored on your device.
                    </Text>
                    <View className="bg-card px-4 py-2 rounded-lg border border-border">
                        <Text className="text-xs text-[#565f89] font-mono">ZK-PROOF: 0x7f...3a29</Text>
                    </View>
                </>
            )}
        </View>
    );
}
