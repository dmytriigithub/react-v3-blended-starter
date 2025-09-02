import style from "./GridItem.module.css";

interface GridItemProps {
  children: React.ReactNode;
  onSelect(): void;
}

export default function GridItem({ children, onSelect }: GridItemProps) {
  return (
    <li className={style.item} onClick={onSelect}>
      {children}
    </li>
  );
}
