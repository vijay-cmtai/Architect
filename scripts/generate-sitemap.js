import fs from "fs";
import "dotenv/config";

const BASE_URL = "https://houseplanfiles.com";

function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function generateSitemap() {
  console.log("Generating sitemap...");

  const backendUrl = process.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    console.error("Error: VITE_BACKEND_URL is not defined in your .env file.");
    process.exit(1);
  }

  try {
    const staticPages = [
      { path: "/", priority: 1.0, changefreq: "daily" },
      { path: "/products", priority: 0.9, changefreq: "weekly" },
      { path: "/cart", priority: 0.8 },
      { path: "/checkout", priority: 0.8 },
      { path: "/thank-you", priority: 0.8 },
      { path: "/services", priority: 0.8 },
      { path: "/about", priority: 0.8 },
      { path: "/download", priority: 0.8 },
      { path: "/careers", priority: 0.8 },
      { path: "/contact", priority: 0.8 },
      { path: "/register", priority: 0.8 },
      { path: "/login", priority: 0.8 },
      { path: "/apply", priority: 0.8 },
      { path: "/terms", priority: 0.8 },
      { path: "/privacy", priority: 0.8 },
      { path: "/payment-policy", priority: 0.8 },
      { path: "/refund-policy", priority: 0.8 },
      { path: "/blogs", priority: 0.9, changefreq: "weekly" },
      { path: "/floor-plans", priority: 0.8 },
      { path: "/3D-plans", priority: 0.8 },
      { path: "/interior-designs", priority: 0.8 },
      { path: "/construction-products", priority: 0.9 },
      { path: "/customize/floor-plans", priority: 0.8 },
      { path: "/customize/interior-designs", priority: 0.8 },
      { path: "/customize/3d-elevation", priority: 0.8 },
      { path: "/customize/3d-video-walkthrough", priority: 0.8 },
      { path: "/corporate-inquiry/standard", priority: 0.8 },
      { path: "/corporate-inquiry/premium", priority: 0.8 },
      { path: "/brand-partners", priority: 0.8 },
      { path: "/booking-form", priority: 0.8 },
      { path: "/premium-booking-form", priority: 0.8 },
      { path: "/gallery", priority: 0.8 },
    ];

    const productsRes = await fetch(`${backendUrl}/api/products`);
    if (!productsRes.ok) throw new Error("Failed to fetch products");
    const productsData = await productsRes.json();
    const products = Array.isArray(productsData)
      ? productsData
      : productsData?.products || [];

    const today = new Date().toISOString().split("T")[0];

    const staticUrls = staticPages
      .map(
        (page) => `
      <url>
        <loc>${BASE_URL}${page.path}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${page.changefreq || "monthly"}</changefreq>
        <priority>${page.priority}</priority>
      </url>`
      )
      .join("");

    const productUrls = products
      .map((product) => {
        // <<< यहाँ बदलाव किया गया है >>>
        const productName = product.name || product.Name || "untitled-plan";

        const lastmod = product.updatedAt
          ? product.updatedAt.split("T")[0]
          : today;
        return `
      <url>
        <loc>${BASE_URL}/product/${slugify(productName)}-${product._id}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>`;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${productUrls}
</urlset>`;

    fs.writeFileSync("public/sitemap.xml", sitemap, "utf8");
    console.log("Sitemap generated successfully at public/sitemap.xml");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

generateSitemap();
