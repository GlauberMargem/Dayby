// /app/inventario.tsx

import Header from '@/components/header';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface InventarioItem {
    name: string;
    quantity: number;
    price: string;
}

export default function Inventario() {
    const [inventory, setInventory] = useState<InventarioItem[]>([]);
    const [newName, setNewName] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newPrice, setNewPrice] = useState('');

    // Carrega inventário sempre que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const data = await AsyncStorage.getItem('@inventario');
                setInventory(data ? JSON.parse(data) : []);
            })();
        }, [])
    );

    // Salva inventário no AsyncStorage
    const saveInventory = async (items: InventarioItem[]) => {
        setInventory(items);
        await AsyncStorage.setItem('@inventario', JSON.stringify(items));
    };

    // Adiciona novo item
    const addItem = () => {
        const name = newName.trim();
        const qty = parseInt(newQuantity, 10);
        if (!name || isNaN(qty) || qty < 0 || !newPrice.trim()) return;

        const updated = [
            ...inventory,
            { name, quantity: qty, price: newPrice.trim() },
        ];
        saveInventory(updated);
        setNewName('');
        setNewQuantity('');
        setNewPrice('');
    };

    // Remove item por índice
    const deleteItem = (index: number) => {
        const updated = inventory.filter((_, i) => i !== index);
        saveInventory(updated);
    };

    // Incrementa quantidade de um item
    const incrementQuantity = (index: number) => {
        const updated = [...inventory];
        updated[index].quantity += 1;
        saveInventory(updated);
    };

    // Decrementa quantidade de um item (não permite negativo)
    const decrementQuantity = (index: number) => {
        const updated = [...inventory];
        if (updated[index].quantity > 0) {
            updated[index].quantity -= 1;
            saveInventory(updated);
        }
    };

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Inventário</Text>

                {/* Formulário de novo item */}
                <View style={styles.fieldRow}>
                    <TextInput
                        value={newName}
                        onChangeText={setNewName}
                        placeholder="Produto"
                        placeholderTextColor="#666"
                        style={[styles.input]}
                    />
                    <TextInput
                        value={newQuantity}
                        onChangeText={setNewQuantity}
                        placeholder="Quantidade"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        style={[styles.input]}
                    />
                    <TextInput
                        value={newPrice}
                        onChangeText={setNewPrice}
                        placeholder="Preço"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        style={[styles.input]}
                    />
                    <TouchableOpacity style={[styles.addButton]} onPress={addItem}>
                        <Text style={styles.addButtonText}>
                            <AntDesign name="plus" size={20} /> Adicionar
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Lista de itens do inventário */}
                {inventory.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <View style={styles.detailRow}>
                                <View style={styles.detailBox}>
                                    <Text style={styles.detailLabel}>Quantidade</Text>
                                    <View style={styles.qtyRow}>
                                        <TouchableOpacity
                                            onPress={() => decrementQuantity(index)}
                                            style={styles.qtyButton}
                                        >
                                            <Text style={styles.qtyButtonText}>–</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.detailValue}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            onPress={() => incrementQuantity(index)}
                                            style={styles.qtyButton}
                                        >
                                            <Text style={styles.qtyButtonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.detailBox}>
                                    <Text style={styles.detailLabel}>Preço</Text>
                                    <Text style={styles.detailValue}>R$ {item.price}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => deleteItem(index)} style={styles.deleteBtn}>
                            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1c1c1c' },
    content: { padding: 20 },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },

    fieldRow: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#2a2a2a',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
        fontSize: 14,
        marginTop: 5,
    },
    addButton: {
        backgroundColor: '#3c3c3c',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 5,
        paddingVertical: 6,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },

    itemRow: {
        flexDirection: 'row',
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 6,
    },
    detailRow: {
        flexDirection: 'row',
    },
    detailBox: {
        backgroundColor: '#333',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginRight: 5,
    },
    detailLabel: {
        color: '#ccc',
        fontSize: 12,
    },
    detailValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    // Controles de quantidade
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    qtyButton: {
        backgroundColor: '#626a70',
        paddingHorizontal: 4,
        borderRadius: 4,
        marginHorizontal: 2
    },
    qtyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 4,
    },

    deleteBtn: {
        marginLeft: 12,
        padding: 4,
    },
});
