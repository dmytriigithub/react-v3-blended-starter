export interface Photo {
  id: number;
  avg_color: string;
  src: {
    original: string;
    large: string;
  };
  alt: string;
}
