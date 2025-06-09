# 📆 DayBy – Organizador de Rotinas com Inventário

DayBy é um aplicativo mobile desenvolvido com **React Native** e **Expo** para ajudar no gerenciamento de **rotinas diárias** e controle de **recursos** por meio de um sistema de inventário integrado.

---

## 📖 Descrição

O app permite que o usuário cadastre tarefas recorrentes, defina os dias em que devem ser feitas e associe itens do inventário que serão utilizados. Com o avanço das tarefas, é possível acompanhar o progresso e, ao finalizar uma rotina, o app desconta automaticamente os recursos do estoque.

---

## ✅ Funcionalidades

- Cadastro de rotinas com:
  - Nome
  - Descrição
  - Dias da semana
  - Quantidade de repetições

- Integração com inventário:
  - Seleção dinâmica de itens disponíveis
  - Quantidade usada por rotina
  - Desconto automático do estoque ao finalizar

- Barra de progresso e controle visual:
  - Botões de `+` e `–` para registrar execução
  - Estilização de rotinas concluídas (texto riscado, opacidade)

- Sistema de Inventário:
  - Cadastro de itens
  - Aumento e redução de quantidades
  - Visualização dos itens disponíveis

- Lista de Compras:
  - Organização por categorias
  - Criação e exclusão de itens

- Armazenamento local:
  - Utilização de `AsyncStorage` para persistência offline

---

## 🚀 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- Ícones com `@expo/vector-icons`

---

## 🛠️ Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/dayby.git
   cd dayby
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Rode o projeto:
   ```bash
   npx expo start
   ```

---

## 🧠 Autor

**Glauber Margem**  
Universitário noturno cansado | Café e código ☕💻

---

## 📌 Observações

Esse projeto foi desenvolvido como parte de um **trabalho acadêmico**, mas tem potencial de evolução com novas features, como notificações diárias, sincronização em nuvem e histórico de execuções.
