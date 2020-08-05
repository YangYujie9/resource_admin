<template>
  <div class="classmanagement">
    <rightNav>
      <div slot="left">
        <p class="right-header">组织架构 </p>
        <el-input v-model="filterText" placeholder="请输入组织名称开始搜索..." suffix-icon="el-icon-search" size="mini"></el-input>
        <div class="tree-wrap">
          <basicTree :tree-data="data" :filterText="filterText"  @selectnode="defaultSelectNode" @handleNodeClick="handleNodeClick"></basicTree>
        </div>
      </div>
      <div slot="right">
        <div class="right-header">
          <span>班级管理 </span>
          <span style="margin-left: 20px;">{{schoolsName}}</span>
          <el-button size="mini" style="margin-left: 20px;" @click="add_class_dialog"><i class="el-icon-plus"></i> 添加</el-button>

        </div>
        <div class="wrap" ref="wrap">
          <div class="search-wrap" ref="search_wrap">
  	        <el-radio-group v-model="gradeId" @change="get_class_list">
  			      <el-radio-button v-for="list in gradeList" :label="list.gradeId.id" :key="list.gradeId.id">{{list.gradeName}}</el-radio-button>
  	
  			    </el-radio-group>
          </div>

          <div class="table-wrap">
            <el-table
              :data="tableData"
              :height="table_height"
              ref="multipleTable"
              border>
              <el-table-column
                type="selection">
              </el-table-column>
              <el-table-column
                label="班级名"
                width="100"
                prop="className"
                sortable>
              </el-table-column>
              <el-table-column
                prop="teacherNames"
                sortable
                label="任课老师">
              </el-table-column> 
              <el-table-column
                prop="studentNames"
                sortable
                label="班级学生">
              </el-table-column> 

              <el-table-column
                prop=""
                label="操作"
                width="90">
                <template slot-scope="scope">
                  <div style="cursor: pointer;width: 100%;display: flex;justify-content: space-around;">
                  	<i class="iconfont iconbianji icon-active" @click="edit_class(scope.row)"></i>
                    <i class="iconfont iconshanchu-copy icon-active" @click="delete_class(scope.row)"></i>
  									
                  </div>
                </template>
              </el-table-column>
            </el-table>

          </div>
        </div>
<!--         <div class="pagination">
          <div>
            <el-checkbox v-model="checked" @change="toggleSelection">全选</el-checkbox>
            <el-button type="text" @click="deleteUser()" style="margin-left: 20px;">删除</el-button>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="search.page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="search.size"
            layout="total, prev, pager, next, sizes , jumper"
            :total="total">
          </el-pagination>
        </div> -->

        <el-dialog
				  :title="dislogTitle"
				  :visible.sync="dialogVisible"
          :close-on-click-modal='false'
				  width="500px">
				  <div class="class-wrap">
				  	<div class="input-wrap"><p class="label-class"><span class="require-class">*</span>班级名称：</p>
				  		<el-input v-model="classes.name" placeholder="请输入内容" class="input-class" size="small"></el-input>
				  	</div>
				  	<el-divider content-position="left">授课老师</el-divider>
						<div class="content-wrap">
							
							<div class="input-wrap" v-for="(list,index) in subjectList"><p class="label-class" style="padding-right: 10px;">{{list.subjectName}}</p>
								<el-select v-model="classes.tearchers[index]" class="input-class" @change="" size="small" value-key="userId" clearable>
	                <el-option v-for="list1 in list.teachers" :label="list1.teacherName" :value="list1" :key="list1.userId" placeholder="请选择" ></el-option>
	              </el-select>
					  	</div>
						</div>
				  </div>
				  <span slot="footer" class="dialog-footer">
				    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
				    <el-button type="primary" @click="add_class" size="mini">确 定</el-button>
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

export default {

  data() {

    return {
    	tableData:[],
    	table_height:300,
    	filterText:'',
    	data:[],
    	currentNode:'',
    	gradeList:[],
    	gradeId: '',
    	dialogVisible:false,
    	dislogTitle:'新增班级',
    	classes:{
    		name:'',
    		tearchers:[]
    	},
    	schoolsName:'',
    	subjectList:[],
    	isEdit: false,
    	editClassId:'',




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
      'getuserInfo',

    ]),

  },
  mounted() {
    this.$nextTick(()=>{
      this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight - 40
    })


    this.getOrgTree()
    



  },
  methods: {

    // 获取组织架构树
    getOrgTree(){
      this.$http.get(`/api/internal/organizations/tree`)
      .then((data)=>{
        if(data.status == '200') {

          this.data = data.data


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




    defaultSelectNode(node) {
    	this.currentNode = node
    	this.schoolsName = node.name
      this.get_grade_list()
      this.get_subjects()
    },

    handleNodeClick(data) {
    	this.currentNode = data
    	this.schoolsName = data.name
      this.get_grade_list()
      this.get_subjects()
    },

    get_grade_list() {
    	this.$http.get(`/api/internal/schools/${this.currentNode.id}/grades`)
    	.then((data)=>{

        if(data.status == '200') {

          this.gradeList = data.data.content
          this.gradeId = this.gradeList[0].gradeId.id
          this.get_class_list()


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

    get_class_list() {
    	this.$http.get(`/api/internal/grades/${this.gradeId}/classes`)
    	.then((data)=>{

        if(data.status == '200') {

        	for(let i=0;i<data.data.content.length;i++) {
        		let teacherNames = []
        		let studentNames = []
        		for(let j=0;j<data.data.content[i].teachers.length;j++) {
        			teacherNames.push(data.data.content[i].teachers[j].name)
        		}

        		for(let j=0;j<data.data.content[i].students.length;j++) {
        			studentNames.push(data.data.content[i].students[j].name)
        		}
        		data.data.content[i].teacherNames = teacherNames.join()
        		data.data.content[i].studentNames = studentNames.join()
        	}

          this.tableData = data.data.content


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

    get_subjects() {
    	this.$http.get(`/api/open/common/${this.currentNode.id}/subjectNTeacher`)
    	.then((data)=>{

        if(data.status == '200') {

          
          if(data.data.length) {
          	for(let i=0;i<data.data.length;i++) {
          		for(let j=0;j<data.data[i].teachers.length;j++) {
          			data.data[i].teachers[j].subjectId = data.data[i].subjectId.id
          		}
          	}	
          }
					this.subjectList = data.data
          

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
    add_class_dialog() {
    	this.dislogTitle = '新增班级'
    	this.isEdit = false
    	this.dialogVisible = true
    },
    

    edit_class(row) {
    	this.dislogTitle = '编辑班级'
    	this.isEdit = true
    	this.editClassId = row.classId.id
    	this.classes.name = row.className
    	let tearchers = []
    	for(let i=0;i<this.subjectList.length;i++) {
    		tearchers[i] = ''
    		for(let j=0;j<this.subjectList[i].teachers.length;j++) {
    			for(let k=0;k<row.teachers.length;k++) {
    				if(this.subjectList[i].teachers[j].userId == row.teachers[k].userNumber) {
    					tearchers[i] = this.subjectList[i].teachers[j]
    					break
    				}
    			}
    		}
    	}
    	this.classes.tearchers = tearchers
    	this.dialogVisible = true
    },


    add_class() {
    	if(!this.classes.name) {
  		  return this.$message({
          message: '班级名称不能为空',
          type:'error'
        })
    	}


    	let giveLessonCommands = []
    	this.classes.tearchers.forEach(item=>{
    		item.userId?giveLessonCommands.push({subjectId:item.subjectId,userId:item.userId}):null
    		
    	})

    	if(this.isEdit) {
    		//编辑

    		this.$http.put(`/api/internal/classes/${this.editClassId}`,{
	    		className: this.classes.name,
	    		giveLessonCommands: giveLessonCommands
	    	})
	    	.then((data)=>{

	        if(data.status == '200') {

	        	this.dialogVisible = false
	        	this.editClassId = ''

						this.$message({
	            message: '编辑成功',
	            type:'success'
	          })

	          
	          this.get_class_list()
	          

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
    		//新增
	    	this.$http.post(`/api/internal/grades/${this.gradeId}/classes`,{
	    		className: this.classes.name,
	    		giveLessonCommands: giveLessonCommands
	    	})
	    	.then((data)=>{

	        if(data.status == '200') {

	        	this.dialogVisible = false

						this.$message({
	            message: '新增成功',
	            type:'success'
	          })

	          
	          this.get_class_list()
	          

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

		delete_class(row) {

		  this.$confirm('确定删除该班级吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {


      	this.$http.delete(`/api/internal/classes/${row.classId.id}`)
	    	.then((data)=>{

	        if(data.status == '200') {


		        this.$message({
		          type: 'success',
		          message: '删除成功!'
		        })

	          
	          this.get_class_list()
	          

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
		},

  }
}
</script>
<style lang="less">
.classmanagement {

	.el-dialog__body {
		padding-bottom: 0px;
	}
}

</style>
<style lang="less" scoped>
 .classmanagement{
	height: 100%;

  .input-class {
    width: 280px;
  }
  .wrap {


    height: calc(100vh - 200px);
    // background-color: red;


    .search-wrap {
      margin-bottom: 20px;
    }


    .table-wrap {
      
    }
  }




  .tree-wrap {
    height: calc(100vh - 240px);
    overflow-y: auto;
  }



  .class-wrap {
		.content-wrap {
			max-height: calc(100vh - 520px);
			overflow-y: auto;
		}
  }


  }
</style>
