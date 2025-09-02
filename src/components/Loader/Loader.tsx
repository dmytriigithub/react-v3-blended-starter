import { FadeLoader } from "react-spinners";
import style from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={style.backdrop}>
      <FadeLoader color="#f60f03" />
    </div>
  );
}
