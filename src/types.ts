export interface Breed {
  id: string;
  name: string;
  type: "cat" | "dog";
  origin?: string;
  temperament?: string;
  life_span?: string;
  description?: string;
  wikipedia_url?: string;
  image?: {
    id?: string;
    width?: number;
    height?: number;
    url?: string;
  } | null;
  energy_level?: number;
  affection_level?: number;
  child_friendly?: number;
  dog_friendly?: number;
  intelligence?: number;
  rare?: number;
  weight?: {
    imperial?: string;
    metric?: string;
  };
  height?: {
    imperial?: string;
    metric?: string;
  };
}

export interface BreedImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
  breeds?: Breed[];
}

export interface ActiveFilters {
  origin: string;
  temperament: string;
  minLifeSpan: number;
  minWeight: number;
  sortBy: "alphabetical" | "random" | "energy" | "intelligence";
  type: "all" | "cat" | "dog";
}

export interface FavoriteItem {
  id: string; 
  type: "breed" | "image";
  data: Breed | BreedImage;
  timestamp: number;
}
