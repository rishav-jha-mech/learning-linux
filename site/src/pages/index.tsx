import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

type Level = {
  title: string;
  description: string;
  href: string;
};

const levels: Level[] = [
  {
    title: 'Basic',
    description: 'Shell basics, files, permissions, everyday commands.',
    href: '/docs/basic/intro',
  },
  {
    title: 'Intermediate',
    description: 'Processes, networking, shell scripting.',
    href: '/docs/intermediate/intro',
  },
  {
    title: 'Advanced',
    description: 'Internals, debugging, containers.',
    href: '/docs/advanced/intro',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="learning-linux"
      description="Notes from learning Linux">
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--8 col--offset-2 text--center margin-bottom--lg">
            <Heading as="h1">learning-linux</Heading>
            <p>Notes from learning Linux, start to finish: basic, then intermediate, then advanced.</p>
          </div>
        </div>
        <div className="row">
          {levels.map((level) => (
            <div key={level.title} className="col col--4">
              <Link to={level.href} className="card padding--lg margin-bottom--lg" style={{height: '100%', display: 'block'}}>
                <Heading as="h3">{level.title}</Heading>
                <p>{level.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
