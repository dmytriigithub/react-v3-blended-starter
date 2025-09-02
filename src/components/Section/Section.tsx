import style from "./Section.module.css";

export default function Section({ children }: { children: React.ReactNode }) {
  return <section className={style.section}>{children}</section>;
}
