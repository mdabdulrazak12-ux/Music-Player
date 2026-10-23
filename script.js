// 1. Initial Master Songs Database Repository (Configured with free public internet audio links matching your layout)
const songs = [
    { 
        id: 1, 
        name: "Shape Of You", 
        artist: "Ed Sheeran", 
        img: "https://images.genius.com/b987a0d3e07d6f10d3c434bfb69a651f.1000x1000x1.jpg", 
        genre: "Pop", 
        source: "Shape of You.mp3" 
    },
    { 
        id: 2, 
        name: "All Of Me", 
        artist: "Adele", 
        img: "https://images.genius.com/2f27bd5a55449e2b1457a88f277d912b.1000x1000x1.jpg", 
        genre: "Soul", 
        source: "All of Me.mp3" 
    },
    { 
        id: 3, 
        name: "Somelike Like You", 
        artist: "Adele", 
        img: "https://tse1.mm.bing.net/th/id/OIP.tFklM8rxohQRPIPjI3d1sQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", 
        genre: "Soul", 
        source: "Someone-Like-You.mp3" 
    },
    { 
        id: 4, 
        name: "Wonderwall", 
        artist: "Oasis", 
        img: "https://tse1.mm.bing.net/th/id/OIP.JL9sxkuiFB32kNveRB5aEAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", 
        genre: "Rock", 
        source: "Wonder_Wall.mp3" 
    },
    { 
        id: 5, 
        name: "Sugar", 
        artist: "Maroon 5", 
        img: "https://tse4.mm.bing.net/th/id/OIP.3BR-xMbS_akNgbMu4EWptwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", 
        genre: "Pop", 
        source: "Sugar.mp3" 
    },
    { 
        id: 6, 
        name: "Locked Away", 
        artist: "R. City", 
        img: "https://tse3.mm.bing.net/th/id/OIP.ioK0UUe9MxYnv1fWqcNwTAHaKk?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", 
        genre: "Pop", 
        source: "Locked_away.mp3" 
    }
];

let playlists = { "Favorites": [] }; // Seeded with an initial default folder
let currentSongIndex = null;

// Target DOM link containers
let masterSongsList, genreSelect, searchInput, mediaArtworkDisplay, playlistNameInput, playlistSubmitBtn, playlistsTreeContainer, themeCheckbox;

document.addEventListener("DOMContentLoaded", () => {
    masterSongsList = document.getElementById('master-songs-list');
    genreSelect = document.getElementById('genre-select');
    searchInput = document.getElementById('search-input'); // Added search reference hook
    mediaArtworkDisplay = document.getElementById('media-artwork-display');
    playlistNameInput = document.getElementById('playlist-name-input');
    playlistSubmitBtn = document.getElementById('playlist-submit-btn');
    playlistsTreeContainer = document.getElementById('playlists-tree-container');
    themeCheckbox = document.getElementById('theme-checkbox');

    // UI Interactive listener attachments
    genreSelect.addEventListener('change', showSongs);
    if(searchInput) searchInput.addEventListener('input', showSongs); // Listen for real-time text input queries
    if(playlistSubmitBtn) playlistSubmitBtn.onclick = createPlaylist;
    if(themeCheckbox) themeCheckbox.onchange = toggleTheme;

    // Run baseline loaders cleanly
    showSongs();
    renderPlaylistsTree();
    
    // Auto load first song track into the dashboard window by default matching layout view
    if (songs.length > 0) {
        currentSongIndex = 0;
        renderCurrentSong(false); // Render initial state without autoplacing immediate audio streams play
    }
});

// Dynamic Content List Generation Engine with Combined Filters
function showSongs() {
    if (!masterSongsList) return;
    masterSongsList.innerHTML = '';
    
    const activeFilter = genreSelect.value;
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    songs.forEach((song, index) => {
        // Condition A: Matches the selected genre category dropdown
        const matchesGenre = activeFilter === 'all' || song.genre === activeFilter;
        
        // Condition B: Matches text string within Track Title or Artist Name properties
        const matchesSearch = song.name.toLowerCase().includes(searchQuery) || 
                              song.artist.toLowerCase().includes(searchQuery);

        if (matchesGenre && matchesSearch) {
            const btn = document.createElement('button');
            btn.innerText = `${song.name} - ${song.artist}`;
            btn.onclick = () => {
                currentSongIndex = index;
                renderCurrentSong(true);
            };
            masterSongsList.appendChild(btn);
        }
    });
}

// Media view renderer mapping album windows and direct browser audio bars
function renderCurrentSong(shouldAutoPlay) {
    if (currentSongIndex === null) return;
    const song = songs[currentSongIndex];

    // Build the dynamic target option listings matching user created folders
    let dropdownOptions = '';
    Object.keys(playlists).forEach(name => {
        dropdownOptions += `<option value="${name}">${name}</option>`;
    });

    mediaArtworkDisplay.innerHTML = `
        <img src="${song.img}" alt="${song.name} Cover">
        <div class="track-details-row">
            <h2>${song.name}</h2>
            <p>${song.artist}</p>
        </div>

        <!-- 1. Next & Previous Navigation Buttons Added -->
        <div class="navigation-controls-row" style="display: flex; justify-content: center; gap: 12px; margin: 15px 0;">
            <button id="card-prev-btn" style="padding: 8px 16px; background-color: #4a5568; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">◀ Previous</button>
            <button id="card-next-btn" style="padding: 8px 16px; background-color: #4a5568; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Next ▶</button>
        </div>

        <!-- 2. Add To Playlist Component Dropdown and Action Button Added -->
        <div class="card-playlist-assignment" style="display: flex; justify-content: center; gap: 8px; margin: 15px 0 10px 0;">
            <select id="card-target-select" style="padding: 6px; border-radius: 4px; border: 1px solid #cbd5e0;">
                ${dropdownOptions}
            </select>
            <button id="card-add-to-playlist-btn" style="padding: 8px 16px; background-color: var(--button-accent, #805ad5); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Add to Playlist</button>
        </div>

        <!-- Standard Native Browser Control Bar Engine loaded cleanly matching design -->
        <audio id="main-audio-node" controls></audio>
    `;

    const audioNode = document.getElementById('main-audio-node');
    audioNode.src = song.source;
    
    if (shouldAutoPlay) {
        audioNode.play().catch(e => console.log("Audio playing engine deferred until manual user interaction hook:", e));
    }

    // Bind functionality keys to our freshly rendered layout actions nodes
    document.getElementById('card-next-btn').onclick = () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        renderCurrentSong(true);
    };

    document.getElementById('card-prev-btn').onclick = () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        renderCurrentSong(true);
    };

    document.getElementById('card-add-to-playlist-btn').onclick = addToPlaylist;
}

// Validation loop processing track registrations inside target folder references array map
function addToPlaylist() {
    const targetSelect = document.getElementById('card-target-select');
    if (!targetSelect) return;

    const chosenPlaylist = targetSelect.value;
    const songId = songs[currentSongIndex].id;

    // Check for track duplication indexes to ensure clean collection data integrity rules
    if (!playlists[chosenPlaylist].includes(songId)) {
        playlists[chosenPlaylist].push(songId);
        renderPlaylistsTree();
        alert(`"${songs[currentSongIndex].name}" successfully added to folder: ${chosenPlaylist}`);
    } else {
        alert("This specific track item is already present inside your selected playlist.");
    }
}

function createPlaylist() {
    const name = playlistNameInput.value.trim();
    if (!name) return alert("Please type a playlist name.");
    if (playlists[name]) return alert("Name already in use.");

    playlists[name] = [];
    playlistNameInput.value = '';
    renderPlaylistsTree();
    
    // Refresh core card details view structure immediately to output updated selector options dropdown definitions lists 
    if (currentSongIndex !== null) renderCurrentSong(false);
}

function renderPlaylistsTree() {
    if (!playlistsTreeContainer) return;
    playlistsTreeContainer.innerHTML = '';
    Object.keys(playlists).forEach(name => {
        const item = document.createElement('div');
        item.style.cssText = "padding: 6px 0; font-weight: bold; cursor: pointer; color: var(--text-primary);";
        item.innerText = `📂 ${name} (${playlists[name].length} tracks)`;
        playlistsTreeContainer.appendChild(item);
    });
}

function toggleTheme() {
    const mode = themeCheckbox.checked ? "dark" : "light";
    document.documentElement.setAttribute('data-theme', mode);
}