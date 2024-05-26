import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import embeds from 'astro-embed/integration';
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://www.mikeadev.net",
  integrations: [embeds({
    // options
    services: {
      LinkPreview: false,
    }
  }), mdx(), sitemap(), tailwind()],
});
