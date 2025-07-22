
export type Theme = 'midnight' | 'ocean' | 'sunset' | 'forest' | 'candy';
export type Language = 'english' | 'hindi' | 'gujarati';

export interface Song {
  id: string;
  yt_title: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
  description: string;
  publish_date_seconds: number;
  lyrics: {
    english: string;
    hindi: string;
    gujarati: string;
  };
  similarity?: number;
}

export interface Song_DATA_CSV {
  lyrics: string;
  audio: string;
  song_name: string;
  title: string;
  description: string;
  channelid: string;
  view: string;
  author: string,
  duration: string;
  likes: string;
  category: string;
  publishdate: string;
  tags: string;
  id: string;
}
