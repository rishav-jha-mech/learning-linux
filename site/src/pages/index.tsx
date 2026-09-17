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
  topics: string[];
  href: string;
};

const levels: Level[] = [
  {
    step: 'Step 1',
    icon: '🐚',
    title: 'Basic',
    description: 'Shell basics, files, permissions, everyday commands.',
    topics: ['ls', 'cd', 'grep', 'chmod'],
    href: '/docs/basic/intro',
  },
  {
    step: 'Step 2',
    icon: '⚙️',
    title: 'Intermediate',
    description: 'Processes, networking, shell scripting.',
    topics: ['ps', 'ssh', 'awk', 'systemctl'],
    href: '/docs/intermediate/intro',
  },
  {
    step: 'Step 3',
    icon: '🧠',
    title: 'Advanced',
    description: 'Internals, debugging, containers.',
    topics: ['strace', 'perf', 'cgroups', 'namespaces'],
    href: '/docs/advanced/intro',
  },
];

const stats = [
  {number: '24', label: 'Basic'},
  {number: '24', label: 'Intermediate'},
  {number: '16', label: 'Advanced'},
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
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
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.terminal} aria-hidden="true">
            <div className={styles.terminalBar}>
              <span className={styles.terminalDot} />
              <span className={styles.terminalDot} />
              <span className={styles.terminalDot} />
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.terminalLine}>
                <span className={styles.terminalPrompt}>$</span>
                man learning-linux
              </div>
              <div className={styles.terminalOutput}>
                basic → intermediate → advanced<span className={styles.cursor} />
              </div>
            </div>
          </div>

          <Heading as="h1" className={styles.heroTitle}>
            learning<span className={styles.accent}>-</span>linux
          </Heading>
          <p className={styles.heroSubtitle}>
            Notes from learning Linux, one command at a time, in order:
            basic, then intermediate, then advanced.
          </p>

          <div className={styles.heroStats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="container">
        <div className={styles.levels}>
          <div className={styles.levelsHeading}>
            <Heading as="h2">Pick up where you are</Heading>
            <p>Each section builds on the last, but you can jump in anywhere.</p>
          </div>

          <div className={`row ${styles.path}`}>
            <div className={styles.pathLine} aria-hidden="true" />
            {levels.map((level) => (
              <div key={level.title} className="col col--4">
                <Link to={level.href} className={styles.card}>
                  <span className={styles.cardIconWrap}>{level.icon}</span>
                  <span className={styles.cardStep}>{level.step}</span>
                  <Heading as="h3" className={styles.cardTitle}>
                    {level.title}
                  </Heading>
                  <p className={styles.cardDescription}>{level.description}</p>
                  <div className={styles.cardTopics}>
                    {level.topics.map((topic) => (
                      <code key={topic} className={styles.cardTopic}>
                        {topic}
                      </code>
                    ))}
                  </div>
                  <span className={styles.cardCta}>
                    Start reading <ArrowIcon />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
