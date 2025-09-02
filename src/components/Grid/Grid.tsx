import style from "./Grid.module.css";

export default function Grid({ children }: { children: React.ReactNode }) {
  return <ul className={style.list}>{children}</ul>;
}
