// app/onboarding/carousel.tsx

import { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ViewToken,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

type Slide = {
  id: string;
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    id: "1",
    title: "Your life, organised by voice",
    subtitle: "Vega is your personal AI assistant — always listening, always ready.",
  },
  {
    id: "2",
    title: "One voice. Two domains.",
    subtitle: "Track expenses and habits from a single spoken sentence.",
  },
  {
    id: "3",
    title: "Less friction. More living.",
    subtitle: "Spend less time managing your life. Spend more time living it.",
  },
];

export default function CarouselScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      router.push("/onboarding/name");
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(Number(viewableItems[0].index));
      }
    }
  );

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.illustration} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  illustration: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#1a1a2e",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#7c6ff7",
  },
  dotInactive: {
    backgroundColor: "#333333",
  },
  button: {
    marginTop: 32,
    backgroundColor: "#7c6ff7",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 32,
    marginBottom: 48,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});