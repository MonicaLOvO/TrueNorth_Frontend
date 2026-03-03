export type CategorySlug =
  | "food"
  | "travel"
  | "movies"
  | "music"
  | "games"
  | "books"
  | "shopping"
  | "fitness";

export type Category = {
  slug: CategorySlug;
  title: string;
  subtitle: string;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { slug: "food", title: "Food", subtitle: "What to eat", emoji: "🍴" },
  { slug: "travel", title: "Travel", subtitle: "Where to go", emoji: "✈️" },
  { slug: "movies", title: "Movies", subtitle: "What to watch", emoji: "🎬" },
  { slug: "music", title: "Music", subtitle: "What to listen", emoji: "🎵" },
  { slug: "games", title: "Games", subtitle: "What to play", emoji: "🎮" },
  { slug: "books", title: "Books", subtitle: "What to read", emoji: "📚" },
  { slug: "shopping", title: "Shopping", subtitle: "What to buy", emoji: "🛍️" },
  { slug: "fitness", title: "Fitness", subtitle: "How to move", emoji: "🏋️" },
];