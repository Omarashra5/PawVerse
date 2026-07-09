export interface DogBreed {
  id: string | number;
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
  height?: { imperial: string; metric: string };
  image?: { url: string } | null;
  reference_image_id?: string;
  bred_for?: string;
  type?: "dog";
}

export const FALLBACK_DOGS: DogBreed[] = [
  {
    id: "121",
    name: "Golden Retriever",
    origin: "Scotland",
    temperament: "Intelligent, Kind, Reliable, Friendly, Trustworthy, Confident",
    life_span: "10 - 12 years",
    description: "The Golden Retriever is a sturdy, muscular dog of medium size, famous for the dense, lustrous coat of gold that gives the breed its name. They are friendly, intelligent, and highly devoted.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Golden_Retriever",
    energy_level: 4,
    affection_level: 5,
    child_friendly: 5,
    dog_friendly: 5,
    intelligence: 5,
    rare: 0,
    weight: { imperial: "55 - 75", metric: "25 - 34" },
    height: { imperial: "21.5 - 24", metric: "55 - 61" },
    image: { url: "https://cdn2.thedogapi.com/images/1-7c_2ZaG.jpg" }
  },
  {
    id: "115",
    name: "German Shepherd Dog",
    origin: "Germany",
    temperament: "Alert, Watchful, Intelligent, Curious, Obedient, Loyal, Brave",
    life_span: "10 - 13 years",
    description: "The German Shepherd Dog is one of America's most popular dog breeds — for good reason. They are intelligent and capable working dogs, loyal and protective companions.",
    wikipedia_url: "https://en.wikipedia.org/wiki/German_Shepherd",
    energy_level: 4,
    affection_level: 4,
    child_friendly: 4,
    dog_friendly: 3,
    intelligence: 5,
    rare: 0,
    weight: { imperial: "50 - 90", metric: "23 - 41" },
    height: { imperial: "22 - 26", metric: "56 - 66" },
    image: { url: "https://cdn2.thedogapi.com/images/SkmRJg9VQ.jpg" }
  },
  {
    id: "149",
    name: "Labrador Retriever",
    origin: "Newfoundland",
    temperament: "Kind, Outgoing, Agile, Gentle, Intelligent, Trustworthy, Even-tempered",
    life_span: "10 - 12 years",
    description: "The sweet-faced, lovable Labrador Retriever is America's most popular dog breed. Labs are friendly, outgoing, and high-spirited companions who have more than enough affection to go around.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Labrador_Retriever",
    energy_level: 5,
    affection_level: 5,
    child_friendly: 5,
    dog_friendly: 5,
    intelligence: 4,
    rare: 0,
    weight: { imperial: "55 - 80", metric: "25 - 36" },
    height: { imperial: "21.5 - 24.5", metric: "55 - 62" },
    image: { url: "https://cdn2.thedogapi.com/images/B18S1gq4M.jpg" }
  },
  {
    id: "222",
    name: "Siberian Husky",
    origin: "Siberia",
    temperament: "Outgoing, Friendly, Alert, Gentle, Intelligent",
    life_span: "12 - 15 years",
    description: "The Siberian Husky, a thickly coated, compact sled dog of medium size and great endurance, was developed to work in packs, pulling light loads at moderate speeds over vast frozen expanses.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Siberian_Husky",
    energy_level: 5,
    affection_level: 5,
    child_friendly: 5,
    dog_friendly: 5,
    intelligence: 4,
    rare: 0,
    weight: { imperial: "35 - 60", metric: "16 - 27" },
    height: { imperial: "20 - 23.5", metric: "51 - 60" },
    image: { url: "https://cdn2.thedogapi.com/images/S139gZ5Vm.jpg" }
  },
  {
    id: "101",
    name: "French Bulldog",
    origin: "France",
    temperament: "Playful, Affectionate, Keen, Easygoing, Lively, Sociable, Alert",
    life_span: "9 - 11 years",
    description: "The French Bulldog is a breed of domestic dog, bred to be companion dogs. The breed is the result of a cross between Toy Bulldogs imported from England, and local ratters in Paris, France.",
    wikipedia_url: "https://en.wikipedia.org/wiki/French_Bulldog",
    energy_level: 3,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 4,
    intelligence: 3,
    rare: 0,
    weight: { imperial: "28 max", metric: "13 max" },
    height: { imperial: "11 - 12", metric: "28 - 30" },
    image: { url: "https://cdn2.thedogapi.com/images/H1S6na9Um.jpg" }
  },
  {
    id: "201",
    name: "Pug",
    origin: "China",
    temperament: "Docile, Clever, Charming, Stubborn, Sociable, Playful, Quiet, Attentive",
    life_span: "12 - 14 years",
    description: "The Pug is a breed of dog with physically distinctive features of a wrinkly, short-muzzled face, and curled tail. The breed has a fine, glossy coat that comes in a variety of colours.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pug",
    energy_level: 2,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 4,
    intelligence: 3,
    rare: 0,
    weight: { imperial: "14 - 18", metric: "6 - 8" },
    height: { imperial: "10 - 12", metric: "25 - 30" },
    image: { url: "https://cdn2.thedogapi.com/images/HyEx7o7v7.jpg" }
  }
];