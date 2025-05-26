// /app/compras.tsx

import Header from '@/components/header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface Item {
    name: string;
    quantity: string;
    price: string;
}

interface Category {
    name: string;
    items: Item[];
}

export default function ListaDeCompras() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const data = await AsyncStorage.getItem('@compras_categories');
                setCategories(data ? JSON.parse(data) : []);
            })();
        }, [])
    );

    const save = async (cats: Category[]) => {
        setCategories(cats);
        await AsyncStorage.setItem('@compras_categories', JSON.stringify(cats));
    };

    const addCategory = () => {
        const name = newCategory.trim();
        if (!name) return;
        save([...categories, { name, items: [] }]);
        setNewCategory('');
    };

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Lista de Compras</Text>

                <View style={styles.fieldRow}>
                    <TextInput
                        value={newCategory}
                        onChangeText={setNewCategory}
                        placeholder="Nova categoria (ex: Comida)"
                        placeholderTextColor="#666"
                        style={[styles.input, { flex: 1 }]}
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={addCategory}>
                        <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                </View>

                {categories.map((cat, idx) => (
                    <CategorySection
                        key={idx}
                        category={cat}
                        onUpdate={(updatedCat) => {
                            const copy = [...categories];
                            copy[idx] = updatedCat;
                            save(copy);
                        }}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

function CategorySection({
    category,
    onUpdate,
}: {
    category: Category;
    onUpdate: (cat: Category) => void;
}) {
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const addItem = () => {
        const name = itemName.trim();
        if (!name) return;

        const updated: Category = {
            ...category,
            items: [...category.items, { name, quantity, price }],
        };

        onUpdate(updated);
        setItemName('');
        setQuantity('');
        setPrice('');
    };

    return (
        <View style={styles.category}>
            <Text style={styles.categoryTitle}>{category.name}</Text>

            {category.items.map((it, i) => (
                <View key={i} style={styles.itemRow}>
                    <Text style={styles.itemName}>• {it.name}</Text>
                    <View style={styles.detailRow}>
                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Quantidade</Text>
                            <Text style={styles.detailValue}>{it.quantity}</Text>
                        </View>
                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Preço Estimado</Text>
                            <Text style={styles.detailValue}>{it.price}</Text>
                        </View>
                    </View>
                    <View style={styles.separatorLine}></View>
                </View>
            ))}

            <View style={[styles.fieldColumn, { marginTop: 10 }]}>
                <TextInput
                    value={itemName}
                    onChangeText={setItemName}
                    placeholder="Item"
                    placeholderTextColor="#666"
                    style={[styles.inputSubItens]}
                />
                <TextInput
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="Quantidade"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    style={[styles.inputSubItens]}
                />
                <TextInput
                    value={price}
                    onChangeText={setPrice}
                    placeholder="Preço"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    style={[styles.inputSubItens]}
                />
                <TouchableOpacity style={[styles.addBtn, { marginLeft: 8 }]} onPress={addItem}>
                    <Text style={styles.addBtnText}><AntDesign name='plus' size={15}></AntDesign> Adicionar</Text>
                </TouchableOpacity>
            </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    fieldColumn: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#2a2a2a',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
        fontSize: 14,
    },
    inputSubItens: {
        backgroundColor: '#1c1c1c',
        color: '#fff',
        padding: 10,
        borderRadius: 8,
        fontSize: 14,
        marginBottom: 10,
        width: '100%'
    },
    addBtn: {
        backgroundColor: '#3c3c3c',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderRadius: 8,
        height: 35,
    },
    addBtnText: {
        color: '#fff',
        fontSize: 12,
    },

    category: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },
    categoryTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    separatorLine: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#666',
        marginTop: 15,
    },
    itemRow: {
        marginBottom: 8
    },
    itemName: {
        color: '#fff',
        fontSize: 16
    },
    detailRow: {
        flexDirection: 'row',
        marginTop: 4
    },
    detailBox: {
        backgroundColor: '#333',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginRight: 8,
    },
    detailLabel: {
        color: '#ccc',
        fontSize: 12
    },
    detailValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
});
