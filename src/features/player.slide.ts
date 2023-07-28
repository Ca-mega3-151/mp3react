import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import data from "../data";
import { shuffle } from "lodash";

interface ISong {
  id: number;
  title: string;
  singer: string;
  cover: string;
  src: string;
}

type SongID = ISong["id"];

interface IPlayerState {
  songs: ISong[];
  currentSong: ISong | null;
  isPlaying: boolean;
  volume: number;
  loop: false | true | 1;
  shuffle: boolean;
  shuffledSongs: ISong[];
  currentTime: number; 
}

const initialState: IPlayerState = {
  songs: data,
  currentSong: null,
  isPlaying: false,
  volume: 100,
  loop: false,
  shuffle: false,
  shuffledSongs: data,
  currentTime: 0,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    togglePlay(state) {
      if (!state.currentSong) {
        state.currentSong = state.songs[0];
      }

      state.isPlaying = !state.isPlaying;
    },
    setSong(state, action: PayloadAction<SongID>) {
      const song = state.songs.find((song) => song.id == action.payload);

      if (song) {
        state.currentSong = song;
      }
    },
    next(state) {
      if (!state.currentSong) {
        state.currentSong = state.songs[0];
      } else {
        const currentSong = state.currentSong;

        const currentSongIndex = state.songs.findIndex(
          (song) => song.id == currentSong.id
        );

        if (!state.loop || state.loop === 1) {
          state.currentSong = state.songs[currentSongIndex + 1] || currentSong;
        } else {
          state.currentSong =
            state.songs[currentSongIndex + 1] || state.songs[0];
        }
      }
    },
    prev(state) {
      if (!state.currentSong) {
        state.currentSong = state.songs[state.songs.length - 1];
      } else {
        const currentSong = state.currentSong;

        const currentSongIndex = state.songs.findIndex(
          (song) => song.id == currentSong.id
        );

        if (!state.loop || state.loop === 1) {
          state.currentSong = state.songs[currentSongIndex - 1] || currentSong;
        } else {
          state.currentSong =
            state.songs[currentSongIndex - 1] ||
            state.songs[state.songs.length - 1];
        }
      }
    },
    // setVolume(state, action: PayloadAction<number>) {},
    setVolume(state, action: PayloadAction<number>){
      state.volume = action.payload;
    },


    toggleLoop(state){
      state.loop = !state.loop;
    },
    // setCurrentTime(state, action: PayloadAction<number>) {
    //   state.currentTime = action.payload;
    //   if (state.currentSong) {
    //     playerRef.current.currentTime = action.payload;
    //   }
    // },
    toggleShuffle(state): void {
      state.shuffle = !state.shuffle;
    
      if (state.shuffle) {
        // Nếu chuyển sang chế độ suffle, sắp xếp ngẫu nhiên danh sách bài hát và gán vào shuffledSongs
        state.shuffledSongs = shuffle(state.songs);
      } else {
        // Nếu tắt chế độ suffle, gán lại shuffledSongs bằng danh sách bài hát ban đầu
        state.shuffledSongs = state.songs;
      }
    
      // Cập nhật currentSong trong trường hợp currentSong hiện tại không nằm trong shuffledSongs
      if (state.currentSong) {
        const currentSongId = state.currentSong.id;
        const currentSongInShuffledSongs = state.shuffledSongs.find(
          (song) => song.id === currentSongId
        );
    
        if (!currentSongInShuffledSongs) {
          state.currentSong = null;
        }
      }
    }
  },
});

export default playerSlice;
