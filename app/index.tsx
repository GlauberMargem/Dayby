import { FontAwesome5, Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import BotaoPersonalizado from '@/components/botaoPersonalizado';
import Header from '@/components/header';

export default function HomeScreen() {
    const router = useRouter();
    const [rotinas, setRotinas] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            const carregarRotinas = async () => {
                const rotinasSalvas = await AsyncStorage.getItem('@rotinas');
                if (rotinasSalvas) {
                    setRotinas(JSON.parse(rotinasSalvas));
                } else {
                    setRotinas([]);
                }
            };

            carregarRotinas();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.subtitle}>
                    <Text style={{ fontWeight: 'bold' }}>Organize seus dias, domine sua rotina.</Text>
                </Text>

                {/* Botões sempre visíveis */}
                <BotaoPersonalizado
                    title="Criar nova rotina"
                    onPress={() => router.push('/novaRotina')}
                    icon="add-circle-outline"
                    iconType="Ionicons"
                />

                <BotaoPersonalizado
                    title="Verificar inventário"
                    onPress={() => router.push('/novaRotina')} // ajuste aqui depois
                    icon="inventory"
                    iconType="MaterialIcons"
                />

                <BotaoPersonalizado
                    title="Lista de compras"
                    onPress={() => router.push('/compras')} // ajuste aqui depois
                    icon="cart-outline"
                    iconType="Ionicons"
                />

                {/* Rotinas cadastradas */}
                {rotinas.length > 0 && (
                    <>
                        <Text style={[styles.subtitle, { marginTop: 20 }]}>Minhas Rotinas</Text>
                        {rotinas.map((rotina, index) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.cardTitle}>{rotina.nome}</Text>
                                <Text style={styles.cardSubtitle}><Octicons name="number" size={15} /> Quantidade</Text>
                                <Text style={styles.cardItem}>{rotina.quantidade}</Text>
                                <Text style={styles.cardSubtitle}><FontAwesome5 name="calendar" size={15} /> Dias</Text>
                                <Text style={styles.cardItem}>{rotina.dias.join(', ')}</Text>
                                <Text style={styles.cardSubtitle}><FontAwesome5 name="shopping-bag" size={15} /> Itens:</Text>
                                {rotina.itens.map((item: string, i: number) => (
                                    <Text key={i} style={styles.cardItem}>{item}</Text>
                                ))}
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1c',
    },
    content: {
        paddingHorizontal: 20,
    },
    subtitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    progressText: {
        color: '#fff',
        fontSize: 14,
        marginTop: 5,
    },
    cardSubtitle: {
        color: '#fff',
        fontSize: 14,
        marginTop: 10,
        fontWeight: 'bold',
    },
    cardItem: {
        color: '#fff',
        fontSize: 14,
        backgroundColor: '#1c1c1c',
        borderRadius: 12,
        padding: 10,
        marginTop: 5
    },
});
