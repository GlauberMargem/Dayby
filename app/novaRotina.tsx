// /app/novaRotina.tsx

import Header from '@/components/header';
import { FontAwesome5, Octicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

interface InventarioItem {
    name: string;
    quantity: string;
    price: string;
}

interface RotinaItem {
    name: string;
    usedQuantity: number;
}

interface RotinaCompleta {
    nome: string;
    descricao: string;
    dias: string[];
    quantidade: number;
    itens: RotinaItem[];
}

export default function NovaRotina() {
    const router = useRouter();
    const { editIndex } = useLocalSearchParams<{ editIndex?: string }>();
    const indexNum =
        editIndex !== undefined && !isNaN(Number(editIndex))
            ? parseInt(editIndex, 10)
            : -1;

    // Estados da rotina
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
    const [quantidade, setQuantidade] = useState('');

    // Inventário e itens selecionados
    const [inventoryItems, setInventoryItems] = useState<InventarioItem[]>([]);
    const [itensSelecionados, setItensSelecionados] = useState<RotinaItem[]>([]);
    const [accordionOpen, setAccordionOpen] = useState(false);

    const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    // 1) Carregar inventário quando monta
    useEffect(() => {
        (async () => {
            const data = await AsyncStorage.getItem('@inventario');
            setInventoryItems(data ? JSON.parse(data) : []);
        })();
    }, []);

    // 2) Se estivermos em edição, pré-carregar dados
    useEffect(() => {
        if (indexNum >= 0) {
            (async () => {
                try {
                    const raw = await AsyncStorage.getItem('@rotinas');
                    const arr: RotinaCompleta[] = raw ? JSON.parse(raw) : [];
                    if (indexNum < 0 || indexNum >= arr.length) return;
                    const rut = arr[indexNum];
                    setNome(rut.nome);
                    setDescricao(rut.descricao || '');
                    setDiasSelecionados(rut.dias || []);
                    setQuantidade(rut.quantidade.toString());
                    setItensSelecionados(Array.isArray(rut.itens) ? rut.itens : []);
                } catch (e) {
                    console.error('Erro ao carregar rotina para edição:', e);
                }
            })();
        }
    }, [indexNum]);

    const toggleDia = (dia: string) => {
        setDiasSelecionados((prev) =>
            prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
        );
    };

    const isItemSelected = (itemName: string) =>
        itensSelecionados.some((ri) => ri.name === itemName);

    const addRotinaItem = (itemName: string) => {
        if (isItemSelected(itemName)) return;
        setItensSelecionados((prev) => [...prev, { name: itemName, usedQuantity: 1 }]);
    };

    const removeRotinaItem = (itemName: string) => {
        setItensSelecionados((prev) => prev.filter((ri) => ri.name !== itemName));
    };

    const toggleItem = (itemName: string) => {
        isItemSelected(itemName) ? removeRotinaItem(itemName) : addRotinaItem(itemName);
    };

    const updateUsedQuantity = (itemName: string, delta: number) => {
        setItensSelecionados((prev) =>
            prev
                .map((ri) =>
                    ri.name === itemName
                        ? { ...ri, usedQuantity: Math.max(1, ri.usedQuantity + delta) }
                        : ri
                )
                .filter((ri) => ri.usedQuantity > 0)
        );
    };

    const salvarRotina = async () => {
        if (!nome.trim() || !quantidade.trim() || diasSelecionados.length === 0) {
            Alert.alert('Atenção', 'Preencha nome, dias e quantidade antes de salvar.');
            return;
        }
        if (itensSelecionados.length === 0) {
            Alert.alert('Atenção', 'Selecione ao menos um item do inventário.');
            return;
        }

        const rotinaObj: RotinaCompleta = {
            nome,
            descricao,
            dias: diasSelecionados,
            quantidade: parseInt(quantidade, 10),
            itens: itensSelecionados,
        };

        try {
            const raw = await AsyncStorage.getItem('@rotinas');
            const arr: RotinaCompleta[] = raw ? JSON.parse(raw) : [];

            if (indexNum >= 0) {
                arr[indexNum] = rotinaObj;
            } else {
                arr.push(rotinaObj);
            }

            await AsyncStorage.setItem('@rotinas', JSON.stringify(arr));
            Alert.alert('Sucesso', 'Rotina salva com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => router.replace('/'),
                },
            ]);
        } catch (e) {
            console.error('Erro ao salvar rotina:', e);
            Alert.alert('Erro', 'Falha ao salvar rotina. Tente novamente.');
        }
    };

    const deletarRotina = () => {
        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja deletar esta rotina?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const raw = await AsyncStorage.getItem('@rotinas');
                            const arr: RotinaCompleta[] = raw ? JSON.parse(raw) : [];
                            if (indexNum < 0 || indexNum >= arr.length) {
                                Alert.alert('Erro', 'Índice inválido. Não foi possível deletar.');
                                return;
                            }

                            arr.splice(indexNum, 1);
                            await AsyncStorage.setItem('@rotinas', JSON.stringify(arr));
                            Alert.alert('Sucesso', 'Rotina deletada com sucesso!', [
                                {
                                    text: 'OK',
                                    onPress: () => router.replace('/'),
                                },
                            ]);
                        } catch (e) {
                            console.error('Erro ao deletar rotina:', e);
                            Alert.alert('Erro', 'Falha ao deletar. Tente novamente.');
                        }
                    },
                },
            ]
        );
    };

    return (
        // Envolvemos tudo em TouchableWithoutFeedback para esconder o teclado ao clicar fora
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Header />

                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="always">
                    <Text style={styles.title}>Nova Rotina</Text>

                    {/* Nome da rotina */}
                    <TextInput
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Nome da rotina"
                        placeholderTextColor="#999"
                        style={styles.titleInput}
                    />

                    {/* Dias da semana */}
                    <View style={styles.field}>
                        <Text style={styles.label}>
                            <FontAwesome5 name="calendar" size={18} color="#fff" /> Dias da semana
                        </Text>
                        <View style={styles.diasContainer}>
                            {dias.map((dia, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[
                                        styles.diaBotao,
                                        diasSelecionados.includes(dia) && styles.diaSelecionado,
                                    ]}
                                    onPress={() => toggleDia(dia)}
                                >
                                    <Text style={styles.diaTexto}>{dia}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Quantidade total */}
                    <View style={styles.field}>
                        <Text style={styles.label}>
                            <Octicons name="number" size={18} color="#fff" /> Quantidade total
                        </Text>
                        <TextInput
                            value={quantidade}
                            onChangeText={setQuantidade}
                            keyboardType="numeric"
                            style={styles.input}
                            placeholder="Digite a quantidade"
                            placeholderTextColor="#666"
                        />
                    </View>

                    {/* Accordion de itens do inventário */}
                    <View style={styles.field}>
                        <TouchableOpacity
                            style={styles.accordionHeader}
                            onPress={() => setAccordionOpen(!accordionOpen)}
                        >
                            <Text style={styles.label}>
                                <FontAwesome5 name="shopping-bag" size={18} color="#fff" /> Itens do inventário
                            </Text>
                            <FontAwesome5
                                name={accordionOpen ? 'chevron-up' : 'chevron-down'}
                                size={16}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        {accordionOpen && (
                            <View style={styles.accordionContent}>
                                {inventoryItems.length === 0 ? (
                                    <Text style={styles.noInventoryText}>Nenhum item no inventário.</Text>
                                ) : (
                                    inventoryItems.map((inv, idx) => {
                                        const marcado = isItemSelected(inv.name);
                                        return (
                                            <TouchableOpacity
                                                key={idx}
                                                onPress={() => toggleItem(inv.name)}
                                                style={[
                                                    styles.inventoryRow,
                                                    marcado && styles.inventoryRowSelected,
                                                ]}
                                            >
                                                <View>
                                                    <Text style={styles.inventoryName}>{inv.name}</Text>
                                                    <Text style={styles.inventoryQty}>Estoque: {inv.quantity}</Text>
                                                </View>
                                                {marcado && <FontAwesome5 name="check" size={16} color="#4CAF50" />}
                                            </TouchableOpacity>
                                        );
                                    })
                                )}
                            </View>
                        )}
                    </View>

                    {/* Itens selecionados com ajuste de quantidade */}
                    {itensSelecionados.length > 0 && (
                        <View style={styles.selectedSection}>
                            <Text style={styles.selectedTitle}>Itens selecionados:</Text>
                            {itensSelecionados.map((ri, i) => (
                                <View key={i} style={styles.selectedItemRow}>
                                    <Text style={styles.selectedItemName}>{ri.name}</Text>
                                    <View style={styles.qtyRow}>
                                        <TouchableOpacity
                                            onPress={() => updateUsedQuantity(ri.name, -1)}
                                            style={styles.qtyButton}
                                        >
                                            <Text style={styles.qtyButtonText}>–</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.detailValue}>{ri.usedQuantity}</Text>
                                        <TouchableOpacity
                                            onPress={() => updateUsedQuantity(ri.name, 1)}
                                            style={styles.qtyButton}
                                        >
                                            <Text style={styles.qtyButtonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Descrição */}
                    <View style={styles.field}>
                        <Text style={styles.subLabel}>Descrição (opcional)</Text>
                        <TextInput
                            value={descricao}
                            onChangeText={setDescricao}
                            placeholder="Detalhe a rotina..."
                            placeholderTextColor="#666"
                            style={[styles.input, { height: 80 }]}
                            multiline
                        />
                    </View>

                    {/* Botão Salvar / Atualizar */}
                    <TouchableOpacity style={styles.saveButton} onPress={salvarRotina}>
                        <Text style={styles.saveButtonText}>
                            {indexNum >= 0 ? 'Atualizar rotina' : 'Salvar rotina'}
                        </Text>
                    </TouchableOpacity>

                    {/* Botão Deletar (somente em edição) */}
                    {indexNum >= 0 && (
                        <TouchableOpacity style={styles.deleteButton} onPress={deletarRotina}>
                            <Text style={styles.deleteButtonText}>Deletar rotina</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1c1c1c' },
    content: { padding: 20 },

    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    titleInput: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 10,
    },

    field: { marginBottom: 15 },
    label: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
    },
    subLabel: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#2a2a2a',
        color: '#fff',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        marginTop: 5,
    },

    diasContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    diaBotao: {
        backgroundColor: '#2a2a2a',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 6,
        marginTop: 6,
    },
    diaSelecionado: {
        backgroundColor: '#7c7c7c',
    },
    diaTexto: {
        color: '#fff',
        fontSize: 13,
    },

    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        padding: 10,
        borderRadius: 8,
    },
    accordionContent: { marginTop: 8 },
    noInventoryText: {
        color: '#aaa',
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 4,
    },
    inventoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    inventoryRowSelected: {
        backgroundColor: '#3c3c3c',
    },
    inventoryName: {
        color: '#fff',
        fontSize: 14,
    },
    inventoryQty: {
        color: '#bbb',
        fontSize: 12,
        marginTop: 2,
    },

    selectedSection: {
        marginTop: 10,
        backgroundColor: '#2a2a2a',
        padding: 10,
        borderRadius: 8,
    },
    selectedTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    selectedItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    selectedItemName: {
        color: '#fff',
        fontSize: 14,
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 6,
        borderRadius: 4,
    },
    qtyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 4,
    },
    detailValue: {
        color: '#fff',
        fontSize: 14,
        width: 20,
        textAlign: 'center',
    },

    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    deleteButton: {
        backgroundColor: '#e74c3c',
        padding: 14,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
