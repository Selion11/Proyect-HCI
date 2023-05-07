class SpeakerState {
  constructor(status, volume, genre, songStatus, meta){
    this.status = status
    this.volume = volume
    this.genre = genre

    // SongStatus - NOT Song!!
    this.song = songStatus

    this.meta = meta
  }
}

class Song {
  constructor(title, artist, album, duration){
    this.title = title
    this.artist = artist
    this.album = album
    this.duration = duration
  }
}

class SongStatus extends Song{
  constructor(title, artist, album, duration, progress){
    super(title, artist, album, duration)
    this.progress = progress
  }
}

// Desp vemos qué ponerle acá
class SpeakerMeta {
  constructor(){
    return {}
  }
}

export { Song, SpeakerMeta, SpeakerState }
