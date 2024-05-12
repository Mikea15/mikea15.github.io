// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'MikeaDev';
export const SITE_DESCRIPTION = 'Collecting thoughts about programming, ai and games';

import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "MikeaDev",
  EMAIL: "michael.adaixo@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 4,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Collecting thoughts about programming, ai and games",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Collecting thoughts about programming, ai and games",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Work experience",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "List of some of the projects I've worked on, published/released, or not.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "twitter-x",
    HREF: "https://twitter.com/michaeladaixo",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/mikea15"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/michaeladaixo",
  }
];