# remove_youtube_watch_later
This is designed to remove videos specifically from the youtube watch later playlist. **This is not recommended for other playlists!**
### Using
1. When on the watch later playlist, either click the extension icon or use the keypress `Shift+Ctrl+H`.
2. The popup will appear, in which you can fill the inputs, along with keywords.
  - The inputs directly below the range legend only accepts numbers.
  - The inputs directly below the title and channel name legend can accept either a string (will be case insensitive) or a javascript regular expression. If you do not know what a regular expression is, do not use it, but it provides more control when searching. [Some documentation on regex in case you need it](https://www.w3schools.com/JS/js_regexp.asp).
 3. Click submit and watch  as the page moves on it's own.
 ### Options
 There is not much in terms of options, but you can play with the time the extension will wait for the page to load (for continuing searches) and the delay time in between each removal of a video (so it works). If you have some time and want to spend it playing with this, be my guest (especially since clearing a lot of videos can take about 50 mins tops (5000 vids times at least 550 milliseconds)).
 ### Installing
 1. Clone this repo.
 2. Go to the extensions tab for your particular Chromium-based browser (right-click puzzle piece and click "Manage Extensions").
 3. Turn on developer mode.
 4. Click on "Load Unpacked" and direct to wherever you cloned this repo in (go down to remove_youtube_watch_later directory and can see the manifest.json file).
