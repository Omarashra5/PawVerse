export interface CatBreed {
  id: string;
  name: string;
  origin?: string;
  temperament?: string;
  life_span?: string;
  description?: string;
  wikipedia_url?: string;
  energy_level?: number;
  affection_level?: number;
  child_friendly?: number;
  dog_friendly?: number;
  intelligence?: number;
  rare?: number;
  weight?: { imperial: string; metric: string };
  image?: { url: string } | null;
  reference_image_id?: string;
  type?: "cat";
}

export const FALLBACK_CATS: CatBreed[] = [
  {
    id: "pers",
    name: "Persian",
    origin: "Iran (Persia)",
    temperament: "Affectionate, Loyal, Quiet, Quiet",
    life_span: "14 - 15",
    description: "The Persian cat is a long-haired breed of cat characterized by its round face and short muzzle. It is also known as the \"Persian Longhair\" in the English-speaking countries.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Persian_cat",
    energy_level: 2,
    affection_level: 5,
    child_friendly: 3,
    dog_friendly: 2,
    intelligence: 3,
    rare: 0,
    weight: { imperial: "7 - 14", metric: "3 - 6" },
    image: { url: "https://cdn2.thecatapi.com/images/0XYv78Zg9.jpg" }
  },
  {
    id: "beng",
    name: "Bengal",
    origin: "United States",
    temperament: "Alert, Agile, Energetic, Demanding, Intelligent",
    life_span: "12 - 15",
    description: "Bengals are a lot of fun to live with, but they're definitely not the cat for everyone, or for first-time cat owners. Extremely intelligent, active and inquisitive, they require a lot of interaction and stimulation.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Bengal_cat",
    energy_level: 5,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 5,
    intelligence: 5,
    rare: 0,
    weight: { imperial: "6 - 12", metric: "3 - 7" },
    image: { url: "https://cdn2.thecatapi.com/images/O3btZ7TxO.jpg" }
  },
  {
    id: "mcoo",
    name: "Maine Coon",
    origin: "United States",
    temperament: "Adaptable, Active, Affectionate, Gentle, Friendly, Intelligent",
    life_span: "12 - 15",
    description: "Perhaps the oldest native breed in North America, the Maine Coon is known for its large size, rugged coat, and gentle, loving disposition. They are highly social and make wonderful family companions.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Maine_Coon",
    energy_level: 3,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 5,
    intelligence: 4,
    rare: 0,
    weight: { imperial: "10 - 25", metric: "5 - 11" },
    image: { url: "https://cdn2.thecatapi.com/images/Oux4868As.jpg" }
  },
  {
    id: "siam",
    name: "Siamese",
    origin: "Thailand",
    temperament: "Active, Loving, Social, Vocal, Demanding, Intelligent",
    life_span: "12 - 15",
    description: "The Siamese is one of the first distinctly recognized breeds of Asian cat. Derived from the Wichianmat landrace, one of several varieties of cat native to Thailand.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Siamese_cat",
    energy_level: 4,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 5,
    intelligence: 5,
    rare: 0,
    weight: { imperial: "8 - 15", metric: "4 - 7" },
    image: { url: "https://cdn2.thecatapi.com/images/ai6Jps4sx.jpg" }
  },
  {
    id: "ragd",
    name: "Ragdoll",
    origin: "United States",
    temperament: "Friendly, Gentle, Quiet, Easygoing, Loving",
    life_span: "12 - 17",
    description: "The Ragdoll is a cat breed with a color point coat and blue eyes. They are large and muscular semi-longhair cats with a soft and silky coat. Developed by American breeder Ann Baker in the 1960s.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Ragdoll",
    energy_level: 3,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 4,
    intelligence: 3,
    rare: 0,
    weight: { imperial: "10 - 20", metric: "5 - 9" },
    image: { url: "https://cdn2.thecatapi.com/images/o7mC3FtGL.jpg" }
  },
  {
    id: "sphy",
    name: "Sphynx",
    origin: "Canada",
    temperament: "Active, Friendly, Intelligent, Quiet, Conversational",
    life_span: "12 - 14",
    description: "The Sphynx cat is a breed of cat known for its lack of coat. Hairlessness in cats is a naturally occurring genetic mutation; however, the Sphynx cat, as a breed, was developed through selective breeding.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Sphynx_cat",
    energy_level: 4,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 4,
    intelligence: 4,
    rare: 1,
    weight: { imperial: "6 - 12", metric: "3 - 5" },
    image: { url: "https://cdn2.thecatapi.com/images/3b6_itC7g.jpg" }
  }
];