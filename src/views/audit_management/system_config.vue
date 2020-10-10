<template>
  <div class="system">
    <rightNav>
      <div slot="left" class="right-one-part">
        <p class="right-header">系统配置 </p>
        <div class="meau-wrap">
          <ul>
            <li v-for="list in meauList" :class="{activemeau:list.check}" @click="changeType(list)">{{list.label}}</li>
          </ul>
        </div>
      </div>

      <div slot="right">
        <p class="right-header">{{title}} </p>

        <div v-show="title=='自动审核设置'">
        
          <el-radio-group v-model="automaticCheck" @change="setVerifyConfiguration">
            <el-radio-button label="1" >是</el-radio-button>
            <el-radio-button label="0" >否</el-radio-button>

          </el-radio-group>
        </div> 
        <div class="wrap" v-show="title=='题目难度设置'">

				  <el-table
				    :data="difficultyList"
				    border
            height="100%"
				    style="width: 100%">
				    <el-table-column
				      type="index"
				      width="100px"
				      label="序号">
				    </el-table-column>
				    <el-table-column
				      prop="value"
				      label="难度">
				    </el-table-column>
				    <el-table-column
				      prop="description"
				      label="难度比例">
				    </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                  <i class="iconfont iconbianji icon-active" @click="editDifficulty(scope.row)"></i>

              </template>
            </el-table-column>
				  </el-table>
        </div>

        <div class="wrap" v-show="title=='学科封面设置'">

          <el-table :data="subjectCoverList" border style="width: 100%" height="100%">
            <el-table-column type="index" width="100px" label="序号">
            </el-table-column>
            <el-table-column prop="subjectName" label="学科">
            </el-table-column>
            <el-table-column prop="coverFileId.id" label="封面">
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                  <i class="iconfont iconbianji icon-active" @click="editSubjectCover(scope.row)"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-dialog
          title="编辑难度"
          :visible.sync="dialogVisible"
          width="500px">
          <div class="class-wrap">
            <el-form :model="difficulty" size="small" label-width="100px">

              <el-form-item label="难度" prop="value">
                <el-input v-model="difficulty.value"  class="input-class" placeholder="请输入" disabled></el-input>
              </el-form-item>
              <el-form-item label="比例" prop="description">
                <el-input v-model.number="difficulty.description"  class="input-class" placeholder="请输入" autocomplete="off"></el-input>
              </el-form-item>

            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="setDifficultyConfig" size="mini">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="编辑封面" :visible.sync="dialogCoverVisible" width="500px">
          <div class="class-wrap">
            <el-form :model="subjectCover" size="small" label-width="100px">
              <el-form-item label="学科" prop="subjectName">
                <el-input v-model="subjectCover.subjectName" class="input-class" disabled></el-input>
              </el-form-item>
              <el-form-item label="学科封面：">
                <div class="logo-div">
                  <div class="logo-div-left">
                    <img :src="subjectCover.previewUrl" alt="" width="230px" height="150px">
                    <div>
                      <el-button size="mini" type="primary" style="position: relative;">上传
                        <input style="left:0px" type="file" class="inpucus cursor" @change="tirggerFile($event)" />
                      </el-button>
                      <el-button size="mini" type="primary" @click="deleteFile()">删除</el-button>
                    </div>
                    
                  </div>
                  <div class="logo-div-right">请上传jpg,gif,png格式的图片。封面图片尺寸建议不超过230 x 150px。图片大小建议不超过1MB</div>  
                </div>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogCoverVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="updateSubjectCover" size="mini">确 定</el-button>
          </span>
        </el-dialog>

      </div>
    </rightNav>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'
  import basicTree from '@/components/Tree/basicTree'
  import { initFileUpload, completeFileUpload} from '@/utils/file.service.js'
  import { uploadFilesBySteaps } from '@/utils/upload.js'

export default {

  data() {
    return {
      automaticCheck:'',
      difficultyList: [],
      dialogVisible: false,
      difficulty: {
      	key: '',
      	value:'',
      	description:''
      },
      meauList: [{
          label:'自动审核设置',
          check: true
        },{
          label:'题目难度设置',
          check: false
        },{
          label:'学科封面设置',
          check: false
        } 
      ],
      title:'自动审核设置',
      subjectCoverList:[],
      dialogCoverVisible: false,
      subjectCover:{
        coverFileId:"",
        previewUrl:""
      }

    }
  },
  components: {
    rightNav,
    basicTree
    
  },
  watch: {

  },
  computed: {
    
    ...mapGetters([
      'getlearningSection',

    ]),

  },
  mounted() {

    this.getVerifyConfiguration()
    this.getDifficultyConfig()
    this.getSubjectCoverList()

  },
  methods: {
    changeType(list) {
      this.meauList.forEach(item=>{
        item.check = false
      })

      list.check = true
      this.title = list.label
    },

  	getVerifyConfiguration() {

		  this.$http.get(`/api/internal/configuration/configs/VerifyConfiguration`)
        .then((data)=>{
          if(data.status == '200') {
          	this.automaticCheck = data.data.configItems[0].value
          }  
        })

  	},

  	setVerifyConfiguration() {

  		let data = []
  		data.push({key:"auto", value:this.automaticCheck})

		  this.$http.put(`/api/internal/configuration/configs/VerifyConfiguration`,data)
        .then((data)=>{
          if(data.status == '200') {

        		this.getVerifyConfiguration()

		        this.$message({
	            message:'自动审核修改成功',
	            type:'success'
	          })
          } 
          
        })

  	},


  	getDifficultyConfig() {

  		this.difficultyList = []

		  this.$http.get(`/api/internal/configuration/configs/DifficultyConfiguration`)
        .then((data)=>{
          if(data.status == '200') {
        	 this.difficultyList = data.data.configItems
          } 
        })

  	},

  	editDifficulty(row) {

  		this.difficulty.key = row.key
  		this.difficulty.value = row.value
  		this.difficulty.description = row.description
  		this.dialogVisible = true

  	},

  	setDifficultyConfig() {
  		if(!this.difficulty.description) {
        return this.$message({
          message: '题目难度不可以为空',
          type:'warning'
        })
  		}
  		if(typeof this.difficulty.description != "number") {
        return this.$message({
          message: '题目难度必须为数字',
          type:'warning'
        })
  		}

  		let data = []

  		data.push({key: this.difficulty.key,
  			value: this.difficulty.value,
  			description: this.difficulty.description
  		})

		  this.$http.put(`/api/internal/configuration/configs/DifficultyConfiguration`,data)
      .then((data)=>{
        if(data.status == '200') {

        		this.dialogVisible = false
		        this.$message({
	            message:'修改成功',
	            type:'success'
	          })

	          this.getDifficultyConfig()
          } 
          
        })
      
  	},

    //获取学科封面列表
    getSubjectCoverList() {

      this.subjectCoverList = []

      this.$http.get(`/api/internal/subjectCover`)
        .then((data)=>{
          if(data.status == '200') {
           this.subjectCoverList = data.data
          } 
        })
    },

    editSubjectCover(row) {

      this.subjectCover.coverId = row.coverId
      this.subjectCover.subjectName = row.subjectName
      this.subjectCover.previewUrl = ""
      this.dialogCoverVisible = true

      this.$http.get(`/api/internal/subjectCover/${row.coverId.id}`)
        .then((data)=>{
          if(data.status == '200') {
            this.subjectCover.previewUrl = data.data.previewUrl
          } 
        })
    },

    deleteFile() {
      this.subjectCover.previewUrl = "";
    },

    updateSubjectCover(){
      this.$http.put(`/api/internal/subjectCover/${this.subjectCover.coverId.id}`,{},{
        coverFileId:this.subjectCover.coverFileId
      })
      .then((data)=>{
        if(data.status == '200') {
            this.dialogCoverVisible = false
            this.$message({
              message:'修改成功',
              type:'success'
            })

            this.getSubjectCoverList();
        } 
      })
    },

    /**
     * 拦截上传，手动实现上传文件
     */
    tirggerFile (event) {
        let that = this
        var filePath = event.target.value
        let file = event.target.files[0]

        let fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase()
        if (!fileFormat.match(/(.png|.jpg|.jpeg)$/)) {
          event.target.value=""
            return this.$message({
              message:"格式必须为：.png/.jpg/.jpeg",
              type:"warning"
            })

        }
        let size = file.size;
        if (size > 1048576) {
          event.target.value=""
          return this.$message({
            message:"上传文件不能超过1M",
            type:"warning"
          })
        }
        
        initFileUpload({
          md5: "",
          multipartUpload: false, 
          name: file.name,
          size: file.size
        }).then((res)=>{
         
          uploadFilesBySteaps({
            file: file,
            uploadUrl:res.data.uploadUrl, 
            limitSize: 50 * 1024 * 1024,
            callBack: ()=>{},
            errBack: ()=>{},
            httpConfig: {clsoeMessage: true}
          }).then((uploadResponse)=>{
            this.confirmUpload(uploadResponse[0].id);
          }).catch((uploadError)=>{
            this.$message({message:'网络状况不佳，请删除并重新上传',type:'error'});
          })
        }).catch((initErr)=>{})
        return false;
      },

      /**
       * 平台确认上传完成
       */
      confirmUpload(id) {
        // 平台确认
        completeFileUpload(id).then((completeResponse)=>{
            this.subjectCover.coverFileId = id;
            this.subjectCover.previewUrl = completeResponse.data;
        }).catch((completeErr)=>{
          this.$message({message:completeErr || '上传失败',type:'warning'});          
        })
      },

  }
}
</script>
<style lang="less">
.system {

	.el-radio-group {
		width: 400px;
	}

	.el-radio-button {
		width: 100%;
		position: relative;
    height: 40px;
    margin-bottom: 16px;
    border-radius: 4px;
    border: 1px solid #d8dbe4;
    overflow: hidden;
    cursor: pointer;
	}
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  	color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
  }
	.el-radio-button__inner {
		width: 100%;
		height: 100%;
    // height: 42px;
    text-align: left;
    // font-size: 14px;
    background: #f6f7fa;
    overflow: hidden;
    // cursor: pointer;
	}
}

</style>
<style lang="less" scoped>
 .system{
  height: 100%;

  .input-class {
    width: 280px;
  }

  .meau-wrap {
    height: calc(100vh - 240px);
    overflow-y: auto;
    padding-left: 20px;

    .activemeau {
      color:#409EFF;
    }

    ul li {
      height: 40px;
      cursor: pointer;

      &:hover {
        color:#409EFF;
      }
    }
  }
  .wrap {
    height: calc(100vh - 200px);
    // background-color: red;
  	ul {
  		li {
  			line-height: 32px;
  			height: 32px;
  			display: flex;
  		}
  	}

    .logo-div {
      display: flex;
      align-items: center;

      &-left {
        width: 160px;
        flex-shrink: 0
      }

      &-right {
        margin-left: 20px;
        color: #b9c1d2;
      }
    }


  }
}
</style>
