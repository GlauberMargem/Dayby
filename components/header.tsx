import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import logo from '../assets/Dayby.png';
export default function Header() {
    const router = useRouter();
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/')}>
                <Image source={logo} style={styles.image} />
            </TouchableOpacity>
        </View >
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10,
    },
    image: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
});
