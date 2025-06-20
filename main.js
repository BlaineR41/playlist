// Selecting all elements
let btn = document.querySelectorAll('.song #play_btn');
let song = document.querySelectorAll('#music');

/* Popup music player part */
let p_m_player = document.querySelector('.popup_music_player');
let down_player = document.querySelector('#down_player');
let current_track_name = document.querySelector('#current_track_name');
let current_singer_name = document.querySelector('#current_singer_name');
let song_img = document.querySelector('.song_img');

/* Controls part */
let play_pause_btn = document.querySelector('#play_pause_btn');
let slider = document.querySelector('#slider');
let forward_btn = document.querySelector('#forward_btn');
let backward_btn = document.querySelector('#backward_btn');

/* Songs duration */
let current_duration = document.querySelector('.controlls .progress_part #current_duration');
let total_duration = document.querySelector('.controlls .progress_part #total_duration');

/* Small music player part */
let s_m_player = document.querySelector('.small_music_player');
let playing_img = document.querySelector('.playing_img');
let wave_animation = document.querySelector('.wave_animation');
let up_player = document.querySelector('#up_player');
let song_name = document.querySelector('#song_name');
let artist_name = document.querySelector('#artist_name');

/* Default values */
let is_song_played = false;
let song_status = false;
let index_no = 0;

// Step 3: Define the togglePlayback function to play or pause a song
// Test by calling togglePlayback("play", 0) to confirm that it plays the first song and updates the UI correctly
function togglePlayback(action, index) {
  if (action === "play") {
    song[index].play();
    song_status = true;
    wave_animation.style.opacity = '1';
    play_pause_btn.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
  } else if (action === "pause") {
    song[index].pause();
    song_status = false;
    clearInterval(update_second);
    wave_animation.style.opacity = '0';
    play_pause_btn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
  }
}

// Step 4: Set up event listeners for play buttons to handle individual song selection
// Test by clicking each song button and checking if it plays and shows the song details in the small music player
btn.forEach((btn, index) => {
  btn.addEventListener('click', function() {
    s_m_player.style.transform = 'translateY(0px)'; // Show small music player

    // Stop previous song if a different song is selected
    if (song_status && index !== index_no) {
      togglePlayback("pause", index_no);
      song[index_no].classList.remove("active_song");
    }

    index_no = index; // Update the index for the selected song
    song[index_no].currentTime = 0; // Reset the song's time

    play_song(); // Play the selected song
  });
});

// Step 5: Define play_song function to start a song and update the UI
// Test by checking that song details and image update each time a new song is played
function play_song() {
  if (document.querySelector(".active_song")) {
    document.querySelector(".active_song").pause(); // Pause currently active song
    document.querySelector(".active_song").classList.remove("active_song"); // Remove active class
  }

  togglePlayback("play", index_no); // Play selected song
  song[index_no].classList.add("active_song"); // Add active class to the song

  // Update song details in UI
  song_img.innerHTML = `<img src="${All_song[index_no].img}" />`;
  playing_img.innerHTML = `<img src="${All_song[index_no].img}" />`;
  song_name.innerHTML = All_song[index_no].name;
  artist_name.innerHTML = All_song[index_no].singer;
  current_track_name.innerHTML = All_song[index_no].name;
  current_singer_name.innerHTML = All_song[index_no].singer;

  setInterval(update_second, 1000); // Start updating song progress every second
  p_m_player.style.transform = 'translateY(0%)'; // Show popup player
}

// Step 6: Define update_second function to handle song progress and duration display
// Test by playing a song and checking if the slider and duration display update correctly
function update_second() {
  let position = 0;

  if (!isNaN(song[index_no].duration)) {
    position = song[index_no].currentTime * (100 / song[index_no].duration);
    slider.value = position; // Update slider position
  }

  // Display the total duration
  let durationMinutes = Math.floor(song[index_no].duration / 60);
  let durationSeconds = Math.floor(song[index_no].duration - durationMinutes * 60);
  total_duration.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;

  // Display current playback time
  let curr_minutes = Math.floor(song[index_no].currentTime / 60);
  let curr_seconds = Math.floor(song[index_no].currentTime - curr_minutes * 60);
  current_duration.textContent = `${curr_minutes}:${curr_seconds < 10 ? '0' : ''}${curr_seconds}`;

  if (song[index_no].ended) {
    clearInterval(update_second); // Reset when song ends
    wave_animation.style.opacity = '0';
    play_pause_btn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
  }
}

// Step 7: Add event listeners for popup player toggling
up_player.addEventListener('click', function() {
  p_m_player.style.transform = 'translateY(0%)'; // Show popup player
});

down_player.addEventListener('click', function() {
  p_m_player.style.transform = 'translateY(110%)'; // Hide popup player
});

// Step 8: Add event listener for play/pause button inside the popup player
play_pause_btn.addEventListener('click', function() {
  if (song_status) {
    togglePlayback("pause", index_no);
  } else {
    togglePlayback("play", index_no);
  }
});

// Step 9: Define change_duration function to adjust the song’s current time via the slider
function change_duration() {
  let slider_position = song[index_no].duration * (slider.value / 100);
  song[index_no].currentTime = slider_position;
}

// Step 10: Add functionality for forward and backward buttons to skip songs
// Test by pressing forward/backward to check if it correctly switches to the next or previous song
forward_btn.addEventListener('click', function() {
  index_no = (index_no + 1) % All_song.length; // Move to next song
  song[index_no].currentTime = 0;
  play_song();
});

backward_btn.addEventListener('click', function() {
  index_no = (index_no - 1 + All_song.length) % All_song.length; // Move to previous song
  song[index_no].currentTime = 0;
  play_song();
});

// Initial setup: Start updating song progress every second
setInterval(update_second, 1000);
