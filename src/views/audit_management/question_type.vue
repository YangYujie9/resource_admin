<template>
  <div class="question-type">
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
        <p class="right-header">题目类型 
	        <el-button size="mini" style="margin-left: 20px;" @click="addTypeShow"><i class="el-icon-plus"></i> 添加</el-button>
	      </p>

 
        <div class="wrap" ref="wrap">

				  <el-table
				    :data="tableData"
				    :height="table_height"
				    border
				    style="width: 100%">
				    <el-table-column
              type="selection">
            </el-table-column>
             <el-table-column
              prop="code"
              label="题型标示">
            </el-table-column>
				    <el-table-column
				      prop="name"
				      label="题型名称">
				    </el-table-column>
            <el-table-column
              prop="template.name"
              label="类别">
            </el-table-column>
            <el-table-column
              prop="code"
              label="状态">
              <template  slot-scope="scope">
                {{scope.row.enabled?'启用':'禁用'}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="160">
              <template slot-scope="scope">
	              <i class="iconfont iconbianji icon-active" style="margin-right: 20px;" @click="editTypeDialog(scope.row)"></i>
	              <i class="iconfont iconsuo icon-active"  v-if="!scope.row.enabled" @click="updateEnabled(scope.row.code)"></i>
	              <i class="iconfont iconkaisuo icon-active" v-if="scope.row.enabled" @click="updateEnabled(scope.row.code)"></i>

              </template>
            </el-table-column>
				  </el-table>
        </div>



      </div>
    </rightNav>


    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="400px" :close-on-click-modal='false'>
      <el-form :model="typeForm" label-width="80px" size="small" ref="typeForm">
        <el-form-item label="类别" prop="template" :required="true">
          <el-select v-model="typeForm.template" placeholder="请选择类别" class="input-class">
            <el-option
              v-for="item in templateList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="名称" prop="name" :required="true">
          <el-input  v-model="typeForm.name"  class="input-class"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="addQuestionType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'

export default {

  data() {
    return {
    	learningSection:'',
    	sectionList:[],
    	subjectList:[],
    	subjectCode:'',
    	table_height:300,
    	tableData:[],
    	dialogTitle:'',
    	dialogVisible: false,
    	typeForm:{
    		code:'',
    		name:'',
        template:'',
    	},
    	editTypeCode:'',
    	isEdit:false,
      templateList:[],


    }
  },
  components: {
    rightNav,
    
  },
  watch: {

  },
  computed: {
    


  },
  mounted() {
    this.$nextTick(()=>{
      this.table_height = this.$refs.wrap.offsetHeight  -  20
    })
    this.getlearningSection()
    this.gettemplate()

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
  		this.$http.get(`/api/internal/questionType/${this.learningSection}/${this.subjectCode}`)
  		.then((data)=>{
  			if(data.status == '200') {

  				this.tableData = data.data.content
  			

  			}
  		})
  	},

    gettemplate() {
      this.$http.get(`/api/open/common/getQuestionsTypeTemplate`)
      .then((data)=>{
        if(data.status == '200') {
          this.templateList = data.data
        }
      })
    },

  	changeSubject(key) {
  		this.subjectCode = key
  		this.getTableData()
  	},


  	updateEnabled(code) { 
  		this.$http.put(`/api/internal/questionType/${this.learningSection}/${this.subjectCode}/${code}/enabled`)
  		.then((data)=>{
  			if(data.status == '200') {
  				this.getTableData()	
  				this.$message.success("操作成功")
  			}
  		})
  	},
  	editTypeDialog(row) {
  		this.typeForm.code = row.code
  		this.typeForm.name = row.name
      this.typeForm.template = row.template.id
  		this.editTypeCode = row.code
  		this.isEdit = true
  		this.dialogTitle = '编辑题型'
  		this.dialogVisible = true
  	},
  	addTypeShow() {
      this.typeForm.code = ''
      this.typeForm.name = ''
      this.typeForm.template = ''
  		this.editTypeCode = ''
  		this.isEdit = false
  		this.dialogTitle = '新增题型'
  		this.dialogVisible = true
  		this.$nextTick(()=>{

  			this.$refs['typeForm'].clearValidate();

  		})
  		
  	},

  	addQuestionType() {

  		if(!this.typeForm.name) {
  			return this.$message.warning('题目名称不可以为空')
  		}

  		if(this.editTypeCode) {
	  		this.$http.put(`/api/internal/questionType/${this.learningSection}/${this.subjectCode}/${this.editTypeCode}`,{
	  			code: this.typeForm.code.replace(/(^\s*)|(\s*$)/g, ""),
	  			name: this.typeForm.name.replace(/(^\s*)|(\s*$)/g, ""),
          template: this.typeForm.template
	  		})
	  		.then((data)=>{
	  			if(data.status == '200') {
	  				this.getTableData()
	  				this.dialogVisible = false
	  				this.$message.success('编辑成功')
	  			}
	  		})



  		}else {
	  		this.$http.post(`/api/internal/questionType/${this.learningSection}/${this.subjectCode}`,{
	  			code: this.typeForm.code.replace(/(^\s*)|(\s*$)/g, ""),
	  			name: this.typeForm.name.replace(/(^\s*)|(\s*$)/g, ""),
          template: this.typeForm.template
	  		})
	  		.then((data)=>{
	  			if(data.status == '200') {
	  				this.getTableData()
	  				this.dialogVisible = false
	  				this.$message.success('新增成功')
	  			}
	  		})
  		}

  	},















  


  }
}
</script>
<style lang="less">
.question-type {

	.el-radio-group {
		width: 100%;
		text-align: center;
	}

}

</style>
<style lang="less" scoped>
 .question-type{
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
  .wrap {
    height: calc(100vh - 200px);
    // background-color: red;



  }
  .input-class {
    width: 240px;
  }
}
</style>
