# Jellyfin Widget for Samsung Smart TV (Orsay) - Knowledge Base

## Project Overview

- **Type**: Samsung Smart TV Widget Application (Orsay Platform)
- **Primary Language**: JavaScript (ES5)
- **Framework**: Samsung Smart TV SDK (Orsay Widget API)
- **Target Platform**: Samsung Smart TVs 2011-2015 (D, E, F, B, H, HU series)
- **Purpose**: Media player client for Jellyfin/Emby server, enabling browsing and playback of media libraries on legacy Samsung Smart TVs

## Metadata

- **Created**: 2026-01-07
- **Last Updated**: 2026-01-07
- **Widget Version**: 2.2.9 (per `config.xml`)
- **Analyzed By**: Claude Code (/deep-dive-extra command)

## Architecture

### High-Level Architecture

This is a **Single-Page Application (SPA)** widget for Samsung Orsay TVs that:

1. Connects to a Jellyfin media server via REST API
2. Provides navigation UI for browsing media libraries
3. Supports direct playback and server-side transcoding
4. Stores user/server configuration locally on TV filesystem

**Key Architectural Characteristics:**
- **Object-literal pattern**: All modules are global singletons (e.g., `var GuiUsers = { ... }`)
- **Event-driven navigation**: TV remote key events drive all UI interactions
- **Synchronous HTTP**: Uses XMLHttpRequest synchronously for API calls
- **Local file storage**: Samsung `FileSystem` API for persistent settings

### Directory Structure

```
Jellyfin/
├── config.xml                    # Widget manifest (ID, version, icon)
├── widget.info                   # Samsung widget metadata
├── index.html                    # Entry point with all module imports
├── Main.css                      # Global styles (1920x1080 TV resolution)
├── README.md                     # Original Emby client README
├── images/                       # UI assets (backgrounds, icons, buttons)
│   ├── bg1.jpg, splash.jpg       # Background images
│   ├── loading.png               # Loading spinner
│   ├── menu/                     # Navigation menu icons
│   ├── musicplayer/              # Music player controls
│   └── tvkeys/                   # Remote control key images
├── fonts/                        # Open Sans web font
└── app/
    ├── init.js                   # Samsung TV initialization
    └── javascript/
        ├── Main.js               # App bootstrap, globals, TV model detection
        ├── Server.js             # Jellyfin REST API client
        ├── Support.js            # Utility functions, URL history, screensaver
        ├── Support/              # Support modules
        │   ├── File.js           # Local file storage (settings/users)
        │   ├── FileLog.js        # Debug logging to file
        │   ├── GuiHelper.js      # UI helper functions
        │   └── GuiNotifications.js # Toast notification system
        └── Gui/                  # UI page modules
            ├── GuiMainMenu.js    # Main navigation menu
            ├── GuiUsers.js       # User selection/login
            ├── GuiUsers_Manual.js # Manual server entry
            ├── GuiPage_Servers.js # Server selection
            ├── GuiPage_NewServer.js # Add new server
            ├── GuiPage_Home*.js  # Home page variants
            ├── GuiPage_Settings.js # Settings (User/Server/TV)
            ├── GuiPage_Music*.js # Music browsing/playback
            ├── GuiPage_Photos.js # Photo browsing
            ├── GuiPage_TvGuide.js # Live TV guide
            ├── GuiTV_*.js        # TV show pages
            ├── GuiDisplay_*.js   # Media display views
            ├── GuiDisplayOneItem.js # Single item detail view
            ├── GuiPage_ItemDetails.js # Media item details
            ├── GuiPage_Search.js # Search functionality
            ├── GuiPage_Contributors.js # Credits/about
            ├── GuiPage_SettingsLog.js # Debug log viewer
            ├── GuiPlayer/        # Video player components
            │   ├── GuiPlayer.js  # Video playback controller
            │   ├── GuiPlayer_Display.js # Player UI overlay
            │   ├── GuiPlayer_Transcoding.js # Transcoding logic
            │   ├── GuiPlayer_TranscodeParams.js # Per-TV-model codec params
            │   └── GuiPlayer_Versions.js # Multi-version media selection
            ├── GuiMusicPlayer/   # Music player components
            │   └── GuiMusicPlayer.js
            └── GuiImagePlayer/   # Image viewer/screensaver
                ├── GuiImagePlayer.js
                └── GuiImagePlayer_Screensaver.js
```

### Entry Points

- **`index.html`**: Main entry point loaded by TV widget runtime
  - Loads all JavaScript modules via `<script>` tags
  - Defines HTML structure with focus-receiving `<a>` elements for key events
  - Initializes app via `Main.init()` on page load

- **`Main.js`**: Application bootstrap module
  - `Main.init()`: Entry function, detects TV model, loads settings
  - `Main.onLoad()`: Called after init, starts server connection flow
  - `Main.getModelYear()`: Returns TV series letter (D, E, F, B, H, HU)

### Key Components

| Module | Purpose |
|--------|---------|
| `Main.js` | App initialization, TV model detection, version info |
| `Server.js` | Jellyfin REST API client, authentication, media URLs |
| `Support.js` | Utilities (time conversion, URL history stack, screensaver) |
| `File.js` | Persistent storage (servers, users, settings) |
| `GuiMainMenu.js` | Main navigation sidebar menu |
| `GuiUsers.js` | User login/selection screen |
| `GuiPlayer.js` | Video playback engine using Samsung AVPlay API |
| `GuiPlayer_TranscodeParams.js` | Per-TV-model codec compatibility tables |
| `GuiMusicPlayer.js` | Background music playback |
| `GuiPage_Settings.js` | User preferences, TV settings, server settings |

### Public Interfaces

**Main Entry Functions:**
- `Main.init()` → `index.html:67` - Application initialization
- `GuiUsers.start()` → `GuiUsers.js:19` - Start user selection flow
- `GuiMainMenu.start()` → `GuiMainMenu.js` - Post-login main menu

**Server API Functions:**
- `Server.getContent(url)` → `Server.js` - GET request to Jellyfin API
- `Server.Authenticate(userId, username, password)` → `Server.js` - User auth
- `Server.getServerAddr()` → Returns configured server URL
- `Server.getUserID()` → Returns authenticated user ID
- `Server.getAuthToken()` → Returns API authentication token

**Storage Functions:**
- `File.loadFile()` → `File.js:32` - Load settings JSON from TV storage
- `File.saveServerToFile(id, name, ip)` → `File.js:67` - Save server config
- `File.addUser(...)` → `File.js:138` - Save user credentials

### User Interface / Presentation Layer

- **Resolution**: Fixed 1920x1080 (Full HD)
- **Layout**: Full-screen single-page application with page transitions
- **Styling**: CSS with absolute positioning, opacity transitions
- **Navigation**: D-pad remote control (UP/DOWN/LEFT/RIGHT/ENTER/RETURN)
- **Focus Model**: HTML `<a>` elements with `onfocus` handlers for key events
- **Color Keys**: RED/GREEN/YELLOW/BLUE buttons for contextual actions

### Platform-Specific Considerations

**Samsung Orsay TV APIs Used:**
- `widgetAPI` - Widget lifecycle control (exit events, navigation blocking)
- `pluginAPI` - Key registration/unregistration
- `FileSystem` - Persistent local storage in `curWidget.id` directory
- `AVPlayer` - Video playback plugin (`pluginPlayer`)
- `Audio` - Audio output control (`pluginObjectAudio`)
- `IMEShell` - On-screen keyboard for text input
- `Network` - Network interface information

**TV Model Detection:**
Samsung TVs are identified by model year letter (extracted from `productinfo`):
- **D series** (2011): Basic codec support
- **E series** (2012): Enhanced codec support
- **F series** (2013): Full HD, extended formats
- **B series**: Similar to F
- **H series** (2014): H.265/HEVC support (1080p)
- **HU series** (2015 UHD): 4K/2160p, HEVC

## Data Flow

### Execution Flow

1. **Startup**: `index.html` loads → `Main.init()` → detect TV model
2. **Server Selection**: `File.loadFile()` → check for default server
3. **Connection Test**: `Server.testConnectionSettings()` → validate server
4. **User Login**: `GuiUsers.start()` → authenticate with Jellyfin
5. **Main Menu**: `GuiMainMenu.start()` → browse libraries
6. **Media Playback**: `GuiPlayer.startPlayback()` → determine playback method

### State Management

- **Global Singletons**: Each GUI module maintains its own state object
- **URL History Stack**: `Support.URLHistory[]` maintains navigation breadcrumbs
- **Session State**: `Server.js` stores auth token, user ID, device ID
- **Persistent State**: `File.js` manages JSON file on TV filesystem

**Settings File Structure** (`MB3_Settings.json`):
```json
{
  "Version": "2.2.9",
  "Servers": [{
    "Id": "server-guid",
    "Name": "My Jellyfin",
    "Path": "http://192.168.1.100:8096",
    "Default": true,
    "Users": [{
      "UserId": "user-guid",
      "UserName": "john",
      "Password": "hashed-or-empty",
      "RememberPassword": true,
      "Default": true,
      "HighlightColour": 1,
      "View1": "TVNextUp",
      "View2": "LatestMovies"
    }]
  }],
  "TV": {
    "Bitrate": 60,
    "Dolby": false,
    "DTS": false,
    "ItemPaging": 150
  }
}
```

### Data Persistence

- **Location**: Samsung common storage at `curWidget.id/MB3_Settings.json`
- **Log File**: `curWidget.id/MB3_Log.txt` for debug logging
- **Format**: JSON stored as single line in text file

### External Integrations

**Jellyfin Server REST API:**
- `/Users/Public` - Get public users list
- `/Users/AuthenticateByName` - User authentication
- `/Items` - Browse media libraries
- `/Shows/NextUp` - Continue watching
- `/Videos/{id}/stream` - Direct video playback
- `/Videos/{id}/main.m3u8` - HLS transcoded stream
- `/Audio/{id}/Stream.mp3` - Audio streaming
- `/Images` - Artwork retrieval
- `/LiveTv/Programs` - TV guide data
- `/Sessions/Playing` - Playback progress reporting

## Design Patterns & Conventions

### Architectural Patterns

- **Module Pattern**: Object literals as namespaced singletons
- **Observer-like Key Handling**: Each page defines `keyDown()` for remote events
- **State Machine**: Pages manage `selectedItem`, `topLeftItem` for navigation
- **Template Method**: `start()` function initializes each page

### Code Organization

- **One module per file**: Clear separation of concerns
- **Global namespace**: All modules accessible globally
- **Page lifecycle**: `start()` → `keyDown()` → `processSelectedItem()`
- **Horizontal scrolling grid**: Common pattern for media browsing

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Page modules | `GuiPage_*` | `GuiPage_Settings.js` |
| Display modules | `GuiDisplay_*` | `GuiDisplay_Episodes.js` |
| Player modules | `GuiPlayer*` / `GuiMusicPlayer*` | `GuiPlayer.js` |
| Support modules | No prefix | `File.js`, `Support.js` |
| Event handlers | `keyDown`, `processSelectedItem` | - |
| Properties | camelCase | `selectedItem`, `topLeftItem` |

## Critical Paths

### Authentication/Authorization

1. User selects server from `GuiPage_Servers`
2. Server connection tested via `/System/Info`
3. `GuiUsers.start()` loads public users from `/Users/Public`
4. User selection triggers `Server.Authenticate()` POST to `/Users/AuthenticateByName`
5. Success stores auth token in `Server.authToken`, user ID in `Server.userId`
6. Credentials optionally saved to `File.addUser()` for auto-login

### Core Business Logic

**Video Playback Decision (`GuiPlayer.js`):**
1. Load media info via `Server.getPlaybackInfo()`
2. Check codec compatibility using `GuiPlayer_TranscodeParams.getParameters()`
3. Compare video/audio codecs, container, bitrate, resolution against TV capabilities
4. If compatible → Direct Stream (no transcoding)
5. If incompatible → Request HLS transcode from server

**Transcoding Parameters** (`GuiPlayer_TranscodeParams.js`):
- Per-TV-model codec matrices
- H.264 up to Level 4.1 supported on all models
- H.265/HEVC only on H/HU series
- 4K resolution only on HU series

### Error Handling

- **Network Errors**: `Server.getContent()` returns `null`, callers check and bail
- **Auth Failures**: `Server.Authenticate()` returns `false`, shows notification
- **Playback Errors**: Plugin callbacks (`OnRenderError`, `OnStreamNotFound`)
- **Notifications**: `GuiNotifications.setNotification(message, title)` for user feedback

### Security Considerations

- **Password Storage**: Passwords stored in plaintext in JSON file on TV
- **Auth Token**: Stored in memory during session
- **HTTPS**: Supported but not enforced
- **No Input Sanitization**: Server URLs, item names directly inserted into DOM

## Performance & Optimization

### Known Bottlenecks

- **Synchronous XHR**: All API calls block UI thread
- **Large Libraries**: Paging used (default 150 items per page)
- **Image Loading**: Sequential loading can delay page render
- **DOM Manipulation**: `innerHTML` assignments cause full reparse

### Optimization Strategies

- **Paging**: `ItemPaging` setting controls batch size (100-500)
- **Image Limits**: `ImageTypeLimit=1` reduces API payload
- **Backdrop Timeout**: Random backdrop loads after 500ms delay
- **Screensaver**: Prevents burn-in during idle periods

### Resource Constraints

- **Memory**: Limited on older TV models
- **CPU**: Single-threaded JavaScript, slow on D/E series
- **Network**: 100Mbps max on most models
- **Storage**: Limited common storage area

## Dependencies

### Core Dependencies

- **Samsung Smart TV SDK (Orsay)**: Required platform
- **jQuery**: Animation library (for `.animate()` calls)
- **CryptoJS**: SHA-1 hashing for password authentication

### Development Dependencies

- **Samsung TV Emulator**: For testing without physical TV
- **SDK Tools**: Widget packaging

## Configuration

### Environment Variables

N/A - All configuration via settings file

### Build Configuration

**`config.xml`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget>
  <previewicon>icon/115x95.png</previewicon>
  <bigpreviewicon>icon/222x168.png</bigpreviewicon>
  <preicon>icon/106x87.png</preicon>
  <icon>icon/106x87.png</icon>
  <bigicon>icon/115x95.png</bigicon>
  <ver>2.2.9</ver>
  <cpname>Jellyfin</cpname>
  <cpauthjs>y</cpauthjs>
  <type>user</type>
  <category>network</category>
  <srcctl>y</srcctl>
  <movie>n</movie>
  <fullwidget>y</fullwidget>
  <dcont>y</dcont>
  <widgetname>Jellyfin</widgetname>
  <description>Jellyfin for Samsung Smart TV (2011-2015)</description>
  <width>1920</width>
  <height>1080</height>
  <author>
    <name>Jellyfin Contributors</name>
    <email/>
    <link/>
    <organization/>
  </author>
</widget>
```

### Scripts & Automation

Widget is deployed via parent Jellyfin-Orsay-Installer application which:
- Packages this directory into a ZIP
- Generates `widgetlist.xml` for Samsung TV discovery
- Serves files via HTTP for TV installation

## Testing Strategy

- **Manual Testing**: Primary method using Samsung TV or emulator
- **No Automated Tests**: Legacy codebase without test framework
- **Debug Logging**: `FileLog.write()` for runtime diagnostics
- **Console Alerts**: `alert()` calls throughout for debugging

## Observability & Debugging

### Logging & Diagnostics

- **FileLog**: Writes timestamped entries to `MB3_Log.txt`
- **Console Alerts**: `alert()` shows debug info in TV debug mode
- **Settings Log Page**: `GuiPage_SettingsLog.js` displays log in UI

### Debugging Approach

1. Enable Samsung TV developer mode
2. Connect via SDK tools for console access
3. Check `MB3_Log.txt` for runtime logs
4. Use `GuiPage_Settings` → Log view in app

### Error Reporting

- Errors displayed via `GuiNotifications.setNotification()`
- Network/auth failures show toast messages
- Player errors trigger callbacks with error types

## Technical Debt & Known Issues

### Technical Debt

- **Global Namespace Pollution**: All modules are globals
- **No Module System**: Plain `<script>` includes
- **Synchronous XHR**: Blocks UI, could cause ANR
- **jQuery Dependency**: Only used for animations
- **Password Storage**: Plaintext in JSON file
- **DOM String Building**: No templating, direct string concat

### Known Bugs

- **Clock Offset**: TV time may be wrong, requires manual offset setting
- **Subtitle Rendering**: Limited to SRT/text subtitles via custom renderer
- **HLS + Subtitles**: Complex interaction with server-side burns

### Future Improvements

- Migrate to async/await patterns
- Add proper error boundaries
- Implement secure credential storage
- Add subtitle format support
- Optimize image lazy loading

## Gotchas & Important Notes

1. **TV Series Detection**: `Main.getModelYear()` critical for codec decisions
2. **Key Registration**: Must call `pluginAPI.registKey()` to receive certain keys
3. **Focus Management**: Navigation requires careful `document.getElementById().focus()` calls
4. **URL History**: Manual stack for RETURN key navigation
5. **Screensaver**: Prevents OLED burn-in, uses random media images
6. **Bitrate Setting**: User-configurable max, forces server transcoding if exceeded
7. **Cinema Mode**: Plays trailers before main content if enabled on server
8. **Evolution Kit**: H-series can be upgraded with SEK modules for better codec support

## Development Workflow

### Running Locally

This widget template is deployed via the parent `Jellyfin-Orsay-Installer` .NET application:

1. Build/run the Installer application
2. Follow wizard to configure server IP/port
3. Widget packaged and served automatically
4. Configure Samsung TV Developer Mode with PC IP
5. TV discovers and installs widget

### Testing on TV

1. Enable Developer Mode on Samsung TV (Menu → Smart Hub → Settings)
2. Set Developer IP to PC running Installer
3. Navigate to "User Applications" on TV
4. Widget appears for installation

### Making Changes

1. Edit files in `Template/Jellyfin/` directory
2. Restart Installer to repackage
3. Reinstall on TV (or restart app for JS changes)

## Maintaining This Documentation

### When to Update

- After changes to API integration with Jellyfin
- When adding new TV series support
- After codec/playback capability changes
- When modifying authentication flow
- Quarterly reviews for accuracy

### How to Update

Run `/deep-dive-extra` again or manually edit this file to reflect changes.
Focus on updating changed sections rather than full rewrites.
