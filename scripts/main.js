$(document).ready(function(){
  $(".hamburger").click(function(){
    $(this).toggleClass("is-active");
  });
});

let menu = document.querySelector('.menu'), openMenu = false
let behindCircleMenu = document.querySelector('.menu .behindCircle')
let tlMenu = new TimelineMax({paused:true})
tlMenu.addLabel("sync")
.to(behindCircleMenu, 0, {ease:Power1.easeInOut, display:"block"}, "sync")
.to(behindCircleMenu, 0.6, {ease:Power1.easeInOut, scale:12}, "sync")
.set('.menu .hamburger', {className: '+=inDropDown'}, "sync")
.to('.menu .hamburger',0.6, {y:-30}, "sync")


menu.addEventListener('touchstart', () => {
  !openMenu ? (tlMenu.play(), openMenu = true) : (tlMenu.reverse(), openMenu = false)
})

document.querySelector('.number').addEventListener('touchstart', () => {
  scroll.animateScroll(0)
})

let rumble = new TimelineMax({repeat:-1, yoyo:true,  paused:false})
rumble.to(".mainContainer", 0.3, {x:3, y:3})

// let discover = document.querySelector('.discover'), discoverOpen = false
// let tlDiscover = new TimelineMax({paused:true})
// tlDiscover.to(discover, 0.3, {width:"80%"})
// tlDiscover.to(discover, 0.3, {height:"100vh"})
// discover.addEventListener('touchstart', () => {
//   // !discoverOpen ? (tlDiscover.play(), discoverOpen = true) : (tlDiscover.reverse(), openMenu = false)
//   tlDiscover.play()
// })



class AudioPlayer {
  constructor() {
    this.fileCount = 3
    this.activeSong = 0
    this.artists = ['Avoure', 'Kill la Kill', 'Atlas']
    this.songs = ['Aura', 'Before My Body Is Dry', 'Lane 8']
    this.audios = []
    this.coversSrc = []
    this.durations = []
    for (var i = 0; i < this.artists.length; i++) {
      this.audios.push(new Audio('audio/'+this.songs[i]+'-'+this.artists[i]+".mp3"))
      this.coversSrc.push('images/'+this.songs[i]+'-'+this.artists[i]+'.png')
    }
    this.playerDom = document.querySelector(".musicPlayer")
    this.coverDom = document.querySelector(".musicPlayer .cover img")
    this.songDom = document.querySelector(".musicPlayer .songName")
    this.artistDom = document.querySelector(".musicPlayer .artistName")
    this.activeTimeDom = document.querySelector('.musicPlayer .currentTime')
    this.totalTimeDom = document.querySelector('.musicPlayer .totalTime')
    this.sampleStrings = ["Another one ?", "Maybe this one", "We only have 3 dude"]
    this.progressValue = 0
    this.progressDom = document.querySelector(".musicPlayer .musicProgress")
    this.isPlaying = false

    setTimeout(() => {
      for (var i = 0; i < this.audios.length; i++) {
        let minutes = parseInt(this.audios[i].duration / 60, 10)
        let seconds = parseInt(this.audios[i].duration % 60)
        seconds<10 ? seconds = "0"+seconds : seconds
        minutes<10 ? minutes = "0"+minutes : minutes
        this.durations.push(minutes+":"+seconds)
      }
    }, 150);

  }

  updateInfos(){
    let n = this.activeSong
    if (this.artists[n].length>6) {
      this.artistDom.innerHTML = this.artists[n].substring(0,6)
    } else {
      this.artistDom.innerHTML = this.artists[n]
    }
    if (this.songs[n].length>6) {
      this.songDom.innerHTML = this.songs[n].substring(0,6)
    } else {
      this.songDom.innerHTML = this.songs[n]
    }
    this.coverDom.src = this.coversSrc[n]
    this.totalTimeDom.innerHTML = this.durations[n]
    document.querySelector('.sample').innerHTML = this.sampleStrings[n]
  }
  songTimeUpdate(){
    let minutes = parseInt(this.audios[this.activeSong].currentTime / 60, 10)
    let seconds = parseInt(this.audios[this.activeSong].currentTime % 60)
    seconds<10 ? seconds = "0"+seconds : seconds
    minutes<10 ? minutes = "0"+minutes : minutes
    this.activeTimeDom.innerHTML = minutes+":"+seconds
  }

  barUpdate(){
    let audio = this.audios[this.activeSong]
    this.progressValue = parseInt((audio.currentTime *100 / audio.duration))
    this.progressDom.style.width = this.progressValue +"%"
  }
  start(){
    this.updateInfos()
    !this.isPlaying ? (this.audios[this.activeSong].play(), this.isPlaying = true ) : (this.audios[this.activeSong].pause(), this.isPlaying = false)
    this.songTimeUpdate()
    setInterval(() => {
      this.songTimeUpdate()
      this.barUpdate()
    }, 100);
  }

  swapSong(aaa){
    this.audios[this.activeSong].pause()
    this.activeSong<this.fileCount-1 ? this.activeSong++ : this.activeSong = 0
    this.updateInfos()
  }
}

let audioP = new AudioPlayer()
document.querySelector('.playBtn').addEventListener('touchstart', () => {
  audioP.start()
})

let tlSwapSong = new TimelineMax({paused:true, repeat:1, yoyo:true})
tlSwapSong.addLabel("sync")
tlSwapSong.to(audioP.playerDom.children, 0.3, {opacity:0})
tlSwapSong.to('.musicPlayer', 0.2, {width:0, borderRadius:"0px", onComplete:audioP.swapSong, onCompleteScope:audioP}, "-=0.1")

document.querySelector('.sample').addEventListener('touchstart', () => {
  tlSwapSong.restart()
})
