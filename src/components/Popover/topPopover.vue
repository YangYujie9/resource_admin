<template>
  <div class="top-popover">
    <div class="top-div">
      <p class="titlep">
        <slot name="reference"></slot>
      </p>
      <div class="popover-div">
        <div>
          <p>学段：</p>
          <el-radio-group v-model="learningSection" size="mini" :disabled="isReset" @change="getSubject">
            <el-radio-button v-for="list in sectionList" :label="list" :key="list.key">{{list.value}}</el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <p>科目：</p>
          <el-radio-group v-model="subject" size="mini" :disabled="isReset" @change="getVersionList">
            <el-radio-button :label="item" :key="item.key" v-for="item in subjectsList">{{item.value}}</el-radio-button>
          </el-radio-group>
        </div>
        <div v-show="chooseType == 'chapter'">
          <p>教材版本：</p>
          <el-radio-group v-model="oese" size="mini" @change="getvolumeList">
            <el-radio-button :label="item" :key="item.oeseId" v-for="item in versionList">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>
        <div v-show="chooseType == 'chapter'">
          <p>册别：</p>
          <el-radio-group v-model="volume" size="mini">
            <el-radio-button :label="item" :key="item.oeseId" v-for="item in volumeList">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>

        <slot name="popover">
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chooseType:{
      type:String,
      default:'chapter',
    },
    isReset: {
      type: Boolean,
      default: false
    },
    // questionDetail: {
    //   type: Object
    // },
    learningSectionKey: {
      type: String,
    },
    subjectCode: {
      type: String,
    },
    oeseId: {
      type: String,
    },
    volumeId: {
      type: String,
    }
  },
  components: {},
  data() {
    return {

      learningSection:'',
      subject:'',
      oese:'',
      volume:'',
      subjectEditable:false,
      sectionList:[],
      subjectsList:[],
      versionList:[],
      volumeList:[],
    };
  },

  watch: {
    learningSection(val) {

      val?this.$emit('setparams',val.key, this.volume.oeseId,this.subject.key):null

    },
    volume(val) {
      let volumeId = val?  val.oeseId: ''
      this.$emit('setparams',this.learningSection.key, volumeId,this.subject.key)

    },

    subject(val) {


      val?this.$emit('setparams',this.learningSection.key, this.volume.oeseId,val.key):null

    }


  },
  mounted() {
    this.getlearningSection()
  },
  methods: {
    getlearningSection() {
      

      this.$http.get(`/api/internal/dictionaries/learningSection`)
      .then((data)=>{
        if(data.status == '200') {


          this.sectionList = data.data
          
          if(this.isReset) {
            this.learningSection = this.sectionList.filter(item=>{
              return item.key == this.learningSectionKey
            })[0]
          }else {
            this.learningSection = this.sectionList[0]
          }

          this.getSubject()

          

          } 
        })

    },

    getSubject() {

      this.$http.get(`/api/open/common/subjects?learningSection=${this.learningSection.key}`)
      .then((data)=>{
        if(data.status == '200') {


          this.subjectsList = data.data

          if(this.isReset) {
            this.subject = this.subjectsList.filter(item=>{
              return item.key == this.subjectCode
            })[0]
          }else {
            this.subject = this.subjectsList[0]
          }
          
          // this.getQuestionType()
          this.getVersionList()



          } 
          
        })

    },
    getVersionList() {
      this.versionList = []
      this.volumeList = []

      this.volume = ''
      this.$http.get(`/api/internal/oese/oeses/${this.learningSection.key}/${this.subject.key}`)
      .then((data)=>{
        if(data.status == '200') {
          this.versionList = data.data

          if(this.versionList.length) {

            if(this.isReset) {
              this.oese = this.versionList.filter(item=>{
                return item.oeseId == this.oeseId
              })[0]
            }else {
              this.oese = this.versionList[0]
            }


            if(!this.oese) {
              this.volumeList = []
              this.volume = ''
            }else {
              this.getvolumeList()
            }
          }else {
            this.$emit('clearData')
          }




        }    
      })
    },

    getvolumeList() {
      this.volumeList = []
      this.$http.get(`/api/internal/oese/oeseList/${this.oese.oeseId}`)
      .then((data)=>{
        if(data.status == '200') {
          this.volumeList = data.data
          if(this.volumeList.length) {

            if(this.isReset) {
              this.volume = this.volumeList.filter(item=>{
                return item.oeseId == this.volumeId
              })[0]
            }else {
              this.volume = this.volumeList[0]   
            }
                   
          }else {
            this.$emit('clearData')
          }

          
        }    
      })
    },
  }
};
</script>
<style lang="less">
.top-popover {
  .el-radio-button__inner {
    border: 0px;
    background-color: transparent;
    border-radius: 3px;
    font-size: 14px;
    color: #666;
  }
  .el-input__inner {
    background: #f0f3fa;
  }

  .el-radio-button:first-child .el-radio-button__inner {
    border-left: 0px;
    border-radius: 3px;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 3px;
  }

  .el-radio-button__orig-radio:disabled+.el-radio-button__inner {
    background-color: transparent;
  }

  .el-radio-button__orig-radio:disabled:checked+.el-radio-button__inner {
    background-color: #409eff;
    color: #ffffff;
  }
}
</style>
<style scoped lang="less">
.top-popover {
  .top-div {
    height: 36px;
    position: relative;
    cursor: pointer;
    transition: 5s;
    z-index: 1000;

    &:hover {
      .popover-div {
        display: block;
      }
    }
    .titlep {
      color: #3399ff;
      font-weight: 600;
      line-height: 36px;
      text-align: center;
    }
    .search-class {
      display: flex;
      height: 36px;
      line-height: 36px;
      color: #409EFF;
      justify-content: space-around;
      cursor: pointer;
    }
    .popover-div {
      padding: 20px;
      position: absolute;
      width: 700px;
      z-index: 99;
      background-color: #ffffff;
      transition: 5s;
      border: 1px solid #3399ff;
      //border-left: 0px;
      line-height: 40px;
      display: none;
    }
  }
}
</style>