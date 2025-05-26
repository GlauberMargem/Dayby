import Header from '@/components/header';
import { FontAwesome5, Octicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


export default function NovaRotina() {
    const router = useRouter();

    const salvarRotina = async () => {
        if (!nome.trim() || !quantidade || diasSelecionados.length === 0 || itens.length === 0) {
            alert('Preencha todos os campos antes de salvar.');
            return;
        }

        const novaRotina = {
            nome,
            descricao,
            dias: diasSelecionados,
            quantidade: parseInt(quantidade),
            itens,
        };

        try {
            const rotinasSalvas = await AsyncStorage.getItem('@rotinas');
            const rotinas = rotinasSalvas ? JSON.parse(rotinasSalvas) : [];

            rotinas.push(novaRotina);
            await AsyncStorage.setItem('@rotinas', JSON.stringify(rotinas));

            router.push('/'); // volta pra home
        } catch (error) {
            console.error('Erro ao salvar rotina:', error);
            alert('Erro ao salvar. Tente novamente.');
        }
    };

    const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
    const [quantidade, setQuantidade] = useState('');
    const [itens, setItens] = useState<string[]>([]);
    const [itemTemporario, setItemTemporario] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

    const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    const toggleDia = (dia: string) => {
        if (diasSelecionados.includes(dia)) {
            setDiasSelecionados(diasSelecionados.filter(d => d !== dia));
        } else {
            setDiasSelecionados([...diasSelecionados, dia]);
        }
    };

    const adicionarItem = () => {
        if (itemTemporario.trim()) {
            setItens([...itens, itemTemporario.trim()]);
            setItemTemporario('');
        }
    };

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.content}>
                <TextInput
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome da rotina"
                    placeholderTextColor="#999"
                    style={styles.titleInput}
                />
                <View style={styles.field}>
                    <Text style={styles.label}>
                        <FontAwesome5 name="calendar" size={18} /> Dias da semana
                    </Text>
                    <View style={styles.diasContainer}>
                        {dias.map((dia, index) => (
                            <TouchableOpacity
                                key={index}
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

                <View style={styles.field}>
                    <Text style={styles.label}>
                        <Octicons name="number" size={18} /> Quantidade
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

                <View style={styles.field}>
                    <Text style={styles.label}>
                        <FontAwesome5 name="box" size={18} /> Itens
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <TextInput
                            value={itemTemporario}
                            onChangeText={setItemTemporario}
                            placeholder="Digite um item"
                            placeholderTextColor="#666"
                            style={[styles.input, { flex: 1 }]}
                        />
                        <TouchableOpacity onPress={adicionarItem} style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    {itens.map((item, index) => (
                        <Text key={index} style={styles.value}>• {item}</Text>
                    ))}
                </View>

                <View style={styles.field}>
                    <Text style={styles.subLabel}>Nome da rotina</Text>
                    <TextInput
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Ex: Retirar o lixo"
                        placeholderTextColor="#666"
                        style={styles.input}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.subLabel}>Descrição</Text>
                    <TextInput
                        value={descricao}
                        onChangeText={setDescricao}
                        placeholder="Detalhe a rotina..."
                        placeholderTextColor="#666"
                        style={[styles.input, { height: 80 }]}
                        multiline
                    />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={salvarRotina}>
                    <Text style={styles.saveButtonText}>Salvar rotina</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1c'
    },
    content: {
        padding: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20
    },
    field: {
        marginBottom: 15
    },
    label: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
        marginBottom: 5
    },
    subLabel: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5
    },
    value: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 5
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
        gap: 1,
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
    addButton: {
        backgroundColor: '#3c3c3c',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderRadius: 8,
        height: 40,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    titleInput: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        backgroundColor: '#1c1c1c',
        borderRadius: 8,
        padding: 10,
    },
    saveButton: {
        backgroundColor: '#3c3c3c',
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


});
