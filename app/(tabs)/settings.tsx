import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background items-center justify-center">
            <Text className="text-foreground text-xl font-bold">Settings</Text>
            <Text className="text-[#565f89] mt-2">App Version 2.0.0</Text>
        </SafeAreaView>
    );
}
