import type { Post } from "../types/post.type";

export const mapPosts = (posts: Record<string, any>[]): Post[] => {
  const mappedPosts: Post[] = posts
    .map((v) => ({
      url: v["url"],
      frontmatter: v["frontmatter"],
    }))
    .sort(
      (a, b) =>
        new Date(b.frontmatter.pubDate).valueOf() -
        new Date(a.frontmatter.pubDate).valueOf()
    );

  return mappedPosts;
};
