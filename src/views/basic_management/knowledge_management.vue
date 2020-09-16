<template>
  <div class="knowledge-management">
    <rightNav>
      <div slot="left">
        <p class="right-header">学段学科 </p>
        <div class="meau-wrap" >

			 		<el-radio-group v-model="learningSection" size="small" @change="getSubjectList">
			      <el-radio-button :label="list.key" v-for="list in sectionList">{{list.value}}</el-radio-button>
			    </el-radio-group>

			    <div class="meau-content">
			    	<ul>
			    		<li v-for="list in subjectList" :class="{active: list.key==subjectCode}" @click="changeSubject(list.key)">{{list.value}}</li>
			    	</ul>
			    </div>
        </div>
      </div>

      <div slot="right">
				<p class="right-header">知识点列表 </p>
	      <div class="tree-div">
	        <pointTree :tree-data="treeData" @editnode="editNode" @appendnode="appendNode" @deletenode="deleteNode" :enableEdit="true" :orgSelectable="true" :defaultRoot="true"></pointTree>
	        
	      </div>

 




      </div>
    </rightNav>


    <el-dialog
		  :visible.sync="dialogVisible"
		  :title="dialogTitle"
      :close-on-click-modal='false'
		  width="500px">
		  <div>
		  	<div class="input-wrap"><p class="label-class"><span class="require-class">*</span>知识点名称：</p>
		  		<el-input v-model="knowPoint.name" placeholder="请输入章节名称" class="input-class" size="small"></el-input>
		  	</div>
		  	<div class="input-wrap"><p class="label-class">知识点描述：</p>
		  		<el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入章节描述"
            class="input-class"
            v-model="knowPoint.description">
          </el-input>
		  	</div>
		  </div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
		    <el-button type="primary" @click="addknowPoint" size="mini">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'
	import pointTree from '@/components/Tree/pointTree'
export default {

  data() {
    return {
    	sectionList:[],
    	learningSection:'',
    	treeData:[],
    	subjectList:[],
    	subjectCode:'',
    	treeData: [],
    	dialogVisible:false,
    	knowPoint: {
    		name: '',
    		description:''
    	},
    	selectId:'',
    	dialogTitle:'',


    }
  },
  components: {
    rightNav,
    pointTree
    
  },
  watch: {

  },
  computed: {
    


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
  				this.getTableData()

  			}
  		})
  	},

  	getTableData() {
  		this.$http.get(`/api/internal/knowledge/knowledgeTree?learningSection=${this.learningSection}&subjectCode=${this.subjectCode}`)
  		.then((data)=>{
  			if(data.status == '200') {

  				this.treeData = data.data
  			

  			}
  		})
  	},

    editNode(node,data) {
			this.dialogTitle = '编辑知识点'
			this.knowPoint.name = data.name
			this.knowPoint.description = data.description
 
  		this.selectId = data.resourceId.id
  		this.dialogVisible = true
    },

    appendNode(node,data) {
			this.dialogTitle = '新增知识点'
			this.knowPoint.name = ''
			this.knowPoint.description = ''
 
  		this.selectId = data.resourceId.id
  		this.dialogVisible = true
    },
    addknowPoint() {

  		if(!this.knowPoint.name) {
  			return this.$message.warning('版本名称不可以为空！')
  		}
  		if(this.dialogTitle == '编辑知识点') {
  			this.$http.put(`/api/internal/knowledge/${this.selectId}`,{
  				name: this.knowPoint.name,
  				description: this.knowPoint.description
  			})
  			.then(data=>{
  				if(data.status == '200') {
  					this.dialogVisible = false
  					this.$message.success('编辑成功')
  					this.getTableData()
  				}
  			})
  		}else {
  			this.$http.post(`/api/internal/knowledge/${this.selectId}/knowledges`,{
  				name: this.knowPoint.name,
  				description: this.knowPoint.description
  			})
  			.then(data=>{
  				if(data.status == '200') {
  					this.dialogVisible = false
  					this.$message.success('新增成功')
  					this.getTableData()
  				}
  			})
  		}
    },
    deleteNode(node,data) {
      this.$confirm('确认删除该知识点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
  			this.$http.delete(`/api/internal/knowledge/${data.resourceId.id}`)
	      .then((data)=>{
	        if(data.status == '200') {
	
		        this.$message({
	            message:'删除成功',
	            type:'success'
	          })
	        	this.getTableData()
	        	// this.treeData = data.data


	          } 
	        })

	    })
      
    },

  	changeSubject(key) {
  		this.subjectCode = key
  		this.getTableData()
  	},













  


  }
}
</script>
<style lang="less">
.knowledge-management {

	.el-radio-group {
		width: 100%;
		text-align: center;
	}

}

</style>
<style lang="less" scoped>
.knowledge-management{
  height: 100%;

  .input-class {
    width: 280px;
  }

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
		.tree-div {
			width: 500px;
	    height: calc(100vh - 200px);
	    overflow-y: auto;
	  }
  .input-class {
    width: 240px;
  }
}
</style>
