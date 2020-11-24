<template>
  <div class="audio-player">
     <aplayer :music="videoUpload.music"></aplayer>   
  </div>
</template>

<script>
import aplayer from 'vue-aplayer'

export default {
  data() {
    return {
      videoUpload: {
        progress: false,
        progressPercent: 0,
        successPercent: 0,
        music: {
           title: '',
           artist: '',
           src: '',
           lrc: ''
       }
      }
    }
  },

  components: {
    aplayer
  },

  props:{
    audioUrl:String,
    title: String,
    artist: String,
  },

  created() {
    this.videoUpload.music.src = this.audioUrl
    this.videoUpload.music.title = this.title
    this.videoUpload.music.artist = this.artist
  },

  mounted() {

  },
  methods: {



 
  }
}
</script>

<style lang="less">
.audio-player {

}
</style>