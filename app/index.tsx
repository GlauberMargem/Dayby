import { FontAwesome5, Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

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
    progress: number;
    itens: RotinaItem[];
}

interface InventarioItem {
    name: string;
    quantity: string;
    price: string;
}

export default function HomeScreen() {
    const router = useRouter();
    const [rotinas, setRotinas] = useState<Rotina[]>([]);

    const carregarRotinas = async () => {
        const raw = await AsyncStorage.getItem('@rotinas');
        const arr: Rotina[] = raw ? JSON.parse(raw) : [];
        setRotinas(
            arr.map((r) => ({
                nome: r.nome,
                descricao: r.descricao || '',
                dias: Array.isArray(r.dias) ? r.dias : [],
                quantidade: r.quantidade || 0,
                progress: r.progress || 0,
                itens: Array.isArray(r.itens) ? r.itens : [],
            }))
        );
    };

    useFocusEffect(
        useCallback(() => {
            const fetch = async () => {
                await carregarRotinas();
            };
            fetch();
        }, [])
    );

    const descontarDoEstoque = async (itens: RotinaItem[]) => {
        const rawInv = await AsyncStorage.getItem('@inventario');
        const inv: InventarioItem[] = rawInv ? JSON.parse(rawInv) : [];

        const updated = inv.map((prod) => {
            const rotinaItem = itens.find((i) => i.name === prod.name);
            if (!rotinaItem) return prod;
            const novaQt = Math.max(0, parseInt(prod.quantity, 10) - rotinaItem.usedQuantity);
            return { ...prod, quantity: novaQt.toString() };
        });

        await AsyncStorage.setItem('@inventario', JSON.stringify(updated));
    };

    const atualizarProgresso = async (idx: number, delta: number) => {
        const raw = await AsyncStorage.getItem('@rotinas');
        const arr: Rotina[] = raw ? JSON.parse(raw) : [];
        const r = arr[idx];
        if (!r) return;

        const prev = r.progress || 0;
        const novo = Math.max(0, Math.min(r.quantidade, prev + delta));
        r.progress = novo;
        await AsyncStorage.setItem('@rotinas', JSON.stringify(arr));

        if (prev < r.quantidade && novo === r.quantidade) {
            await descontarDoEstoque(r.itens);
            Alert.alert('Rotina concluída', 'Estoque atualizado com sucesso!');
        }

        carregarRotinas();
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="always">
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

                {rotinas.length > 0 && (
                    <>
                        <Text style={[styles.subtitle, { marginTop: 20 }]}>Minhas Rotinas</Text>
                        {rotinas.map((rotina, i) => {
                            const concluida = rotina.progress >= rotina.quantidade;
                            const pct = rotina.quantidade > 0 ? (rotina.progress / rotina.quantidade) * 100 : 0;

                            return (
                                <View key={i} style={styles.cardWrapper}>
                                    <View style={[styles.card, concluida && { backgroundColor: '#3a3a3a', opacity: 0.5 }]}>
                                        <Text style={[styles.cardTitle, concluida && { textDecorationLine: 'line-through', color: '#999' }]}>
                                            {rotina.nome}
                                        </Text>

                                        <View style={styles.rowProgresso}>
                                            <Text style={styles.cardSubtitle}>
                                                <Octicons name="number" size={15} color="#fff" /> Progresso
                                            </Text>
                                            <View style={styles.controls}>
                                                <TouchableOpacity
                                                    onPress={() => atualizarProgresso(i, -1)}
                                                    disabled={rotina.progress <= 0 || concluida}
                                                    style={styles.ctrlButton}
                                                >
                                                    <Text style={styles.ctrlText}>–</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => atualizarProgresso(i, +1)}
                                                    disabled={concluida}
                                                    style={styles.ctrlButton}
                                                >
                                                    <Text style={styles.ctrlText}>+</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <Text style={styles.cardItem}>
                                            {rotina.progress}/{rotina.quantidade}
                                        </Text>

                                        <View style={styles.progressBar}>
                                            <View style={[styles.progressFill, { width: `${pct}%` }]} />
                                        </View>

                                        <Text style={styles.cardSubtitle}>
                                            <FontAwesome5 name="calendar" size={15} color="#fff" /> Dias
                                        </Text>
                                        <Text style={styles.cardItem}>{rotina.dias.join(', ')}</Text>

                                        <Text style={styles.cardSubtitle}>
                                            <FontAwesome5 name="shopping-bag" size={15} color="#fff" /> Itens
                                        </Text>
                                        {(rotina.itens || []).map((it, j) => (
                                            <Text key={j} style={styles.cardItem}>
                                                • {it.name} (x{it.usedQuantity})
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            );
                        })}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1c1c1c' },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    subtitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    cardWrapper: { marginBottom: 12 },
    card: { backgroundColor: '#2a2a2a', borderRadius: 10, padding: 15 },
    cardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    rowProgresso: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardSubtitle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    controls: { flexDirection: 'row', gap: 8 },
    ctrlButton: {
        backgroundColor: '#6c6c6c',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctrlText: { color: '#fff', fontSize: 18, lineHeight: 20 },
    cardItem: {
        color: '#fff',
        fontSize: 14,
        backgroundColor: '#1c1c1c',
        borderRadius: 12,
        padding: 8,
        marginTop: 5,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#3a3a3a',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 6,
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
});
