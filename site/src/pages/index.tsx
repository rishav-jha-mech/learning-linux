import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

type Level = {
  index: string;
  title: string;
  description: string;
  count: string;
  href: string;
};

const levels: Level[] = [
  {
    index: '01',
    title: 'Basic',
    description: 'Shell basics, files, permissions, everyday commands.',
    count: '24 pages',
    href: '/docs/basic/intro',
  },
  {
    index: '02',
    title: 'Intermediate',
    description: 'Processes, networking, shell scripting.',
    count: '24 pages',
    href: '/docs/intermediate/intro',
  },
  {
    index: '03',
    title: 'Advanced',
    description: 'Internals, debugging, containers.',
    count: '16 pages',
    href: '/docs/advanced/intro',
  },
];

export default function Home(): ReactNode {
  return (
    <Layout title="learning-linux" description="Notes from learning Linux">
      <header className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.kicker}>A personal Linux reference</div>
          <Heading as="h1" className={styles.heroTitle}>
            learning-linux
          </Heading>
          <p className={styles.heroSubtitle}>
            Notes from learning Linux, one command at a time, in order:
            basic, then intermediate, then advanced.
          </p>
        </div>
      </header>

      <main className="container">
        <div className={styles.levels}>
          {levels.map((level) => (
            <Link key={level.title} to={level.href} className={styles.levelRow}>
              <span className={styles.levelIndex}>{level.index}</span>
              <span className={styles.levelMain}>
                <Heading as="h2" className={styles.levelTitle}>
                  {level.title}
                </Heading>
                <p className={styles.levelDescription}>{level.description}</p>
                <span className={styles.levelMeta}>
                  <span className={styles.levelCount}>{level.count}</span>
                  <span className={styles.levelArrow}>&rarr;</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerCredit}>
          Built by <a href="https://rishavjha.com">rishavjha.com</a>
        </p>
      </footer>
    </Layout>
  );
}
