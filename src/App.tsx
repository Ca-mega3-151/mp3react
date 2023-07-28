import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./features/hooks";
import playerSlice from "./features/player.slide";
import "./App.css";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { shuffle } from 'lodash';

function App() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useAppDispatch();
  const { songs, currentSong, isPlaying , volume    } = useAppSelector(
    (state) => state.player
  );
  const playerRef = useRef<HTMLAudioElement>(new Audio());
  const currentTimeRef = useRef<HTMLSpanElement | null>(null);
  const durationRef = useRef<HTMLSpanElement | null>(null);
  const timeRef = useRef<HTMLInputElement | null>(null);

  const handleRandom = () => {
    if (songs.length === 0) return; // Nếu danh sách bài hát rỗng, không làm gì cả

    // Tạo danh sách bài hát mới bằng cách sắp xếp ngẫu nhiên danh sách bài hát gốc
    const shuffledSongs = shuffle(songs);

    // Cập nhật trạng thái trong Redux để sử dụng danh sách bài hát đã sắp xếp ngẫu nhiên
    dispatch(playerSlice.actions.toggleShuffle());
    dispatch(playerSlice.actions.setSong(shuffledSongs[0].id)); // Chọn bài hát đầu tiên trong danh sách ngẫu nhiên làm bài hát hiện tại
  };


  useEffect(() => {
    if (currentSong) {
      playerRef.current.src = currentSong.src;
      playerRef.current.load();
    }
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong) return;

    if (isPlaying) {
      playerRef.current.paused && playerRef.current.play();
    } else {
      playerRef.current.played && playerRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // useEffect(() => {
  //   playerRef.current.addEventListener("durationchange", (e) => {
  //     durationRef.current &&
  //       (durationRef.current.textContent = playerRef.current.duration);

  //     timeRef.current && (timeRef.current.max = playerRef.current.duration);
  //   });

  //   playerRef.current.addEventListener("timeupdate", (e) => {
  //     currentTimeRef.current &&
  //     currentTimeRef.current.textContent = Math.floor(playerRef.current.currentTime)


  //     timeRef.current &&
  //     timeRef.current.value = Math.floor(playerRef.current.currentTime)
  //   });
  // }, []);
  useEffect(() => {
    playerRef.current.addEventListener("durationchange", (e) => {
      if (durationRef.current) {
        durationRef.current.textContent = formatTime(playerRef.current.duration);
        timeRef.current.max = playerRef.current.duration;
      }
    });
    
    playerRef.current.addEventListener("timeupdate", (e) => {
      if (currentTimeRef.current) {
        currentTimeRef.current.textContent = formatTime(
          Math.floor(playerRef.current.currentTime)
        );
      }
  
      if (timeRef.current) {
        timeRef.current.value = Math.floor(playerRef.current.currentTime);
      }
    });
  }, []);
  
  // Function to convert seconds to HH:MM:SS format
  function formatTime(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
  
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  




    // Xử lý khi thay đổi giá trị của thanh trượt âm lượng
    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseInt(event.target.value, 10);
      dispatch(playerSlice.actions.setVolume(newVolume));
      playerRef.current.volume = newVolume / 100;
    };

  //  //   Xử lý khi thay đổi giá trị của thanh trượt thời gian
  // const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const newTime = parseFloat(event.target.value);
  //   dispatch(playerSlice.actions.setCurrentTime(newTime));
  //   playerRef.current.currentTime = newTime;
  // };


  return (
    <div className="App">
      <div className="list_song">
        <Button variant="primary" onClick={handleShow}>
          List Nhạc
        </Button>

        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>List nhạc </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {songs.map((song) => (
              <div
                key={song.id}
                onClick={() => dispatch(playerSlice.actions.setSong(song.id))}

              >
                {song.title} {currentSong?.id === song.id && "(playing)"}
              </div>
            ))}

          </Offcanvas.Body>
        </Offcanvas>
      </div>

      <div className="cover-song">
        {songs.map((song) => (
          <div key={song.id}
            onClick={() => dispatch(playerSlice.actions.setSong(song.id))}
          >
            {currentSong?.id === song.id && (
              <img src={song.cover} alt={song.title} width={500} height={300} />
            )

            }
          </div>
        ))}
      </div>




      <div className="footer-mp3">

        <div className="left-footer">
        {songs.map((song) => (
          <div key={song.id}
            onClick={() => dispatch(playerSlice.actions.setSong(song.id))}
          >
            {currentSong?.id === song.id && (
              <div className="flex">
                <img className="img-cover-footer" src={song.cover} alt={song.title} width={40} height={40} />
                <div className="info-song">
                  <h5>{song.title}</h5>
                  <p>{song.singer}</p>
                </div>
              </div>

            )

            }
          </div>
        ))}
        </div>

        <div className="center-footer">
        <button onClick={handleRandom}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shuffle" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z" />
            <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" />
          </svg>
        </button>
        <button onClick={() => dispatch(playerSlice.actions.prev())}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
          </svg>
        </button>
        <button onClick={() => dispatch(playerSlice.actions.togglePlay())}>
          {isPlaying ?
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
            </svg> :
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-square-fill" viewBox="0 0 16 16">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 10a.5.5 0 0 0 .832.374l4.5-4a.5.5 0 0 0 0-.748l-4.5-4A.5.5 0 0 0 5.5 4v8z" />
            </svg>}
        </button>
        <button onClick={() => dispatch(playerSlice.actions.next())}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
          </svg>
        </button>
        <button onClick={() => dispatch(playerSlice.actions.toggleLoop())}>lặp</button>
      
        <div className="time-slider">
        <span ref={currentTimeRef}>00:00</span>
        <input
          ref={timeRef}
          type="range"
          onChange={(e) => {
            playerRef.current.currentTime = +e.target.value;
          }}
        />
        <span ref={durationRef}>00:00</span>
      </div>
      </div>

      <div className="right-footer">
      <div className="volume-slider">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-volume-mute" viewBox="0 0 16 16">
  <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
</svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-volume-up" viewBox="0 0 16 16">
  <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
  <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
  <path d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z"/>
</svg>


      </div>
      
      </div>

      </div>
    </div>
  );
}

export default App;
