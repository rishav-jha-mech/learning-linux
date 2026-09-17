import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

type Level = {
  step: string;
  icon: string;
  title: string;
  description: string;
  href: string;
};

const levels: Level[] = [
  {
    step: 'Step 1',
    icon: '🐚',
    title: 'Basic',
    description: 'Shell basics, files, permissions, everyday commands.',
    href: '/docs/basic/intro',
  },
  {
    step: 'Step 2',
    icon: '⚙️',
    title: 'Intermediate',
    description: 'Processes, networking, shell scripting.',
    href: '/docs/intermediate/intro',
  },
  {
    step: 'Step 3',
    icon: '🧠',
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
      <header className={styles.hero}>
        <span className={styles.heroPrompt}>man learning-linux</span>
        <Heading as="h1" className={styles.heroTitle}>
          learning-linux
        </Heading>
        <p className={styles.heroSubtitle}>
          Notes from learning Linux, one command at a time — start to finish:
          basic, then intermediate, then advanced.
        </p>
      </header>
      <main className={`container ${styles.levels}`}>
        <div className="row">
          {levels.map((level) => (
            <div key={level.title} className="col col--4">
              <Link to={level.href} className={styles.card}>
                <span className={styles.cardStep}>{level.step}</span>
                <span className={styles.cardIcon}>{level.icon}</span>
                <Heading as="h3" className={styles.cardTitle}>
                  {level.title}
                </Heading>
                <p className={styles.cardDescription}>{level.description}</p>
                <span className={styles.cardCta}>start reading →</span>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
