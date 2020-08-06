<template>
  <div class="classmanagement">
    <rightNav>
      <div slot="left">
        <p class="right-header">组织架构 </p>
        <el-input v-model="filterText" placeholder="请输入组织名称开始搜索..." suffix-icon="el-icon-search" size="small"></el-input>
        <div class="tree-wrap">
          <basicTree :tree-data="data" :filterText="filterText"  @selectnode="defaultSelectNode" @handleNodeClick="handleNodeClick"></basicTree>
        </div>
      </div>
      <div slot="right">
        <div class="right-header">
          <span>用户管理 </span>
          <span style="margin-left: 20px;">{{schoolsName}}</span>
          <el-button size="mini" style="margin-left: 20px;" @click="add_user_dialog"><i class="el-icon-plus"></i> 新增用户</el-button>

        </div>
        <div class="wrap" ref="wrap">
          <div class="search-wrap" ref="search_wrap">
            <el-form :inline="true" :model="search" class="demo-form-inline" size="mini">
              <el-form-item label="角色">
                <el-select v-model="search.roleTpye"class="search-class" @change="getTableData">
                  <el-option label="学生" value="student"></el-option>
                  <el-option label="老师" value="teacher"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="年级" v-show="search.roleTpye=='student'" >
                <el-select v-model="search.gradeId"class="search-class" @change="get_class_list" clearable>
                  <el-option v-for="list in gradeList" :label="list.gradeName" :value="list.gradeId.id" :key="list.gradeId.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班级" v-show="search.roleTpye=='student'">
                <el-select v-model="search.classId"class="search-class" @change="getTableData" clearable>
                  <el-option v-for="list in searchClassList" :label="list.className" :value="list.classId.id" :key="list.classId.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="学科"  v-show="search.roleTpye=='teacher'">
                <el-select v-model="search.subjectId"class="search-class" @change="getTableData" clearable>
                  <el-option v-for="list in subjectList" :label="list.subjectName" :value="list.subjectId.id" :key="list.subjectId.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="search.enabled" placeholder="状态" class="search-class" @change="getTableData">
                  <el-option label="冻结" value="0"></el-option>
                  <el-option label="正常" value="1"></el-option>
                  <el-option label="新用户" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="search.name" placeholder="请输入姓名" class="search-class" clearable></el-input>
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
                prop="person.fullName"
                sortable>
              </el-table-column>
              <el-table-column
                label="账号"
                prop="username"
                sortable>
              </el-table-column>
 <!--              <el-table-column
                label="所在学校"
                prop="school.name"
                sortable>
              </el-table-column>
              <el-table-column
                label="用户状态"
                prop="className"
                sortable>
              </el-table-column>
              <el-table-column
                label="用户角色"
                prop="className"
                sortable>
              </el-table-column> -->
              <el-table-column
                label="手机号码"
                prop="person.phoneNumber"
                sortable>
              </el-table-column>
              <el-table-column
                label="邮箱"
                prop="person.email"
                sortable>
              </el-table-column>
              <el-table-column
                label="学段"
                prop="sectionName"
                sortable>
              </el-table-column>
              <el-table-column
                v-if="search.roleTpye=='student'"
                label="年级"
                prop="grade.name"
                sortable>
              </el-table-column>
              <el-table-column
                v-if="search.roleTpye=='student'"
                label="班级"
                prop="clazz.name"
                sortable>
              </el-table-column>
              <el-table-column
                v-if="search.roleTpye=='teacher'"
                label="学科"
                prop="subject.name"
                sortable>
              </el-table-column>
              <el-table-column
                prop=""
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <div style="cursor: pointer;width: 100%;display: flex;justify-content: space-around;">
                    <i class="iconfont iconbianji icon-active" @click="editUserDialog(scope.row)"></i>
                    <i class="iconfont iconshanchu-copy icon-active" @click="deleteUser(scope.row)"></i>
                    <i class="iconfont iconsuo icon-active"  v-if="search.enabled =='0'" @click="UnLockUser(scope.row)"></i>
                    <i class="iconfont iconkaisuo icon-active" v-else @click="lockUser(scope.row)"></i>
                    <i class="iconfont icon_zhongzhi icon-active" @click="resetpassDialog(scope.row)"></i>
                  </div>

                </template>
              </el-table-column>
            </el-table>

          </div>
          <div class="pagination">
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
          </div>
        </div>


        <el-dialog
          :title="dislogTitle"
          :visible.sync="dialogVisible"
          :close-on-click-modal='false'
          width="500px">
          <div class="class-wrap">
            <el-form :model="userForm" size="small" label-width="100px" :rules="rules" ref="usersForm">

              <el-form-item label="用户类型" prop="userRole" :required="true">
                <el-select v-model="userForm.userRole" class="input-class" :disabled="isEdit||isReset">
                  <el-option label="学生" value="student"></el-option>
                  <el-option label="老师" value="teacher"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="账号" prop="account" :required="true">
                <input style="position: fixed;bottom: -9999px;">
                <el-input v-model="userForm.account"  class="input-class" placeholder="请输入" :disabled="isEdit"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name" :required="true" >
                <input style="position: fixed;left: -9999px;">
                <el-input v-model="userForm.name"  class="input-class" placeholder="请输入" autocomplete="off"></el-input>
              </el-form-item>
<!--               <el-form-item label="学段" prop="learningSection" :required="true" >
                <el-select v-model="userForm.learningSection" class="input-class" @change="">
                  <el-option v-for="list in getlearningSection" :label="list.value" :value="list.key" :key="list.key"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="年级" v-show="userForm.userRole=='student'" :required="true">
                <el-select v-model="userForm.gradeId"class="input-class" @change="get_class_list" value-key="gradeId.id">
                  <el-option v-for="list in gradeList" :label="list.gradeName" :value="list.gradeId.id" :key="list.gradeId.id"></el-option>               
                </el-select>
              </el-form-item>
              <el-form-item label="班级" v-show="userForm.userRole=='student'" :required="true">
                <el-select v-model="userForm.classId"class="input-class">
                  <el-option v-for="list in classList" :label="list.className" :value="list.classId.id" :key="list.classId.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="学科"  v-show="userForm.userRole=='teacher'" :required="true">
                <el-select v-model="userForm.subjectId"class="input-class" :disabled="isEdit">
                  <el-option v-for="list in subjectList" :label="list.subjectName" :value="list.subjectId.id" :key="list.subjectId.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="密码" prop="pass" :required="true" v-if="!isEdit">
                <input style="position: fixed;left: -9999px;">
                <el-input v-model="userForm.pass" type="password" class="input-class" placeholder="请输入密码" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass" :required="true" v-if="!isEdit">
                <el-input v-model="userForm.checkPass" type="password"  class="input-class" placeholder="请再次输入密码" autocomplete="new-password"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="userForm.phoneNumber" class="input-class" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" >
                <el-input v-model="userForm.email" class="input-class" placeholder="请输入"></el-input>
              </el-form-item>
            </el-form>

          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="add_user" size="mini">确 定</el-button>
          </span>
        </el-dialog>



        <el-dialog
          title="重置密码"
          :visible.sync="resetDialogVisible"
          width="500px">
          <div class="class-wrap">
            <el-form :model="resetForm" size="small" label-width="100px">

              <el-form-item label="用户类型" prop="userRole">
                <el-select v-model="resetForm.userRole" class="input-class" disabled>
                  <el-option label="学生" value="student"></el-option>
                  <el-option label="老师" value="teacher"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="账号" prop="account">
                <input style="position: fixed;bottom: -9999px;">
                <el-input v-model="resetForm.account"  class="input-class" placeholder="请输入" disabled></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name" >
                <input style="position: fixed;left: -9999px;">
                <el-input v-model="resetForm.name"  class="input-class" placeholder="请输入" autocomplete="off" disabled></el-input>
              </el-form-item>

              <el-form-item label="新密码" prop="pass">
                <input style="position: fixed;left: -9999px;" type="password">
                <el-input v-model="resetForm.pass" type="password" class="input-class" placeholder="请输入密码" autocomplete="off"></el-input>
              </el-form-item>

            </el-form>

          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetDialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="reset_user" size="mini">确 定</el-button>
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
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.userForm.checkPass !== '') {
            this.$refs.usersForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      tableData:[],
      table_height:300,
      filterText:'',
      data:[],
      currentNode:'',
      dialogVisible:false,
      resetDialogVisible:false,
      dislogTitle:'新增用户',
      schoolsName:'',
      isEdit: false,
      isReset:false,
      editUserId:'',
      gradeList:[],
      subjectList:[],
      searchClassList:[],
      classList:[],
      checked:false,
      learningSection:'',
      search: {
        roleTpye:'student',
        gradeId:'',
        classId:'',
        name:'',
        subjectId:'',
        enabled:'1',
        page:1,
        size:10
      },
      total:0,
      userForm:{
        userRole:'student',
        account:'',
        name: "",
        gradeId:'',
        classId:'',
        subjectId:'',
        pass:'',
        checkPass:'',
        phoneNumber: '',
        email:''
      },
      resetForm:{
        userRole:'student',
        account:'',
        name: "",
        pass:'',
      },

      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { type: 'string', message: '账号必须为字符串'}
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
 
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
      this.search.size = val
      // console.log(`每页 ${val} 条`);
      this.getTableData()
    },
    // 分页
    handleCurrentChange(val) {
      this.search.page = val
      // console.log(`当前页: ${val}`);
      this.getTableData()
    },



    defaultSelectNode(node) {
      this.currentNode = node
      this.schoolsName = node.name
      this.get_grade_list()
      this.get_subject_list()
      this.getTableData()  
    },

    handleNodeClick(data) {
      this.currentNode = data
      this.schoolsName = data.name
      this.get_grade_list()
      this.get_subject_list()
      this.getTableData() 
      // this.search.roleTpye = 'student'
      this.search.gradeId = ''
      this.search.classId = ''
      // this.search.name = ''
      // this.search.subjectId = ''
      this.search.page = 1
      this.search.size = 10

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

    get_class_list(gradeId) {


      this.classList = []
      this.searchClassList = []


      if(this.isAdd || this.isEdit) {
        this.userForm.classId = ''

      }else {
        this.search.classId = ''
      }

      if(!gradeId) {

        return false
      } 
      
      

      this.$http.get(`/api/internal/grades/${gradeId}/classes`)
      .then((data)=>{

        if(data.status == '200') {


         if(this.isAdd || this.isEdit) {
            this.classList = data.data.content

          }else {
            this.searchClassList = data.data.content
            this.getTableData()
          }
          


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

    get_subject_list() {
      this.$http.get(`/api/internal/schools/${this.currentNode.id}/subjects`)
      .then((data)=>{

        if(data.status == '200') {

          this.subjectList = data.data.content
          

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

      if(this.search.roleTpye=='student') {
        let params = {
          enabled: this.search.enabled,
          gradeId: this.search.gradeId,
          clazz: this.search.classId,
          name: this.search.name,
          page: this.search.page - 1,
          size: this.search.size,
        }
        this.$http.get(`/api/internal/schools/${this.currentNode.id}/students`,{params})
        .then((data)=>{

          if(data.status == '200') {

            this.tableData = data.data.content
            this.total = data.data.totalElements


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


        let params = {
          enabled: this.search.enabled,
          subjectId: this.search.subjectId,
          name: this.search.name,
          page: this.search.page - 1,
          size: this.search.size,
        }
        this.$http.get(`/api/internal/schools/${this.currentNode.id}/teachers`,{params})
        .then((data)=>{

          if(data.status == '200') {

            this.tableData = data.data.content
            this.total = data.data.totalElements

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

    add_user_dialog() {
      this.editUserId = ''
      this.dislogTitle = '添加用户'
      this.isEdit = false
      this.isAdd = true
      this.dialogVisible = true
      this.$nextTick(()=>{
          this.$refs['usersForm'].resetFields();
      }) 
    },
    

    editUserDialog(row) {

      this.dislogTitle = '编辑用户'
      this.isEdit = true
      this.isAdd = false
      this.editUserId = row.id
      this.userForm.userRole = this.search.roleTpye
      this.userForm.account = row.username
      this.userForm.name = row.person.fullName
      this.userForm.gradeId = row.grade?row.grade.id:''
      this.userForm.classId = row.clazz?row.clazz.id:''
      this.userForm.subjectId = row.subject?row.subject.id:''
      this.userForm.phoneNumber = row.person.phoneNumber
      this.userForm.email = row.person.email


      this.dialogVisible = true
    },




    add_user() {

      this.$refs['usersForm'].validate((valid) => {
        if (valid) {

          if(this.isEdit) {

            if(this.userForm.userRole=='student') {

              this.$http.put(`/api/internal/schools/${this.currentNode.id}/students/${this.editUserId}`,{
                user: {
                  fullName: this.userForm.name,
                  phoneNumber: this.userForm.phoneNumber,
                  email: this.userForm.email,
                }, 
                gradeId: this.userForm.gradeId, 
                classId: this.userForm.classId, 
      
              })

              .then((data)=>{

                if(data.status == '200') {

                  this.getTableData()
                  this.isEdit = false
                  this.dialogVisible = false
                  this.$message({
                    message: '学生修改成功',
                    type:'success'
                  })



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


            }else if(this.userForm.userRole=='teacher') {
              this.$http.put(`/api/internal/schools/${this.currentNode.id}/teachers/${this.editUserId}`,{
    
                user: {
                  fullName: this.userForm.name,
                  phoneNumber: this.userForm.phoneNumber,
                  email: this.userForm.email,
                }, 
              })

              .then((data)=>{

                this.getTableData()

                if(data.status == '200') {
                  this.dialogVisible = false
                  this.isEdit = false
                  this.$message({
                    message: '老师修改成功',
                    type:'success'
                  })


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
          }else {
            if(this.userForm.userRole=='student') {
              this.$http.post(`/api/internal/schools/${this.currentNode.id}/students`,{
                username: this.userForm.account,
                password: this.userForm.pass, 
                user: {
                  fullName: this.userForm.name,
                  phoneNumber: this.userForm.phoneNumber,
                  email: this.userForm.email,
                }, 
                gradeId: this.userForm.gradeId, 
                classId: this.userForm.classId, 
      
              })

              .then((data)=>{

                if(data.status == '200') {

                  this.getTableData()
                  this.isAdd = false
                  this.dialogVisible = false
                  this.$message({
                    message: '学生新增成功',
                    type:'success'
                  })



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


            }else if(this.userForm.userRole=='teacher') {
              this.$http.post(`/api/internal/schools/${this.currentNode.id}/teachers`,{
                username: this.userForm.account,
                password: this.userForm.pass, 
                user: {
                  fullName: this.userForm.name,
                  phoneNumber: this.userForm.phoneNumber,
                  email: this.userForm.email,
                }, 
                subjectId: this.userForm.subjectId, 
              })

              .then((data)=>{

                this.getTableData()
                this.isAdd = false
                if(data.status == '200') {
                  this.dialogVisible = false

                  this.$message({
                    message: '老师新增成功',
                    type:'success'
                  })


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


        } else {
          
          return false;
        }
      });
    },

    deleteUser(row) {
      this.$confirm('确认删除该成员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        if(row) {
          if(this.search.roleTpye=='student') {
            this.$http.delete(`/api/internal/schools/${this.currentNode.id}/students/${row.id}`)
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
            this.$http.delete(`/api/internal/schools/${this.currentNode.id}/teachers/${row.id}`)
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


    lockUser(row) {
      this.$http.put(`/api/internal/user/${row.userId}/disable`)

      .then((data)=>{
        if(data.status == '200') {

            this.$message({
              message:'禁用成功',
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
    },

    UnLockUser(row) {
      this.$http.put(`/api/internal/user/${row.userId}/enable`)

      .then((data)=>{
        if(data.status == '200') {

            this.$message({
              message:'启用成功',
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
    },

    resetpassDialog(row) {
      this.resetForm.userRole = this.search.roleTpye
      this.editUserId = row.id
      this.resetForm.account = row.username
      this.resetForm.name = row.person.fullName
      this.resetForm.pass = ''
      this.resetDialogVisible = true

    },
    reset_user() {

      if(!this.resetForm.pass) {
        return this.$message({
          message:"密码不能为空",
          type: "warning"
        })
      }

      if(this.resetForm.userRole=='student') {
        this.$http.put(`/api/internal/schools/${this.currentNode.id}/students/${this.editUserId}/password`,{
          newPassword: this.resetForm.pass
        })

        .then((data)=>{

          if(data.status == '200') {

            this.getTableData()

            this.resetDialogVisible = false
            
            this.$message({
              message: '密码重置成功',
              type:'success'
            })



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


      }else if(this.resetForm.userRole=='teacher') {
        this.$http.put(`/api/internal/schools/${this.currentNode.id}/teachers/${this.editUserId}/password`,{
          newPassword: this.resetForm.pass
        })

        .then((data)=>{

          if(data.status == '200') {

            this.getTableData()

            this.resetDialogVisible = false
            
            this.$message({
              message: '密码重置成功',
              type:'success'
            })



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
