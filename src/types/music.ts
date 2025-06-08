
export type Theme = 'midnight' | 'ocean' | 'sunset' | 'forest' | 'candy';
export type Language = 'english' | 'hindi' | 'gujarati';

export interface Song {
  id: string;
  yt_title: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
  description:string;
  publish_date:number;
  lyrics: {
    english: string;
    hindi: string;
    gujarati: string;
  };
  similarity?: number;
}
