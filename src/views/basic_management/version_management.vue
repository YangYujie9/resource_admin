<template>
  <div class="version">
    <!-- <transition-group name="draw">    -->
    <div class="right-one contener">
		
      <p class="right-header">学段学科 </p>
      <div class="meau-wrap">

		 		<el-radio-group v-model="learningSection" size="small" @change="getSubjectList">
		      <el-radio-button :label="list.key" v-for="list in sectionList">{{list.value}}</el-radio-button>
		    </el-radio-group>

		    <div class="meau-content">
		    	<ul>
		    		<li v-for="list in subjectList" :class="{active: list.key==subjectCode}" @click="changeSubject(list.key)">{{list.value}}</li>
		    	</ul>
		    </div>
      </div>

<!-- 		    <ul>
		    	<li v-for="list in sectionList" :key="list.key" :class="{active:list.check}">{{list.value}}</li>
		    </ul> -->
		</div>






		<div class="right-two contener">
			<p class="right-header">教材版本 </p>
      <div class="tree-div">
        <pointTree :tree-data="versionList" :defaultRoot="false" @editnode="editVersion" @appendnode="appendVersion" @deletenode="deleteVersion" :enableEdit="true" :defaultLevel="3"  @handleNodeClick="handleVersionClick" @selectnode="defaultSelectVersion"></pointTree>
      </div>
		</div>



		<div class="right-three contener">
			<p class="right-header">章节列表 </p>
      <div class="tree-div">
        <pointTree :tree-data="treeData" @editnode="editNode" @appendnode="appendNode" @deletenode="deleteNode" :enableEdit="true" :orgSelectable="true" :defaultRoot="true"></pointTree>
      </div>
		</div>

    <el-dialog
		  :visible.sync="dialogversionVisible"
		  :title="dialogversionTitle"
      :close-on-click-modal='false'
		  width="500px">
		  <div>
		  	<div class="input-wrap"><p class="label-class"><span class="require-class">*</span>{{dialogName}}：</p>
		  		<el-input v-model="version.name" placeholder="请输入版本名称" class="input-class" size="small"></el-input>
		  	</div>
		  	<div class="input-wrap"><p class="label-class">{{dialogdescription}}：</p>
		  		<el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入教材版本描述"
            class="input-class"
            v-model="version.description">
          </el-input>
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogversionVisible = false" size="mini">取 消</el-button>
		    <el-button type="primary" @click="addVersion" size="mini">确 定</el-button>
		  </span>
		</el-dialog>


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
		    <el-button type="primary" @click="addchapter" size="mini">确 定</el-button>
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
      dialogName:'',
      dialogdescription:'',
    	sectionList:[],
    	learningSection:'',
    	subjectList:[],
    	subjectCode:'',
    	versionList: [],
    	dialogversionVisible:false,
    	dialogversionTitle:'',
    	version: {
    		name: '',
    		description:''
    	},
    	selectVersionId:'',
    	isEdit: false,
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

  	getlearningSection() {

      this.$http.get(`/api/internal/dictionaries/learningSection`)
      .then((data)=>{
        if(data.status == '200') {


        	this.sectionList = data.data
        	this.learningSection = 	this.sectionList[0].key
        	this.getSubjectList()

          } 
          
        })

  	},

  	getSubjectList() {
  		this.$http.get(`/api/open/common/subjects?learningSection=${this.learningSection}`)
  		.then((data)=>{
  			if(data.status == '200') {

  				this.subjectList = data.data
  				this.subjectCode = this.subjectList[0].key
  				this.getVersionTree()

  			}
  		})
  	},

    changeSubject(key) {
      this.subjectCode = key
      this.getVersionTree()
    },


  	getVersionTree() {
  		// this.$http.get(`/api/open/common/oeses/${this.learningSection}/${this.subjectCode}`)
  		this.$http.get(`/api/internal/oese/oeseTree?learningSection=${this.learningSection}&subjectCode=${this.subjectCode}`)
  		.then((data)=>{
  			if(data.status == '200') {
  				this.versionList = data.data
  			}
  		})
  	},
  	addVersion() {
  		if(!this.version.name) {
  			return this.$message.warning('版本名称不可以为空！')
  		}
  		if(this.isEdit) {
  			this.$http.put(`/api/internal/oese/${this.selectVersionId}`,{
  				name: this.version.name,
  				description: this.version.description
  			})
  			.then(data=>{
  				if(data.status == '200') {
  					this.dialogversionVisible = false
  					this.$message.success('编辑成功')
  					this.getVersionTree()
  				}
  			})
  		}else {
  			this.$http.post(`/api/internal/oese/${this.selectVersionId}/oeses`,{
  				name: this.version.name,
  				description: this.version.description
  			})
  			.then(data=>{
  				if(data.status == '200') {
  					this.dialogversionVisible = false
  					this.$message.success('新增成功')
  					this.getVersionTree()
  				}
  			})
  		}
  	},
    editVersion(node,data) {

			this.dialogversionTitle = data.memberType == 'Oese'?'编辑版本':'编辑册别'
      this.dialogName = data.memberType == 'Oese'?'版本名称':'册别名称'
      this.dialogdescription = data.memberType == 'Oese'?'版本描述':'册别描述'
			this.version.name = data.name
			this.version.description = data.description
      this.isEdit = true
  		this.selectVersionId = data.resourceId.id
  		this.dialogversionVisible = true
    },

    appendVersion(node,data) {
			this.dialogversionTitle = data.parentId.id == '0'?'新增版本':'新增册别'
      this.dialogName = data.parentId.id == '0'?'版本名称':'册别名称'
      this.dialogdescription = data.parentId.id == '0'?'版本描述':'册别描述'
			this.version.name = ''
			this.version.description = ''
      this.isEdit = false
  		this.selectVersionId = data.resourceId.id
  		this.dialogversionVisible = true
    },

    deleteVersion(node,data) {
      this.$confirm('确认删除该教材版本?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
  			this.$http.delete(`/api/internal/oese/${data.resourceId.id}`)
	      .then((data)=>{
	        if(data.status == '200') {
	
		        this.$message({
	            message:'删除成功',
	            type:'success'
	          })
	        	this.getVersionTree()
	        	// this.treeData = data.data


	          } 
	        })

	    })
      
    },
    defaultSelectVersion(node){
      if(node.memberType == 'Volume') {
        this.currentNode = node
        this.getChapterTree()
      }else {
        this.treeData = []
      }

    },
    handleVersionClick(data) {

    	 this.currentNode = data
    	 this.getChapterTree()


    },



    editNode(node,data) {
      this.showDialog(data,true)
    },

    appendNode(node,data) {
      this.showDialog(data, false)
    },

    deleteNode(node,data) {
      this.deletechapter(data)
    },





  	getSubject() {

      this.$http.get(`/api/open/common/subjects?learningSection=${this.learningSection}`)
      .then((data)=>{
        if(data.status == '200') {


        	this.subjectsList = data.data
        	this.subjectId = this.subjectsList[0].key

        	this.getChapterTree()


          } 
          
        })

  	},

  	getChapterTree() {
  		this.treeData = []

      this.$http.get(`/api/internal/chapter/chapterTree/${this.currentNode.resourceId.id}`)
      .then((data)=>{
        if(data.status == '200') {

        	this.treeData = data.data


          } 
          
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


  	addchapter() {

  		if(!this.chapter.name) {
  			return this.$message.warning('章节名称不可以为空！')
  		}
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
	        	this.getChapterTree()
	        	// this.treeData = data.data


	          } 
	          
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
	        	this.getChapterTree()
	        	// this.treeData = data.data


	          } 
	          
	        })

  		}

  	},


  	deletechapter(data) {
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
	        	this.getChapterTree()
	        	// this.treeData = data.data


	          } 
	        })

	    })
  	}











  }
}
</script>
<style lang="less">

.version {
		.el-radio-group {
		width: 100%;
		text-align: center;
	}
}

</style>
<style lang="less" scoped>
.version{

	height: 100%;
	display: flex;

	.right-one {
		width: 300px;
		flex-shrink: 0;
		margin-right: 20px;
		padding: 0 20px;
		animation: foldSider .2s ease-in-out;
		transition: 5s;

  .meau-wrap {
    height: calc(100vh - 240px);
    


    .meau-content {
    	height: calc(100% - 20px);
    	overflow-y: auto;
    	margin-top: 20px;
    	padding-left: 60px;
    	


    	ul{
    		li {
    			height: 40px;
    			line-height: 40px;
    			cursor: pointer;
    		}

    		.active {
    			color: #409EFF;
    		}
    	}
    }


  }



	}


	.hide-wrap {
		width: 52px;
		line-height: 32px;
		animation: foldSider .2s ease-in-out;

	}

	.right-two {
		// width: calc(100vw - 300px);
		width: 40%;
		padding: 0 20px;
		overflow-x: hidden;
		position: relative;
		margin-right: 20px;

		.tree-div {
	    height: calc(100vh - 200px);
	    overflow-y: auto;
	  }
	}
	.right-three {
		// width: calc(100vw - 300px);
		width: 60%;
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

  // .left-content {

		// ul {
		// 	margin-top: 20px;
		// 	padding-left: 60px;
		// 	li {
		// 		height: 36px;
		// 		line-height: 36px;
		// 		font-size: 0.9em;
		// 		&:hover {
		// 			cursor: pointer;
		// 			color: #409eff;
		// 		}
		// 	}

		// 	.active {
		// 		color: #409eff;
		// 	}
		// }
  // }




 }
</style>
