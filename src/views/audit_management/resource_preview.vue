<template>
  <div class="rescoure-preview">
    <el-backtop target=".right-class .el-scrollbar__wrap" :bottom="80"></el-backtop>
      <div  class="right-class">
        <div class="right-class-wrap el-scrollbar__wrap">
          <div class="right-header" style="display: flex;justify-content: space-between;">
            <span>基础数据 > 资源审核 > 资源详情 </span>
            <el-button type="text" @click="toPageBack" style="margin-right: 20px;">返回</el-button>
          </div>

          <div  class="right-wrap" ref="wrap">

            <div class="right-wrap-top" >
              <table style="width: 100%;" cellpadding="0" cellspacing="0">
                <tr>
                  <th>文件名</th>
                  <th>栏目</th>
                  <th>类型</th>
                  <th>状态</th>
                  <th v-if="resourceInfo.openState!='Privately'">操作</th>
                </tr>
                <tr>
                  <td>{{resourceInfo.name}}</td>
                  <td>{{resourceInfo.resourceName}}</td>
                  <td>{{resourceInfo.resourceName}}</td>
                  <td>{{resourceInfo.applyName}}</td>
                  <td style="width: 220px;" v-if="resourceInfo.openState!='Privately'">
                    <div class="active-wrap">
                      <el-button type="text" @click="deleteResource(resourceInfo)">删除</el-button>

                      <el-button type="text" @click="resourceStateChange(resourceInfo,'Grounding','')" v-if="resourceInfo.applyState=='Undercarriage'||resourceInfo.applyState=='Audit'" >上架</el-button>

                      <el-button type="text" @click="resourceStateChange(resourceInfo,'Undercarriage','')" v-else>下架</el-button>
                      
                      <el-button type="text" @click="resourceStateChange(resourceInfo,'Recommend','on')" v-if="resourceInfo.applyState=='Grounding'" >推荐</el-button>

                      <el-button type="text" @click="resourceStateChange(resourceInfo,'Recommend','cancel')" v-if="resourceInfo.applyState=='Recommend'">取消推荐</el-button>

                      <el-button type="text" @click="resourceStateChange(resourceInfo,'Reject','')" v-if="resourceInfo.applyState=='Audit'">打回</el-button>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <div class="right-wrap-content">


              <div class="right-wrap-content-left">

                <div class="right-wrap-content-left-top"> 
                  <!-- <div class="img-class">
                    <img :src="resourceInfo.surfaceUrl" alt="" style="width: 230px;height: 150px;" v-if="resourceInfo.surfaceUrl">
                    <img src="@/assets/images/default.jpg" alt="" style="width: 230px;height: 150px;" v-else>
                  </div> -->
                  <div class="info-class">
                    <p class="title_p" style="width: 100%;">{{resourceInfo.name}}
                      <i class="iconfont iconbianji iconclass" style="margin-left: 10px;" @click="editDialogShow('name')"></i>
                    </p>

                    <p class="one-piece">权限：{{resourceInfo.openStateName}}</p>
                    <!-- <p>学段：{{resourceInfo.name}}</p> -->
                    <p class="one-piece">年级：{{resourceInfo.gradeName}}
                      <i class="iconfont iconbianji iconclass" style="margin-left: 10px;" @click="editDialogShow('grade')"></i>
                    </p>
                    <p class="one-piece">科目：{{resourceInfo.subjectName}}</p>
                    <p class="one-piece">上传用户：{{resourceInfo.userName}}</p>
                    <p class="one-piece">资源类型：{{resourceInfo.resourceName}}
                      <!-- <i class="iconfont iconbianji iconclass" style="margin-left: 10px;" @click="editDialogShow('type')"></i> -->
                    </p>
                    <p class="one-piece">文件类型：{{resourceInfo.fileTypeName}}</p>
                    <p class="one-piece">上传时间：{{resourceInfo.createTime}}</p>
                    <p class="one-piece"><i class="iconfont iconicontouxiang" style="margin-right: 5px;"></i>{{resourceInfo.preview}}人已学习</p>
                    <p @click="chapterTreeShow" class="cursor" style="width: 100%;">章节：
                      <span class="link-class">{{resourceInfo.chapterNames}}</span>
                      <i class="iconfont iconbianji iconclass" style="margin-left: 10px;" @click="chapterTreeShow"></i> 
                    </p>
                    <p @click="knowledgeTreeShow" class="cursor" style="width: 100%;">知识点：
                      <span class="link-class">{{resourceInfo.knowledgeNames}}</span>
                      <i class="iconfont iconbianji iconclass" style="margin-left: 10px;" @click="knowledgeTreeShow"></i> 
                    </p>
                  </div>
                </div>

                <div class="right-wrap-content-left-content">

                  <!-- 图片预览 -->
                  <div class="container" v-if="previewTab && showPreview === 'picture'">
                    <div class="bottomContent" v-if="showPreview === 'picture'" >
                       <img :src="previewUrl" style="max-width: 100%;max-height: 100%;">
                    </div>    
                  </div>


                 <!-- PDF预览 -->
                  <div class="container" v-if="previewTab && showPreview === 'pdf'">
                     <div class="bottomContent" v-if="showPreview === 'pdf' && previewUrl">
                      <div class="bottomLeft">
                            <pdf-preview 
                              :pdf-url='previewUrl'
                              :pdf-pagenum='totalPages'>
                            </pdf-preview >      
                      </div>
                    </div>    
                  </div>
                

                  <!-- MP4预览 -->
                  <div class="container" v-if="previewTab && showPreview === 'video'">
                    <div class="bottomContent" v-if="showPreview === 'video' && previewUrl">
                      <div class="bottomLeft">
                        <video-player :videoUrl="previewUrl"></video-player>    
                      </div>
                    </div>    
                  </div>

                  <!-- 音频预览 -->
                  <div class="container" v-if="previewTab && showPreview === 'frequency'">
                    <div class="bottomContent" v-if="showPreview === 'frequency' && previewUrl">
                      <div class="bottomLeft">
                          <audio-player :audioUrl="previewUrl" :title="resourceInfo.name" :artist="resourceInfo.userName"></audio-player>
                      </div>
                    </div>    
                  </div>


                </div> 
              </div>

              <!-- <div class="right-wrap-content-right">


                  <div class="container" v-if="previewTab && showPreview === 'picture'">
                    <div class="bottomContent" v-if="showPreview === 'picture'" >
                       <img :src="previewUrl" style="max-width: 100%;max-height: 100%;">
                    </div>    
                  </div>

                  <div class="container" v-if="previewTab && showPreview === 'pdf'">
                     <div class="bottomContent" v-if="showPreview === 'pdf' && previewUrl">
                      <div class="bottomLeft">
                            <pdf-preview 
                              :pdf-url='previewUrl'
                              :pdf-pagenum='totalPages'>
                            </pdf-preview >      
                      </div>
                    </div>    
                  </div>

                  <div class="container" v-if="previewTab && showPreview === 'video'">
                    <div class="bottomContent" v-if="showPreview === 'video' && previewUrl">
                      <div class="bottomLeft">
                            <video-player  class="video-player vjs-custom-skin"
                             ref="videoPlayer"
                             :playsinline="true"
                             :options="playerOptions"
                            ></video-player>    
                      </div>
                    </div>    
                  </div>

                  <div class="container" v-if="previewTab && showPreview === 'frequency'">
                    <div class="bottomContent" v-if="showPreview === 'frequency' && previewUrl">
                      <div class="bottomLeft">
                            <aplayer :music="videoUpload.music"></aplayer>   
                      </div>
                    </div>    
                  </div>

              </div> -->
            </div>  

          </div>

        </div>


      </div>
    <el-drawer
      :visible.sync="treeDialog"
      direction="ltr"
      :with-header="false"
      size='400px'
      custom-class="demo-drawer"
      ref="drawer"
      >
      <div class="demo-drawer-wrap">

        <div class="demo-drawer-wrap-content">
          <top-popover :chooseType="knowType" ref="filter" :isReset="true" @setparams="setparams" :learningSectionKey="resourceInfo.learningSection" :subjectCode="resourceInfo.subjectCode" :oeseId="resourceInfo.oeseId" :volumeId="resourceInfo.oeseBookId" v-if="topReady">
            <div slot="reference" class="search-class">
              <span v-if="$refs.filter">{{$refs.filter.learningSection.value}}</span>
              <span v-if="$refs.filter">{{$refs.filter.subject.value}}</span>
              <span v-if="$refs.filter && $refs.filter.oese&& knowType=='chapter'">{{$refs.filter.oese.name}}</span>
            </div>

          </top-popover>
          <div class="tree-class">

            <div v-if="knowType == 'chapter'">
            <pointTree :tree-data="chapterData" :showCheckbox="true" ref="chapterTree" v-show="knowType=='chapter'"></pointTree>
            </div>
          
            <div v-if="knowType == 'knowledge'">
              <pointTree  :tree-data="knowledgeData" :showCheckbox="true" ref="knowledgeTree" v-show="knowType=='knowledge'"></pointTree>
            </div>
          </div>

        </div>

        <div class="demo-drawer-wrap-footer">
          <el-button @click="treeDialog = false" size="mini">取 消</el-button>
          <el-button type="primary"  size="mini" @click="updateResource('point')">确 定</el-button>
        </div>
      </div>
    </el-drawer>

    <el-dialog
      title="编辑"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="400px">
      <div>
        <el-form size="mini" label-width="100px">
          <el-form-item label="资源名称：" v-if="marking=='name'">
            <el-input v-model="resource.name" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="年级：" v-if="marking=='grade'">
            <el-select v-model="resource.grade" placeholder="请选择" style="width: 180px;">
              <el-option
                v-for="item in gradeList"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源类型：" v-if="marking=='type'">
            <el-select v-model="resource.type" placeholder="请选择" style="width: 180px;">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="updateResource('basic')" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'
  import topPopover from "@/components/Popover/topPopover";

  import pointTree from '@/components/Tree/pointTree'
  import pdfPreview from '@/components/FilePreview/pdfPreview'

  import videoPlayer from '@/components/FilePreview/videoPlayer'
  import audioPlayer from '@/components/FilePreview/audioPlayer'


export default {

  data() {

    return {
      knowType:'chapter',
      dialogVisible: false,
      resourceId: this.$route.query.id,
      resourceInfo:{},
      previewTab: true,
      //预览
      totalPages:1,
      previewUrl:'',
      showPreview :'pdf',
      filter: {

        learningSection:'',
        volumeId:'',
        subjectCode:'',
      },
      currentPoint:'',
      chapterData:[],
      knowledgeData:[],
      chapterTags:[],
      treeDialog: false,
      topReady: false,
      resource: {
        name:'',
        grade:'',
        type:'',
      },
      gradeList:[],
      typeList:[],
      marking:'',
      pointList:[],

    }
  },
  components: {
    rightNav,
    pdfPreview,
    topPopover,
    pointTree,
    videoPlayer,
    audioPlayer
    
  },
  watch: {
    topReady(val) {
      if(val) {
        this.getGradeList()
      }
    }
  },
  computed: {
    
    ...mapGetters([
      'getuserInfo',

    ]),

  },
  mounted() {
    this.getResourceInfo()
    this.getTypeList()
  },
  methods: {
    toPageBack() {
      this.$router.push(`/administrator/resourceManagement`)
    },
    setparams(learningSection,volumeId,subjectCode) {
      this.filter.learningSection = learningSection
      this.filter.volumeId = volumeId
      this.filter.subjectCode = subjectCode

      this.getPonitTree()
       


    },


    editDialogShow(flag) {

      this.marking = flag

      this.resource.name = this.resourceInfo.name
      this.resource.grade = this.resourceInfo.grade
      this.resource.type = this.resourceInfo.resourceType

      this.dialogVisible = true
    },

    getPonitTree() {

      this.chapterData = []

      this.knowledgeData = []


        if(!this.filter.volumeId) { return false }
        this.$http.get(`/api/internal/chapter/chapterTree/${this.filter.volumeId}`)
        .then((data)=>{
          if(data.status == '200') {
            this.chapterData = data.data
            // this.resetPage()
          }    
        })
      
        this.$http.get(`/api/internal/knowledge/knowledgeTree?learningSection=${this.filter.learningSection}&subjectCode=${this.filter.subjectCode}`)
        .then((data)=>{
          if(data.status == '200') {
            this.knowledgeData = data.data
            // this.resetPage()
          }    
        })


    },

    // defaultCheckChapters() {
    //   // let ids = []
    //   // this.resourceInfo.chapterSet.forEach(item=>{
    //   //   ids.push({id:item})
    //   // })
    //   if(this.resourceInfo.chapterList && this.resourceInfo.chapterList.length) {
    //     this.$refs.chapterTree.setNodesByIds(this.resourceInfo.chapterList)
    //   }
      
    // },

    // defaultCheckKnows() {
    //   if(this.resourceInfo.knowledgeList && this.resourceInfo.knowledgeList.length) {
    //     this.$refs.knowledgeTree.setNodesByIds(this.resourceInfo.knowledgeList)
    //   }
      
    // },
    

    getGradeList() {
      if(this.resourceInfo.learningSection) {
        this.$http.get(`/api/open/common/grades?learningSection=${this.resourceInfo.learningSection}`)
        .then((data)=>{
          if (data.status == '200') {
            this.gradeList = data.data
          }
        })
      }
      
    },

    getTypeList() {


      this.$http.get(`/api/open/common/getResourceType`)
      .then((data)=>{
        if (data.status == '200') {
          this.typeList = data.data
        }
      })


    },
    updateResource(flag) {

      let parmas = {}


      if(flag == 'point') {
        parmas.oeseBookId = this.filter.volumeId

        if(this.knowType == 'chapter') {

          let chapterIdList = this.$refs.chapterTree.getCheckedKeys()
          parmas.chapterIdList = chapterIdList
          parmas.knowledgeIdList = this.resourceInfo.knowledgeSet

        }else {
          let knowledgeIdList = this.$refs.knowledgeTree.getCheckedKeys()
          parmas.knowledgeIdList = knowledgeIdList 
          parmas.chapterIdList = this.resourceInfo.chapterSet     
        }


      }else {

        parmas.name = this.resource.name
        parmas.resourceType = this.resource.type
        parmas.grade = this.resource.grade
        parmas.chapterIdList = this.resourceInfo.chapterSet
        parmas.knowledgeIdList = this.resourceInfo.knowledgeSet


      }

      this.$http.put(`/api/internal/resources/update/${this.resourceInfo.resourceId}`, parmas)
      .then(data=>{
        if(data.status == '200') {
          this.$message.success('编辑成功')

          flag == 'point'?this.treeDialog = false:this.dialogVisible = false
          

          this.getResourceInfo()
        }
      })
    },


    updatePoint() {





      console.log(parmas)
      
      
      


    },
    chapterTreeShow() {


      this.knowType = 'chapter'
      this.treeDialog = true
      this.$nextTick(()=>{
        if(this.resourceInfo.chapterList && this.resourceInfo.chapterList.length) {
          this.$refs.chapterTree.setNodesByIds(this.resourceInfo.chapterList)
        }
      })

    },
    knowledgeTreeShow() {

      this.knowType = 'knowledge'
      this.treeDialog = true
      this.$nextTick(()=>{
        if(this.resourceInfo.knowledgeList && this.resourceInfo.knowledgeList.length) {
          this.$refs.knowledgeTree.setNodesByIds(this.resourceInfo.knowledgeList)
        }
      })
    },
    // getCheckedKnows(list) {
    //   this.knowledgeTags = list
    //   this.activeType == "knowledge"?this.tagsList = this.knowledgeTags:null
    // },
    getResourceInfo() {
      this.$http.get(`/api/open/resources/${this.resourceId}`,{})
      .then((data)=>{
        if(data.status == '200') {
          this.resourceInfo = data.data
          let chapterNames = []
          let knowledgeNames = []
          if(this.resourceInfo.chapterList && this.resourceInfo.chapterList.length) {
            this.resourceInfo.chapterList.forEach(list=>{
              chapterNames.push(list.name)
            })
              
          }
          this.resourceInfo.chapterNames = chapterNames.join('；')

          
          if(this.resourceInfo.knowledgeList && this.resourceInfo.knowledgeList.length) {
            this.resourceInfo.knowledgeList.forEach(list=>{
              knowledgeNames.push(list.name)
            })
              
          }
          this.resourceInfo.chapterNames = chapterNames.join('；')
          this.resourceInfo.knowledgeNames = knowledgeNames.join()


          this.totalPages = data.data.filePage ? data.data.filePage : 1
          
          if(!this.topReady) {
            switch(data.data.fileType) {
              case 'PDF':
                this.showPreview = 'pdf';
                this.previewFile(this.resourceInfo.resourceSite.id)
                break;
              case 'PPT':
              case 'WORD':
              case 'EXCEL':
                if (this.resourceInfo.previewFile){
                  this.showPreview = 'pdf';
                  this.previewFile(this.resourceInfo.previewFile.id)
                } else {
                  this.previewTab = false;
                  this.$message.warning('该文件类型暂不支持预览')
                }
                break;
              case 'Picture':
                this.showPreview = 'picture';
                this.previewFile(this.resourceInfo.resourceSite.id)
                break;
              case 'Video':
                this.showPreview = 'video';
                if ( this.resourceInfo.fileSuffix === 'wmv'
                    || this.resourceInfo.fileSuffix === 'mpg'
                    || this.resourceInfo.fileSuffix === 'avi'
                    || this.resourceInfo.fileSuffix === '3gp'
                    || this.resourceInfo.fileSuffix === 'flv'
                    || this.resourceInfo.fileSuffix === 'swf'
                    || this.resourceInfo.fileSuffix === 'rmvb' ){
                  this.previewTab = false;
                  this.$message.warning('该文件类型暂不支持预览')
                } else {
                  this.previewFile(this.resourceInfo.resourceSite.id)
                }
                break;
              case 'Frequency':
                this.showPreview = 'frequency';
                this.previewFile(this.resourceInfo.resourceSite.id)
                // this.videoUpload.music.title = this.resourceInfo.name;
                // this.videoUpload.music.artist = this.resourceInfo.userName;
                
                break;
              default:
                this.previewTab = false;
                this.$message.warning('该文件类型暂不支持预览')
            }
          }

          this.topReady = true   
        }
      })
    },

    previewFile(fileId){
      this.$http.get(`/api/open/common/${fileId}/preview`)
        .then((res)=>{
            if(res.status == '200') {
              this.previewUrl = res.data
              // if (this.showPreview === 'video'){
              //   this.playerOptions.sources[0].src = res.data;
              // } else if (this.showPreview === 'frequency'){
              //   this.videoUpload.music.src = res.data;
              // }   
            }
        })
    },

    downloadFile() {
      this.$http.get(`/api/open/resourceDownload/${this.resourceInfo.resourceId}`,{})
        .then((res)=>{
          if(res.status == '200') {
            window.open(res.data)
          }
        })
    },
    //资源状态更新:上架、下架、拒绝、推荐、取消推荐
    resourceStateChange(row,applyState,recommend) {
      recommend = recommend ? recommend : '';
      if(row) {
          this.$http.put(`/api/internal/resources/status/${row.resourceId}?applyState=${applyState}&recommend=${recommend}`)
            .then((data)=>{
              if(data.status == '200') {
                this.getResourceInfo()
                this.$message({
                    message: "更新成功",
                    type:'success'
                })
              }  
            })
    
      }
    },

    //删除
    deleteResource(row) {
      this.$confirm('确认删除资源吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(row) {
          this.$http.delete(`/api/internal/resources/${row.resourceId}`)
          .then((data)=>{
            if(data.status == '200') {
              this.toPageBack()
              this.$message({
                  message: "删除成功",
                  type:'success'
              })
            }   
          })
    
        }
      })
        
    }, 

    setClass(fileType) {
      let obj = {};
      switch(fileType) {
        case 'PDF':
          obj = {
            iconPDF:true,
            pdficon: true
          }
          break;
        case 'PPT':
          obj = {
            iconppt:true,
            ppticon: true
          }
          break;
        case 'WORD':
          obj = {
            iconword:true,
            wordicon: true
          }
          break;
        default:
          obj = {
            iconword:true,
            wordicon: true
          }
      } 
      return obj;
    }
  }
}
</script>


<style lang="less">

.rescoure-preview {

  .el-drawer {
    overflow: visible;
  }
  .search-wrap {
    .el-radio-group {
      width: 100%;
      text-align: center;
    }
  }

  .active-wrap {

    .el-button {
      padding: 6px 10px;
    }
  }
}

</style>
<style lang="less" scoped>
.rescoure-preview {
  width: 100%;
  display: flex;  
  height: 100%;



  .left-class {
    height: 100%;
    width: 300px;
    flex-shrink: 0;
    margin-right: 20px;
    
    .left-wrap {
      padding-top: 20px;

      .search-class {
        margin-top: 10px;
      }

    }





  }

  .right-class {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;


    .right-class-wrap {
      .right-wrap {
        // margin-top: 20px;

        &-top {
          table {
            border-top: 1px solid #e2e2e2;
            border-left: 1px solid #e2e2e2;

            th, td {
              border-right: 1px solid #e2e2e2;
              border-bottom: 1px solid #e2e2e2;
            }

            th {
              padding: 8px 5px;
              background-color: #f5f7fc;
            }
            td {
              padding: 5px 3px;
              text-align: center;
              background-color: #ffffff;
            }
          }      
        }

        &-content {
          margin-top: 10px;
          background-color: #ffffff;
          // height: calc(100vh - 260px);
          // overflow-y: auto;
          // display: flex;
          padding: 10px;

          &-left {
            // width: 50%;
            margin-right: 20px;
            height: 100%;
            // 
            line-height: 24px;

            &-top {
              width: 90%;
              margin: 0 auto;
              // display: flex;

              .title_p {
                font-size: 1.18rem;
                // text-align: center;
              }

              .img-class {
                width: 230px;
              }

              .info-class {
                margin-left: 20px;
                display: flex;
                flex-wrap: wrap;

                .one-piece {
                  width: 25%;
                }


                .link-class {
                  color: #409EFF;
                }
              }
            }

            &-content {
              // height: calc(100vh - 430px);
              // overflow-y: auto;
              // background-color: red;
              margin-top: 10px;
              padding: 0 20px;


              .container {
                // height: 100%;
                width: 90%;
                margin: 0 auto;
                // background-color: #ffffff;
                // overflow-y: auto;

              }


            }
          }


          &-right {
            margin-left: 20px;
            width: 50%;
            height: 100%;
            
            background-color:#ebeef6;
            padding: 10px;



            .container {
              height: 100%;
              width: 90%;
              margin: 0 auto;
              background-color: #ffffff;
              overflow-y: auto;

            }
          }
        }
      }
    }




      
    

  }



  .fixclass {
    min-height: calc(100vh - 30px);
  }
  .ppticon {
    color: #d24625;
    font-size: 1.3rem;
  }

  .wordicon {
    color: #2a5698;
    font-size: 1.3rem;
  }

  .excelicon {
    color: #0f7b10;
    font-size: 1.3rem;
  }

  .pdficon {
    color: #dc2e1b;
    font-size: 1.3rem;
  }


  .demo-drawer {
    
    

    &-wrap {
      height: 100vh;
      position: relative;
      padding: 20px;

      &-content {
        height: calc(100vh - 100px);
        // background-color: red;
        .tree-class {
          height: calc(100vh - 160px);
          overflow-y: auto;
          margin-top: 10px;
        }
      }


      &-footer {
        // width: 100%;
        // position: absolute;
        margin-top: 20px;
        bottom: 40px;
        text-align: center;
      }
    }


  }

}

</style>
