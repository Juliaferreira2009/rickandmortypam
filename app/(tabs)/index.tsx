import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Tipagem do personagem
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchCharacters = async (newPage = 1, query = "") => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get("https://rickandmortyapi.com/api/character", {
        params: { page: newPage, name: query },
      });
      const results: Character[] = response.data.results.map((char: any) => ({
        id: char.id,
        name: char.name,
        status: char.status,
        species: char.species,
        image: char.image,
      }));

      setCharacters(newPage === 1 ? results : [...characters, ...results]);
      setHasMore(!!response.data.info.next);
      setPage(newPage);
    } catch (error) {
      console.log("Erro ao carregar personagens:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleSearch = () => fetchCharacters(1, search);
  const loadMore = () => {
    if (hasMore && !loading) fetchCharacters(page + 1, search);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rick and Morty Explorer</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar personagem..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#00FFB9" />
      ) : (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/character/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.status}>
                {item.status} - {item.species}
              </Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            loading && hasMore ? <ActivityIndicator size="small" color="#00FFB9" /> : null
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum personagem encontrado 😢</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#101820", paddingTop: 50 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00FFB9",
    textAlign: "center",
    marginBottom: 16,
  },
  searchContainer: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: "#1E2A38",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    color: "#fff",
  },
  button: { backgroundColor: "#00FFB9", padding: 10, borderRadius: 8 },
  buttonText: { fontWeight: "bold" },
  list: { paddingBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    padding: 10,
    margin: 6,
    borderRadius: 10,
    alignItems: "center",
  },
  image: { width: 120, height: 120, borderRadius: 60, marginBottom: 8 },
  name: { fontSize: 16, color: "#fff", fontWeight: "600", textAlign: "center" },
  status: { fontSize: 13, color: "#aaa", textAlign: "center" },
  empty: { color: "#ccc", textAlign: "center", marginTop: 20 },
});
