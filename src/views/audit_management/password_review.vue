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
          <span>新密码审核 </span>
          <span style="margin-left: 20px;">{{schoolsName}}</span>

        </div>
        <div class="wrap" ref="wrap">
          <div class="search-wrap" ref="search_wrap">
            <el-form :inline="true" :model="search" class="demo-form-inline" size="mini">
              <el-form-item label="角色">
                <el-select v-model="search.roleTpye"class="search-class" @change="getTableData">
                  <el-option label="学生" value="Student"></el-option>
                  <el-option label="老师" value="Teacher"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="年级" v-show="search.roleTpye=='Student'">
                <el-select v-model="search.gradeId"class="search-class" @change="get_class_list" clearable>
                  <el-option v-for="list in gradeList" :label="list.gradeName" :value="list.gradeId.id" :key="list.gradeId.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班级" v-show="search.roleTpye=='Student'">
                <el-select v-model="search.classId"class="search-class" @change="getTableData" clearable>
                  <el-option v-for="list in classList" :label="list.className" :value="list.classId.id" :key="list.classId.id"></el-option>
                </el-select>
              </el-form-item>

              </el-form-item>
              <el-form-item label="账号">
                <el-input v-model="search.account" placeholder="账号" class="search-class" clearable></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="search.name" placeholder="姓名" class="search-class" clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getTableData">查询</el-button>
              </el-form-item>
            </el-form>
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
                label="姓名"
                width="100"
                prop="name"
                sortable>
              </el-table-column>
              <el-table-column
                label="账号"
                prop="username"
                sortable>
              </el-table-column>
              <el-table-column
                label="用户类型"
                prop=""
                sortable>
                  <template slot-scope="scope">
	                  {{scope.row.userType == 'Student'?'学生':'老师'}}
	                </template>
              </el-table-column>
<!--               <el-table-column
                label="年级"
                prop="grade.name"
                sortable>
              </el-table-column>
              <el-table-column
                label="班级"
                prop="clazz.name"
                sortable>
              </el-table-column> -->
              <el-table-column
                prop=""
                label="审批">
                <template slot-scope="scope">
                  <el-button type="text" @click="resetPass(scope.row)" >确认重置</el-button>

                </template>
              </el-table-column>
            </el-table>

          </div>
          <div class="pagination">
            <div>
              <el-checkbox v-model="checked" @change="toggleSelection">全选</el-checkbox>
              <el-button type="text" @click="resetPass" style="margin-left: 20px;">删除</el-button>
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
          </div>
        </div>




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
      schoolsName:'',

      gradeList:[],
      classList:[],
      checked:false,
      search: {
        roleTpye:'',
        gradeId:'',
        classId:'',
        name:'',
        page:1,
        size:10
      },
      total:0,





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
    toggleSelection() {

      // this.$refs.multipleTable.toggleAllSelection()
        if (this.checked) {
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row,true);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }


    },

    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.getTableData()
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getTableData()
    },



    defaultSelectNode(node) {
      this.currentNode = node
      this.schoolsName = node.name
      this.get_grade_list()
      this.getTableData()  
    },

    handleNodeClick(data) {
      this.currentNode = data
      this.schoolsName = data.name
      this.get_grade_list()
      this.getTableData()  
    },

    get_grade_list() {
      this.$http.get(`/api/internal/schools/${this.currentNode.id}/grades`)
      .then((data)=>{

        if(data.status == '200') {

          this.gradeList = data.data.content
          // this.gradeId = this.gradeList[0].gradeId.id
          // this.get_class_list()


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
    	this.classList = []
      this.search.classId = ''

      if(!this.search.gradeId) {
      	return false
      }
      

      this.$http.get(`/api/internal/grades/${this.search.gradeId}/classes`)
      .then((data)=>{

        if(data.status == '200') {

          this.classList = data.data.content
      		this.getTableData()
          


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



    getTableData() {

      this.tableData = []

        let params = {
          userType: this.search.roleTpye,
          gradeId: this.search.gradeId,
          calssId: this.search.classId,
          account: this.search.name,
          name: this.search.name,
          page: this.search.page - 1,
          size: this.search.size,
        }
        this.$http.get(`/api/internal/schools/${this.currentNode.id}/verifyUsers`,{params})
        .then((data)=>{

          if(data.status == '200') {

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



    resetPass(row) {
      this.$confirm('确认重置该成员密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        if(row) {

          this.$http.put(`/api/internal/schools/${row.userId.id}/verify`)
          .then((data)=>{
            if(data.status == '200') {

                this.$message({
                  message:'密码重置成功',
                  type:'success'
                })
                this.getTableData()


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
     
          let selectData = this.$refs.multipleTable.store.states.selection
          let ids = selectData.reduce((prev,current)=>{
            prev.push(current.id)
            return prev
          },[])



          if(this.search.roleTpye=='student') {
            this.$http.delete(`/api/internal/schools/${this.currentNode.id}/students`,{
              data: ids
            })
            .then((data)=>{
              if(data.status == '200') {

                  
                  this.$message({
                    message:'删除成功',
                    type:'success'
                  })
                  this.getTableData()


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
          }else if(this.search.roleTpye=='teacher') {
            this.$http.delete(`/api/internal/schools/${this.currentNode.id}/teachers`,{
              data: ids
            })
            .then((data)=>{
              if(data.status == '200') {

                  
                  this.$message({
                    message:'删除成功',
                    type:'success'
                  })
                  this.getTableData()


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


        }
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
      // margin-bottom: 20px;

      .search-class {
        width: 120px;
      }
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
