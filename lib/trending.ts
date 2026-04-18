export type TrendingAddonBase = {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  downloads: number;
  author?: string;
  author_name?: string;
  created_at: string;
};

export type Rating = {
  addon_id: string;
  rating: number;
};

export type AddonWithTrending<T> = T & {
  averageRating: number;
  ratingCount: number;
  trendingScore: number;
};

export function calculateTrendingScore(
  downloads: number,
  averageRating: number,
  ratingCount: number,
  createdAt: string
) {
  const now = new Date().getTime();
  const created = new Date(createdAt).getTime();
  const ageInDays = Math.max(1, (now - created) / (1000 * 60 * 60 * 24));

  const downloadScore = downloads * 0.7;
  const ratingScore = averageRating * 15;
  const ratingCountScore = ratingCount * 4;
  const freshnessScore = 30 / ageInDays;

  return downloadScore + ratingScore + ratingCountScore + freshnessScore;
}

export function buildTrendingAddons<T extends TrendingAddonBase>(
  addons: T[],
  ratings: Rating[]
): AddonWithTrending<T>[] {
  return addons
    .map((addon) => {
      const addonRatings = ratings.filter((r) => r.addon_id === addon.id);
      const ratingCount = addonRatings.length;

      const averageRating =
        ratingCount > 0
          ? addonRatings.reduce((sum, r) => sum + r.rating, 0) / ratingCount
          : 0;

      const trendingScore = calculateTrendingScore(
        addon.downloads ?? 0,
        averageRating,
        ratingCount,
        addon.created_at
      );

      return {
        ...addon,
        averageRating,
        ratingCount,
        trendingScore,
      };
    })
    .sort((a, b) => b.trendingScore - a.trendingScore);
}