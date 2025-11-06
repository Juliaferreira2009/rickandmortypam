import axios from "axios";
import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  location: { name: string };
  origin: { name: string };
}

export default function CharacterDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Tipando o id como string
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCharacter = async () => {
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
        setCharacter(response.data);
      } catch (error) {
        console.log("Erro ao buscar personagem:", error);
      } finally {
        setLoading(false);
      }
    };

    const playSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/sounds/portal.mp3")
        );
        await sound.playAsync();
      } catch (error) {
        console.log("Erro ao tocar som:", error);
      }
    };

    fetchCharacter();
    playSound();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00FFB9" />
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Personagem não encontrado 😢</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <Text style={styles.name}>{character.name}</Text>
      <Text style={styles.info}>🧬 Status: {character.status}</Text>
      <Text style={styles.info}>👽 Espécie: {character.species}</Text>
      <Text style={styles.info}>🚻 Gênero: {character.gender}</Text>
      <Text style={styles.info}>🌍 Local atual: {character.location.name}</Text>
      <Text style={styles.info}>🏠 Origem: {character.origin.name}</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101820",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#00FFB9",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00FFB9",
    marginBottom: 10,
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 4,
    textAlign: "center",
  },
  error: {
    color: "#FF6B6B",
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#00FFB9",
    borderRadius: 8,
  },
  backText: {
    color: "#101820",
    fontWeight: "bold",
    textAlign: "center",
  },
});
