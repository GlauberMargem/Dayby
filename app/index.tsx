// /app/index.tsx

import { FontAwesome5, Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

import BotaoPersonalizado from '@/components/botaoPersonalizado';
import Header from '@/components/header';

interface RotinaItem {
    name: string;
    usedQuantity: number;
}

interface Rotina {
    nome: string;
    descricao: string;
    dias: string[];
    quantidade: number;
    itens: RotinaItem[];
}

export default function HomeScreen() {
    const router = useRouter();
    const [rotinas, setRotinas] = useState<Rotina[]>([]);

    // Função para ler as rotinas do AsyncStorage e atualizar estado
    const carregarRotinas = async () => {
        try {
            const raw = await AsyncStorage.getItem('@rotinas');
            if (raw) {
                const arr: Rotina[] = JSON.parse(raw);
                const normalizadas = arr.map((r) => ({
                    nome: r.nome,
                    descricao: r.descricao || '',
                    dias: Array.isArray(r.dias) ? r.dias : [],
                    quantidade: typeof r.quantidade === 'number' ? r.quantidade : 0,
                    itens: Array.isArray(r.itens) ? r.itens : [],
                }));
                console.log('Rotinas carregadas:', normalizadas);
                setRotinas(normalizadas);
            } else {
                console.log('Nenhuma rotina encontrada em AsyncStorage.');
                setRotinas([]);
            }
        } catch (e) {
            console.error('Erro ao carregar rotinas:', e);
            setRotinas([]);
        }
    };

    // Sempre que a tela entrar em foco, recarrega as rotinas
    useFocusEffect(
        useCallback(() => {
            carregarRotinas();
        }, [])
    );

    // Botão “Adicionar rotina de exemplo”
    const adicionarRotinaExemplo = async () => {
        const exemplo: Rotina = {
            nome: 'Rotina de Exemplo',
            descricao: 'Esta é uma rotina inserida como teste',
            dias: ['Seg', 'Qua', 'Sex'],
            quantidade: 2,
            itens: [{ name: 'Sacola', usedQuantity: 1 }],
        };
        try {
            const raw = await AsyncStorage.getItem('@rotinas');
            const arr: Rotina[] = raw ? JSON.parse(raw) : [];
            arr.push(exemplo);
            await AsyncStorage.setItem('@rotinas', JSON.stringify(arr));
            Alert.alert('Sucesso', 'Rotina de exemplo adicionada.');
            console.log('Rotina exemplo adicionada. Novo array:', arr);
            carregarRotinas();
        } catch (e) {
            console.error('Erro ao adicionar rotina de exemplo:', e);
            Alert.alert('Erro', 'Não foi possível adicionar o exemplo.');
        }
    };

    // Botão “Limpar todas as rotinas (e todo o AsyncStorage)”
    const limparTodasRotinas = async () => {
        Alert.alert(
            'Confirmar limpeza',
            'Isso apagará TODAS as rotinas, inventário e compras. Deseja continuar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Limpar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            console.log('AsyncStorage totalmente limpo');
                            // Força recarga para refletir remoção
                            carregarRotinas();
                            Alert.alert('Sucesso', 'Todos os dados foram apagados.');
                        } catch (e) {
                            console.error('Erro ao limpar AsyncStorage:', e);
                            Alert.alert('Erro', 'Não foi possível limpar. Tente novamente.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="always">
                {/* Botões rápidos de teste */}
                <View style={styles.quickButtonsContainer}>
                    <TouchableOpacity style={styles.quickButton} onPress={adicionarRotinaExemplo}>
                        <Text style={styles.quickButtonText}>+ Rotina Exemplo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.quickButton, styles.clearButton]} onPress={limparTodasRotinas}>
                        <Text style={styles.quickButtonText}>🗑️ Limpar tudo</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.subtitle}>
                    <Text style={{ fontWeight: 'bold' }}>Organize seus dias, domine sua rotina.</Text>
                </Text>

                {/* Botões principais */}
                <BotaoPersonalizado
                    title="Criar nova rotina"
                    onPress={() => router.push('/novaRotina')}
                    icon="add-circle-outline"
                    iconType="Ionicons"
                />

                <BotaoPersonalizado
                    title="Verificar inventário"
                    onPress={() => router.push('/inventario')}
                    icon="inventory"
                    iconType="MaterialIcons"
                />

                <BotaoPersonalizado
                    title="Lista de compras"
                    onPress={() => router.push('/compras')}
                    icon="cart-outline"
                    iconType="Ionicons"
                />

                {/* Lista de rotinas cadastradas */}
                {rotinas.length > 0 && (
                    <>
                        <Text style={[styles.subtitle, { marginTop: 20 }]}>Minhas Rotinas</Text>
                        {rotinas.map((rotina, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => router.push(`/novaRotina?editIndex=${index}`)}
                                style={styles.cardWrapper}
                            >
                                <View style={styles.card}>
                                    <View style={styles.rowRotina}>
                                        <Text style={styles.cardTitle}>{rotina.nome}</Text>
                                        <FontAwesome5 name="edit" size={15} color="#fff" />
                                    </View>

                                    <Text style={styles.cardSubtitle}>
                                        <Octicons name="number" size={15} color="#fff" /> Quantidade
                                    </Text>
                                    <Text style={styles.cardItem}>{rotina.quantidade}</Text>

                                    <Text style={styles.cardSubtitle}>
                                        <FontAwesome5 name="calendar" size={15} color="#fff" /> Dias
                                    </Text>
                                    <Text style={styles.cardItem}>{rotina.dias.join(', ')}</Text>

                                    <Text style={styles.cardSubtitle}>
                                        <FontAwesome5 name="shopping-bag" size={15} color="#fff" /> Itens:
                                    </Text>
                                    {(rotina.itens || []).map((item: RotinaItem, i: number) => (
                                        <Text key={i} style={styles.cardItem}>
                                            • {item.name} (x{item.usedQuantity})
                                        </Text>
                                    ))}
                                </View>
                            </TouchableOpacity>
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
    quickButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    quickButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 6,
        alignItems: 'center',
    },
    clearButton: {
        backgroundColor: '#e74c3c',
    },
    quickButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    subtitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    cardWrapper: {
        marginTop: 10,
    },
    card: {
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 15,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
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
        padding: 8,
        marginTop: 5,
    },
    rowRotina: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
