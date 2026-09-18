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
    description: 'Shell basics, files, permissions, and the everyday commands you reach for first.',
    count: '24 pages',
    href: '/docs/basic/intro',
  },
  {
    index: '02',
    title: 'Intermediate',
    description: 'Processes, networking, and shell scripting once the basics feel automatic.',
    count: '24 pages',
    href: '/docs/intermediate/intro',
  },
  {
    index: '03',
    title: 'Advanced',
    description: 'Kernel internals, debugging tools, and the primitives containers are built from.',
    count: '16 pages',
    href: '/docs/advanced/intro',
  },
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="learning-linux" description="Notes from learning Linux">
      <header className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <span className={styles.kicker}>
            <span className={styles.kickerDot} />
            64 pages, one command at a time
          </span>
          <Heading as="h1" className={styles.heroTitle}>
            learning<span className={styles.dim}>-</span>linux
          </Heading>
          <p className={styles.heroSubtitle}>
            A personal reference built while actually learning Linux, ordered
            so you can follow it start to finish or jump straight to what you need.
          </p>
          <div className={styles.heroActions}>
            <Link to="/docs/basic/intro" className={styles.btnPrimary}>
              Start with Basic <ArrowIcon />
            </Link>
            <Link
              to="https://github.com/rishav-jha-mech/learning-linux"
              className={styles.btnSecondary}>
              View on GitHub
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <Heading as="h2">Three sections, in order</Heading>
              <p>Each one builds on the last, but nothing stops you from skipping ahead.</p>
            </div>
            <div className={styles.grid}>
              {levels.map((level) => (
                <Link key={level.title} to={level.href} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardIndex}>{level.index}</span>
                    <span className={styles.cardCount}>{level.count}</span>
                  </div>
                  <Heading as="h3" className={styles.cardTitle}>
                    {level.title}
                  </Heading>
                  <p className={styles.cardDescription}>{level.description}</p>
                  <span className={styles.cardFooter}>
                    Read the notes <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.pageFooter}>
        <p className={styles.footerCredit}>
          Built by <a href="https://rishavjha.com">rishavjha.com</a>
        </p>
      </footer>
    </Layout>
  );
}
