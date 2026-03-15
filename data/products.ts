export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  longDescription: string;
  light: string;
  water: string;
  petFriendly: string;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "blush-pink-caladium",
    name: "Blush Pink Caladium",
    price: 24.99,
    category: "Houseplants",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80",
    description: "A soft and colorful plant with delicate pink tones.",
    longDescription:
      "The Blush Pink Caladium brings a romantic pastel touch to your home with its dreamy pink and green foliage. It is perfect for brightening shelves, sunrooms, and cozy corners with a soft floral feel.",
    light: "Bright indirect light",
    water: "Keep soil lightly moist",
    petFriendly: "No",
  },
  {
    id: 2,
    slug: "golden-pothos",
    name: "Golden Pothos",
    price: 18.99,
    category: "Easy Care",
    image:
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80",
    description: "A hardy trailing plant perfect for beginners.",
    longDescription:
      "Golden Pothos is one of the easiest and most popular houseplants. Its trailing vines and green-gold leaves make it a beautiful choice for hanging baskets, shelves, and tabletops.",
    light: "Low to bright indirect light",
    water: "Water when top inch of soil is dry",
    petFriendly: "No",
  },
  {
    id: 3,
    slug: "lavender-ceramic-planter-set",
    name: "Lavender Ceramic Planter Set",
    price: 32.99,
    category: "Planters",
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
    description: "Pretty pastel planters that pair beautifully with any plant.",
    longDescription:
      "This lavender ceramic planter set adds a sweet pastel accent to your plant styling. These planters are ideal for dressing up your favorite greenery with a polished, giftable look.",
    light: "Decor item",
    water: "Use with matching plant needs",
    petFriendly: "Yes",
  },
  {
    id: 4,
    slug: "mini-fern-bundle",
    name: "Mini Fern Bundle",
    price: 21.99,
    category: "Bundles",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80",
    description: "A sweet bundle of soft green ferns for cozy spaces.",
    longDescription:
      "The Mini Fern Bundle is perfect for adding lush greenery to desks, bathrooms, and shaded rooms. These soft-textured plants create a fresh and welcoming botanical look.",
    light: "Medium to bright indirect light",
    water: "Keep soil evenly moist",
    petFriendly: "Yes",
  },
  {
    id: 5,
    slug: "rose-begonia",
    name: "Rose Begonia",
    price: 27.99,
    category: "Flowering",
    image:
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80",
    description: "A flowering beauty with romantic pastel blooms.",
    longDescription:
      "Rose Begonia offers charming blossoms and rich foliage, making it a standout gift plant or statement piece. It adds beauty and softness wherever it is displayed.",
    light: "Bright indirect light",
    water: "Water when soil surface starts to dry",
    petFriendly: "No",
  },
  {
    id: 6,
    slug: "sage-succulent-trio",
    name: "Sage Succulent Trio",
    price: 19.99,
    category: "Succulents",
    image:
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=900&q=80",
    description: "Three charming succulents in a soft garden-inspired set.",
    longDescription:
      "The Sage Succulent Trio is a lovely low-maintenance set that works beautifully in sunny windows and gift arrangements. Their sculptural look adds texture and modern charm.",
    light: "Bright light",
    water: "Water sparingly",
    petFriendly: "Some varieties may not be",
  },
];