import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const gitConfig = {
  user: 'cameronking4',
  repo: 'datastack-demo',
  branch: 'main',
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'DataStack',
    },
    links: [
      {
        text: 'Docs',
        url: '/docs',
      },
      {
        text: 'API Reference',
        url: '/docs/api-reference',
      },
      {
        text: 'Guides',
        url: '/docs/guides',
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
