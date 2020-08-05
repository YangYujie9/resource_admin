<template>
  <div class="know-point">

		<div class="right-one contener" v-show="sectionShow">
		
			<p class="right-header">学段列表 <i class="iconfont iconxiangzuo1 showicon" @click="sectionShow=false"></i></p>
			<div class="list-wrap">
	  	  <el-radio-group v-model="learningSection" @change="getGrades">
		      <el-radio-button v-for="list in sectionList" :label="list.key" :key="list.key">{{list.value}}</el-radio-button>

		    </el-radio-group>
	    </div>

<!-- 		    <ul>
		    	<li v-for="list in sectionList" :key="list.key" :class="{active:list.check}">{{list.value}}</li>
		    </ul> -->
		</div>

		<div v-show="!sectionShow" class="right-one contener hide-wrap">
			<p style="padding-top: 16px;"><i class="iconfont iconxiangyou2" @click="sectionShow=true" style="cursor: pointer;"></i>学段列表 </p> 
		</div>



		<div class="right-one contener"  v-show="gradeShow">

				<p class="right-header">年级列表 <i class="iconfont iconxiangzuo1 showicon" @click="gradeShow=false"></i></p>
				<div class="list-wrap">
					<el-radio-group v-model="gradeId" @change="getchapterTree">
			      <el-radio-button v-for="list in gradesList" :label="list.key" :key="list.key">{{list.value}}</el-radio-button>

			    </el-radio-group>
			  </div>
	
		</div>

		<div v-show="!gradeShow" class="right-one contener hide-wrap">
			<p style="padding-top: 16px;"><i class="iconfont iconxiangyou2" @click="gradeShow=true" style="cursor: pointer;"></i>年级列表 </p> 
		</div>



		<div class="right-one contener" v-show="subjectShow"> 

				<p class="right-header">学科列表 <i class="iconfont iconxiangzuo1 showicon" @click="subjectShow=false"></i></p>
				<div class="list-wrap">
					<el-radio-group v-model="subjectId" @change="getchapterTree">
			      <el-radio-button v-for="list in subjectsList" :label="list" :key="list"></el-radio-button>

			    </el-radio-group>
		  	</div>

		</div>

		<div v-show="!subjectShow" class="right-one contener hide-wrap">
			<p style="padding-top: 16px;"><i class="iconfont iconxiangyou2" @click="subjectShow=true" style="cursor: pointer;"></i>学科列表 </p> 
		</div>



		<div class="right-two contener">
			<p class="right-header">章节列表 </p>
      <div class="tree-div">
        <pointTree :tree-data="treeData" @editnode="editNode" @appendnode="appendNode" @deletenode="deleteNode" :enableEdit="true" :showCheckbox="false"></pointTree>
      </div>
		</div>


    <el-dialog
		  :visible.sync="dialogVisible"
		  :title="dialogTitle"
      :close-on-click-modal='false'
		  width="500px">
		  <div>
		  	<div class="input-wrap"><p class="label-class"><span class="require-class">*</span>章节名称：</p>
		  		<el-input v-model="chapter.name" placeholder="请输入章节名称" class="input-class" size="small"></el-input>
		  	</div>
		  	<div class="input-wrap"><p class="label-class">章节描述：</p>
		  		<el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入章节描述"
            class="input-class"
            v-model="chapter.description">
          </el-input>
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
		    <el-button type="primary" @click="addChapter" size="mini">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import pointTree from '@/components/Tree/pointTree'

export default {

  data() {

    return {

    	sectionList:[],
    	learningSection:'',
    	gradesList:[],
    	gradeId:'',
    	subjectsList:[],
    	subjectId:'',
    	treeData: [],
    	dialogVisible:false,
    	chapter: {
    		name: '',
    		description:''
    	},
    	selectId:'',
    	dialogTitle:'',
    	sectionShow: true,
    	gradeShow: true,
    	subjectShow: true,










    }
  },
  components: {
    pointTree
    
  },
  watch: {

  },
  computed: {
    
    ...mapGetters([
      'getuserInfo',

    ]),

  },
  mounted() {
	  // this.$nextTick(()=>{
   //    this.table_height = this.$refs.content_wrap.offsetHeight * 0.45 - 40
   //  })

	  this.getlearningSection()





  },
  methods: {
    editNode(node,data) {
      this.showDialog(data,true)
    },

    appendNode(node,data) {
      this.showDialog(data, false)
    },

    deleteNode(node,data) {
      this.deleteChapter(data)
    },

    defaultSelectNode(node){
      // console.log(node)
      this.currentNode = node
      // this.getTableData()
    },
    handleNodeClick(data) {

      this.currentNode = data
      // this.getTableData()
    },

  	getlearningSection() {

      this.$http.get(`/api/internal/dictionaries/learningSection`)
      .then((data)=>{
        if(data.status == '200') {


        	this.sectionList = data.data
        	this.learningSection = 	this.sectionList[0].key
        	this.getGrades()
        	

          } else {
            return this.$message({
              message: data.msg,
              type:'error'
            })
          }
          
        })
      .catch(()=>{
        return this.$message({
          message:'接口报错',
          type:'error'
        })
      })
  	},


  	getGrades() {


      this.$http.get(`/api/open/common/grades?learningSection=${this.learningSection}`)
      .then((data)=>{
        if(data.status == '200') {

        	this.gradesList = data.data
        	this.gradeId = this.gradesList[0].key
        	this.getSubject()


          } else {
            return this.$message({
              message: data.msg,
              type:'error'
            })
          }
          
        })
      .catch(()=>{
        return this.$message({
          message:'接口报错',
          type:'error'
        })
      })
  	},

  	getSubject() {

      this.$http.get(`/api/open/common/subjects?learningSection=${this.learningSection}`)
      .then((data)=>{
        if(data.status == '200') {


        	this.subjectsList = data.data
        	this.subjectId = this.subjectsList[0]

        	this.getchapterTree()


          } else {
            return this.$message({
              message: data.msg,
              type:'error'
            })
          }
          
        })
      .catch(()=>{
        return this.$message({
          message:'接口报错',
          type:'error'
        })
      })
  	},

  	getchapterTree() {


      this.$http.get(`/api/internal/chapter/chapterTree?subjectName=${this.subjectId}&grade=${this.gradeId}`)
      .then((data)=>{
        if(data.status == '200') {

        	this.treeData = data.data


          } else {
            return this.$message({
              message: data.msg,
              type:'error'
            })
          }
          
        })
      .catch(()=>{
        return this.$message({
          message:'接口报错',
          type:'error'
        })
      })
  	},

  	showDialog(data,flag) {

  		if(flag) {
  			this.dialogTitle = '编辑章节'
  			this.chapter.name = data.name
  			this.chapter.description = data.description
  		}else {
  			this.dialogTitle = '新增章节'
  			this.chapter.name = ''
  			this.chapter.description = ''
  		}
  		this.selectId = data.resourceId.id
  		this.dialogVisible = true
  	},


  	addChapter() {

  		if(this.dialogTitle == '新增章节') {
	  		this.$http.post(`/api/internal/chapter/${this.selectId}/chapters`,{
	      	name: this.chapter.name,
	      	description: this.chapter.description
	      })
	      .then((data)=>{
	        if(data.status == '200') {
	        	this.dialogVisible = false
	        	this.dialogTitle = ''
		        this.$message({
	            message:'新增成功',
	            type:'success'
	          })
	        	this.getchapterTree()
	        	// this.treeData = data.data


	          } else {
	            return this.$message({
	              message: data.msg,
	              type:'error'
	            })
	          }
	          
	        })
	      .catch(()=>{
	        return this.$message({
	          message:'接口报错',
	          type:'error'
	        })
	      })
  		}else {
	  		this.$http.put(`/api/internal/chapter/${this.selectId}`,{
	      	name: this.chapter.name,
	      	description: this.chapter.description
	      })
	      .then((data)=>{
	        if(data.status == '200') {
	        	this.dialogVisible = false
	        	this.dialogTitle = ''
		        this.$message({
	            message:'编辑成功',
	            type:'success'
	          })
	        	this.getchapterTree()
	        	// this.treeData = data.data


	          } else {
	            return this.$message({
	              message: data.msg,
	              type:'error'
	            })
	          }
	          
	        })
	      .catch(()=>{
	        return this.$message({
	          message:'接口报错',
	          type:'error'
	        })
	      })
  		}

  	},


  	deleteChapter(data) {
      this.$confirm('确认删除该章节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
  			this.$http.delete(`/api/internal/chapter/${data.resourceId.id}`)
	      .then((data)=>{
	        if(data.status == '200') {
	
		        this.$message({
	            message:'删除成功',
	            type:'success'
	          })
	        	this.getchapterTree()
	        	// this.treeData = data.data


	          } else {
	            return this.$message({
	              message: data.msg,
	              type:'error'
	            })
	          }
	          
	        })
	      .catch(()=>{
	        return this.$message({
	          message:'接口报错',
	          type:'error'
	        })
	      })
	    })
  	}











  }
}
</script>
<style lang="less">

.know-point {
	.el-radio-group {
		width: 100%;
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
.know-point{

	height: 100%;
	display: flex;

	.right-one {
		width: 300px;
		flex-shrink: 0;
		margin-right: 20px;
		padding: 0 20px;
		animation: foldSider .2s ease-in-out;
		transition: 5s;

		.showicon {
			position: absolute;
			right: 10px;
			cursor: pointer;
		}

		.hideicon {
			position: absolute;
		}

		.list-wrap {
			height: calc(100vh - 200px);
			overflow-y: auto;
			padding-right:7px;
			// background:red;
		}


	}


	.hide-wrap {
		width: 52px;
		line-height: 32px;
		animation: foldSider .2s ease-in-out;
		// transition: opacity .5s;
		transition: 5s;
	}

	.right-two {
		// width: calc(100vw - 300px);
		width: 100%;
		padding: 0 20px;
		overflow-x: hidden;
		position: relative;

		.tree-div {
	    height: calc(100vh - 200px);
	    overflow-y: auto;

	  }
	}

  .input-class {
    width: 280px;
  }

  .search-class {
    width: 160px;
  }




 }
</style>
