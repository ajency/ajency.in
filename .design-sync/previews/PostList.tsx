import { PostList } from 'ajency-design';

export const HomeWriting = () => (
  <PostList
    posts={[
      {
        href: '/one-person-ai-team/',
        meta: '2026 · AI Agents',
        title: 'The whole elephant',
        dek: 'A project that used to take a team of specialists — each holding one part of the elephant — delivered end to end by one person and a bench of AI agents.',
      },
      {
        href: '/self-documenting-uat-agent/',
        meta: '2026 · AI Agents',
        title: 'UAT has an inertia problem',
        dek: 'I automated the click-through I kept skipping. It turned into an agent that documents itself and answers support questions — for almost no tokens.',
      },
    ]}
  />
);
