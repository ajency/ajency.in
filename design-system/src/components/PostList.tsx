import type { ReactNode } from 'react';

export interface PostItem {
  href: string;
  /** Small uppercase eyebrow — "2026 · AI Agents". */
  meta: ReactNode;
  title: ReactNode;
  /** One-or-two-sentence grey dek under the title. */
  dek?: ReactNode;
}

export interface PostListProps {
  posts: PostItem[];
}

/**
 * Writing list: post rows separated by hairlines, each row one whole link —
 * uppercase meta eyebrow, bold title that gains the growing yellow underline
 * on hover, and a grey dek. Kept at the reading measure.
 */
export function PostList({ posts }: PostListProps) {
  return (
    <section className="writing">
      <ul className="post-list">
        {posts.map((post, i) => (
          <li className="post" key={i}>
            <a href={post.href}>
              <span className="post-meta">{post.meta}</span>
              <span className="post-title">{post.title}</span>
              {post.dek && <span className="post-dek">{post.dek}</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
