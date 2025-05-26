import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import logo from '../assets/Dayby.png';
export default function Header() {
    const router = useRouter();
    return (
        <View style={styles.header}>
            <TouchableOpacity>
                <Ionicons name="menu" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/')}>
                <Image source={logo} style={styles.image} />
            </TouchableOpacity>
            <View style={{ width: 30 }} />
        </View >
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        paddingTop: 10,
    },
    image: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
});
