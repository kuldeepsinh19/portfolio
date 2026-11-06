import styles from './SectionHeader.module.css';

/** Numbered section heading shared by every homepage section. */
export function SectionHeader({
  index,
  label,
  title,
  lede,
  id,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  id?: string;
}) {
  return (
    <header className={styles.header}>
      <p className="eyebrow">
        <b>{index}</b> {label}
      </p>
      <h2 className="h-section" id={id}>
        {title}
      </h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </header>
  );
}
