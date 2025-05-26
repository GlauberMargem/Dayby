import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type IconType = 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons';

interface BotaoPersonalizadoProps {
    title: string;
    onPress: () => void;
    icon: string;
    iconType: IconType; // qual biblioteca usar
}

const BotaoPersonalizado: React.FC<BotaoPersonalizadoProps> = ({ title, onPress, icon, iconType }) => {
    const renderIcon = () => {
        switch (iconType) {
            case 'Ionicons':
                return <Ionicons name={icon as any} size={20} color="#fff" />;
            case 'MaterialIcons':
                return <MaterialIcons name={icon as any} size={20} color="#fff" />;
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={icon as any} size={20} color="#fff" />;
            default:
                return null;
        }
    };

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            {renderIcon()}
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    text: {
        color: '#fff',
        marginLeft: 8,
    },
});

export default BotaoPersonalizado;
