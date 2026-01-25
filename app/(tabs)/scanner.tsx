import { useRouter } from 'expo-router';
import { Camera, ScanLine, X } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannerScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-black" edges={['top', 'bottom']}>
            <View className="flex-1 relative">
                {/* Mock Camera View */}
                <View className="absolute inset-0 bg-gray-900 justify-center items-center">
                    <View className="opacity-20 mb-4">
                        <Camera size={64} color="#565f89" />
                    </View>
                    <Text className="text-[#565f89]">Camera Preview Placeholder</Text>
                </View>

                {/* Overlay */}
                <View className="flex-1 justify-between p-6">
                    <View className="flex-row justify-between items-center mt-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full bg-black/40 items-center justify-center backdrop-blur-md"
                        >
                            <X size={20} color="white" />
                        </TouchableOpacity>
                        <View className="bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                            <Text className="text-white font-medium">Scan QR Code</Text>
                        </View>
                        <View className="w-10" />
                    </View>

                    {/* Scanner Marker */}
                    <View className="items-center justify-center flex-1">
                        <View className="w-64 h-64 border-2 border-primary rounded-3xl items-center justify-center relative">
                            <View className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-xl" />
                            <View className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-xl" />
                            <View className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-xl" />
                            <View className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-xl" />

                            <ScanLine size={48} color="#7aa2f7" className="animate-pulse opacity-50" />
                        </View>
                        <Text className="text-white/70 mt-8 text-center text-sm bg-black/40 px-4 py-2 rounded-full">
                            Align code within browser frame
                        </Text>
                    </View>

                    <View className="h-20" />
                </View>
            </View>
        </SafeAreaView>
    );
}
