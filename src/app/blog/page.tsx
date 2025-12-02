// src/app/blog/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Cars Abeg Blog – Real Prices, Zero Wahala",
};

const posts = [
  {
    slug: "top-10-tokunbo-under-10m",
    title: "Top 10 Tokunbo Cars Under ₦10 Million in Nigeria (2025)",
    date: "Nov 27, 2025",
    excerpt:
      "Clean foreign-used cars you can actually afford right now in Lagos & Abuja",
    readTime: "6 min read",
  },
  {
    slug: "nigerian-used-vs-tokunbo",
    title: "Nigerian Used vs Tokunbo: Which One Should You Buy in 2025?",
    date: "Nov 25, 2025",
    excerpt: "The honest truth nobody tells you before spending millions",
    readTime: "8 min read",
  },
  {
    slug: "spot-fake-tokunbo",
    title: "How to Spot a Fake Tokunbo Car in Lagos (5 Red Flags)",
    date: "Nov 23, 2025",
    excerpt: "95% of “Tokunbo” in Berger are accidented Nigerian-used cars",
    readTime: "5 min read",
  },
  {
    slug: "toyota-camry-prices-2025",
    title: "Toyota Camry Prices in Nigeria 2010–2021 (Live Update)",
    date: "Nov 27, 2025",
    excerpt: "Muscle, Spider, Big Daddy, Orobo — current Lagos prices today",
    readTime: "4 min read",
  },
  {
    slug: "look-rich-cars",
    title: "7 Cars That Make You Look Rich (But Cost Less Than ₦10M)",
    date: "Nov 20, 2025",
    excerpt:
      "Evil Spirit, C300, RX350 — people will think you’re a billionaire",
    readTime: "7 min read",
  },
  {
    slug: "sold-corolla-48-hours",
    title: "How I Sold My 2015 Corolla in 48 Hours Using Cars Abeg",
    date: "Nov 18, 2025",
    excerpt: "Real story: 47 buyers messaged me on WhatsApp in 2 days",
    readTime: "4 min read",
  },
];

export default function BlogHome() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-2xl font-black text-gray-900 mb-6">
            Cars Abeg Blog
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-700">
            Real prices • Real stories • Zero wahala
          </p>
        </div>

        <div className="grid gap-10">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-green-600">
                  {post.date}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                {post.title}
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                {post.excerpt}
              </p>
              <span className="inline-block mt-6 text-green-600 font-black text-lg hover:text-green-700">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
