# Mithical (Yosh version)

A Wacca GUI (edited by me since the fork) + backend for artemis (completely made by me)

This GUI reflects the behaviour of my version of the game, which is notably different from the owner whose I forked this repo from.

It's a Nuxt application + flask backend

use `yarn dev` to start the development server + `flask-backend.py` to start backend

Make sure mithical-backend (provided because it's Yosh version!!!!) is running. Create a `.env` file at the root and set URLs to override the defaults. See `.env.example` file.

## Changelog
SongList Changed.<br>
fixed cover directories<br>
corrected bugs that would display the wrong grade depending on the vue used.<br>
The rating has changed. it also shows the 100 best songs.<br>
Max rate per song is x1.1 instead of x4, which makes it easier for spectators to get an idea of which song levels you can easily play. (1400 = 14) <br>
Each song best score is now displayed in the Rating vue with an appropriate colour depending on your score.<br>
added backend (of course!)


## How to add a new song
edit assets\wacca\waccaSongs.js <br>
add your png to public\wacca\img\covers\{imageName} <br>
where imageName is what you've specified in waccaSongs.js <br> <br>
instead of editing waccaSongs.js manually you can do this:<br>
```
wacky unpack --json MusicParameterTable.uasset MusicParameterTable.uexp -o new.js
```
fuseSongs.py<br>
then manually swap created file with waccaSongs

### if you wanna add a song in-game, here's the tutorial <br>
chart a song with MercuryMapper. I recommend siamesederp tutorial <br>
https://siamesederp.github.io/MercuryMapper-Tutorial/Editor/  <br>
once it's done, export as .mer for each difficulty  <br>
00 is normal, 01 is hard, and 02 is expert  <br>
add files manually  <br>
+ MusicData/S04-000/S04-000_00.mer  <br>
+ MusicData/S04-000/S04-000_01.mer  <br>
+ MusicData/S04-000/S04-000_02.mer  <br>

edit each .mer file in hex editor so the start is as follows (do not add carriage return to the file!!!!!! no 0D)  <br>
```
#MUSIC_SCORE_ID 0
#MUSIC_SCORE_VERSION 0
#GAME_VERSION
#MUSIC_FILE_PATH MER_BGM_S04_000
```
 the ID in #MUSIC_FILE_PATH can be different from the ID in MusicParameterTable, but the acb tool hardcodes the first to S04-000 so write that in the mer file  <br>
WSongInject <br>
~ Table/MusicParameterTable.uasset +13B 16/08/2025 17:35:26 <br>
~ Table/MusicParameterTable.uexp +1KB 16/08/2025 17:35:26 <br>
~ Table/UnlockMusicTable.uasset +18B 16/08/2025 17:35:26 <br>
~ Table/UnlockMusicTable.uexp +395B 16/08/2025 17:35:26 <br>
\+ UI/Textures/JACKET/S04/uT_J_S04_000.uasset <br>
\+ UI/Textures/JACKET/S04/uT_J_S04_000.uexp <br>
 <br>
extract MER-BGM.acb from MER_BGM.uexp  (should start with @UTF) <br>
 <br>
wacca_song_editor.py append-song --acb-path=MER-BGM.acb --awb=MER_BGM_V3_06 --song-path=Rainbow.wav <br>
\+ Sound/Bgm/MER_BGM.acb.injected <br>
\+ Sound/Bgm/MER_BGM_V3_06.injected <br>

## How to add icons, plates, or titles
edit js files in assets\wacca <br>
add your png to public\wacca\img <br>
in-game you just need to edit IconTable.uasset, UserPlateBackgroundTable.uasset, or GradeTable.uasset <br>
you can (and should) also add a new message entry in IconMessage.uasset, UserPlateBackgroundMessage.uasset, or GradeMessage.uasset <br>

## How to add navigators, colors, or sound effect
~~ask Yellow~~

## notes
no gamba 
```
ITEM_TYPES = {
  :xp => 1,
  :wp => 2,
  :music_unlock => 3,
  :music_difficulty_unlock => 4,
  :title => 5,
  :icon => 6,
  :trophy => 7,
  :skill => 8,
  :ticket => 9,
  :console_color => 10,
  :note_sound => 11,
  :title_part => 12,
  :boost_badge => 13,
  :gate_point => 14,
  :navigator => 15,
  :plate => 16,
  :touch_effect => 17
}
```
