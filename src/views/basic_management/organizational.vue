<template>
  <div class="organozation">
    <rightNav>
      <div slot="left" style="height: 100%;">
        <organizationTree @handleCheckNode="handleCheckNode" :enableEdit="true" :orgSelectable="true" :defaultRoot="true"></organizationTree>
        <!-- <p class="right-header">组织架构 </p>
        <el-input v-model="filterText" placeholder="请输入组织名称开始搜索..." suffix-icon="el-icon-search" size="small"></el-input>
        <div class="tree-wrap">
          <basicTree :tree-data="data" :filterText="filterText" @editnode="editNode" @appendnode="appendNode" @deletenode="deleteNode" :enableEdit="true" :orgSelectable="true" :defaultRoot="true" @selectnode="defaultSelectNode" @handleNodeClick="handleNodeClick"></basicTree>
        </div> -->
      </div>
      <div slot="right">
        <div class="right-header">
          <span >账号管理（管理员） </span>
          <el-button size="mini" style="margin-left: 20px;" type="primary" @click="addUserDialog"><i class="el-icon-plus"></i> 新增用户</el-button>
        </div>

        <div class="wrap" ref="wrap">
          <div class="search-wrap" ref="search_wrap">
            <el-form :inline="true" :model="search" class="demo-form-inline" size="mini">
              <el-form-item label="类型">
                <el-select v-model="search.type" placeholder="类型" class="search-class" @change="resetPage" clearable>
                  <el-option v-for="list in typeList" :label="list.label" :value="list.key" :key="list.key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="search.status" placeholder="状态" class="search-class" @change="resetPage" clearable>
                  <el-option label="冻结" value="0"></el-option>
                  <el-option label="正常" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="账号">
                <el-input v-model="search.account" placeholder="请输入账号" class="search-class"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="search.name" placeholder="请输入姓名" class="search-class"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="resetPage">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table-wrap" ref="table_warp">
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
                  prop="personal.fullName"
                  sortable>
                </el-table-column>
              <el-table-column
                prop="username"
                sortable
                label="账号">
              </el-table-column> 
              <el-table-column
                prop="school.name"
                label="所属组织">
                <template slot-scope="scope">
                  <span>{{scope.row.school ? scope.row.school.name : scope.row.organization.name}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="enabled"
                label="用户状态"
                sortable
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.enabled ? '正常' : '冻结'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="userRole"
                label="用户类型">
                <template slot-scope="scope">
                  {{getuserType(scope.row.userRole)}}
                </template>
                
              </el-table-column>
              <el-table-column
                prop="personal.phoneNumber"
                label="手机号码"
                sortable
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="personal.email"
                label="邮箱"
                sortable
                show-overflow-tooltip>
              </el-table-column> 
              <el-table-column
                prop=""
                label="操作">
                <template slot-scope="scope">
                  <div style="cursor: pointer;width: 100%;display: flex;justify-content: space-around;">
                    <i class="iconfont iconbianji icon-active" @click="editUserDialog(scope.row)"></i>
                    <i class="iconfont iconshanchu-copy icon-active" @click="deleteUser(scope.row)"></i>
                    <i class="iconfont iconsuo icon-active" style="" v-if="!scope.row.enabled" @click="UnLockUser(scope.row)"></i>
                    <i class="iconfont iconkaisuo icon-active" v-if="scope.row.enabled" @click="lockUser(scope.row)"></i>
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
      </div>
    </rightNav>

<!--    <el-dialog :title="orgDialogTitle" :visible.sync="orgDialogVisible" width="500px" :close-on-click-modal='false'>
      <el-form :model="orgForm"  size="small" label-width="100px" :show-message='false'>
        <el-form-item label="节点类型">
          <el-select v-model="orgForm.type" placeholder="请选择" class="input-class">
            <el-option label="组织" value="Organization"></el-option>
            <el-option label="学校" value="School"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="orgForm.type ==='Organization' ? '组织名称' : '学校名称'" prop="name" :required="true">
          <el-input v-model="orgForm.name" placeholder="请输入名称"  class="input-class"></el-input>
        </el-form-item>
        <el-form-item label="学校学段" prop="description" v-show="orgForm.type ==='School'">
          <el-select v-model="orgForm.learningSection" placeholder="请选择"  class="input-class">
            <el-option label="小学" value="PrimarySchool"></el-option>
            <el-option label="初中" value="JuniorMiddleSchool"></el-option>
            <el-option label="高中" value="HighSchool"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="orgForm.type ==='Organization' ? '组织描述' : '学校描述' ">
          <el-input
            type="textarea"
            class="input-class"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入描述"
            v-model="orgForm.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orgDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addOrg" size="mini">确 定</el-button>

      </div>
    </el-dialog> -->

    <el-dialog :title="UserDialogTitle" :visible.sync="userDialogVisible" width="500px">
      <el-form :model="userForm" size="small" label-width="100px" :rules="rules" ref="userForm">

        <el-form-item label="用户类型" prop="userRole" :required="true">
          <el-select v-model="userForm.userRole" class="input-class" :disabled="isUserEdit||isReset">
            <el-option v-for="list in typeList" :label="list.label" :value="list.key" :key="list.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account" :required="true">
          <input type="password" name="password" style="position: fixed;bottom: -9999px;">
          <el-input v-model="userForm.account"  class="input-class" placeholder="请输入" :disabled="isUserEdit||isReset"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :required="true" >
          <input type="password" name="password" style="position: fixed;left: -9999px;">
          <el-input v-model="userForm.name"  class="input-class" placeholder="请输入" autocomplete="off" :disabled="isReset"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass" :required="true" v-show="!isUserEdit">
          <input type="password" name="password" style="position: fixed;left: -9999px;">
          <el-input v-model="userForm.pass" type="password" class="input-class" placeholder="请输入密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :required="true" v-show="!isUserEdit">
          <el-input v-model="userForm.checkPass" type="password"  class="input-class" placeholder="请再次输入密码" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" v-show="!isReset">
          <el-input v-model="userForm.phoneNumber" class="input-class" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"  v-show="!isReset">
          <el-input v-model="userForm.email" class="input-class" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>


<!--     <el-dialog title="重置密码" :visible.sync="resetDialogVisible" width="500px">
      <el-form :model="restForm" size="small" label-width="100px" :rules="rules" ref="userForm">


        <el-form-item label="密码" prop="pass" :required="true" v-show="!isUserEdit">
          <input type="password" name="password" style="position: fixed;left: -9999px;">
          <el-input v-model="userForm.pass" type="password" class="input-class" placeholder="请输入密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :required="true" v-show="!isUserEdit">
          <el-input v-model="userForm.checkPass" type="password"  class="input-class" placeholder="请再次输入密码" autocomplete="new-password"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="addUser">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'
  import basicTree from '@/components/Tree/basicTree'
  import organizationTree from '@/components/Nav/organizationTree'
export default {


  data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.userForm.checkPass !== '') {
            this.$refs.userForm.validateField('checkPass');
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
      filterText:'',
      data: [],
      defaultProps: {
        children: 'members',
        label: 'name',
        value:'resourceId'
      },
      currentNode:'',
      // orgDialogTitle: '添加节点',
      UserDialogTitle: '新增用户',
      // orgDialogVisible: false,
      userDialogVisible: false,
      // orgForm: {
      //   type:'Organization',
      //   name: '',
      //   learningSection: '',
      //   description: ''
      // },
      isEdit: false,
      isReset: false,
      selectId:'',
      selectParentId:'',
      tableData: [],
      table_height: 300,
      search: {
        type:'',
        status:'',
        account:'',
        name:'',
        page:1,
        size:10,
      },
      total:0,
      checked: false,
      // typeList: [{
      //   label:'管理员',
      //   value:'Administrator',
      //   key:"0"
      // },{
      //   label:'审核员',
      //   value:'Auditor',
      //   key:"1"
      // },{
      //   label:'录题员',
      //   value:'Recorder',
      //   key:"2"
      // }],
      userForm:{
        userRole:'0',
        account:'',
        name: "",
        pass:'',
        checkPass:'',
        phoneNumber: '',
        email:''
      },
      isUserEdit:false,
      editUserId:'',
      totalTypeList: [
        {label:'区域运维管理员',value:'Administrator',key:"0",role:'Organization'},
        {label:'审核员',value:'Auditor',key:"1",role:'Organization'},
        {label:'区域领导',value:'AreaLeaders',key:"4",role:'Organization'},
        {label:'学校运维管理员',value:'Administrator',key:"0",role:'School'},
        {label:'审核员',value:'Auditor',key:"1",role:'School'},
        {label:'录题员',value:'Recorder',key:"2",role:'School'},
        {label:'校领导',value:'SchoolLeader',key:"3",role:'School'}
      ],
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
    // basicTree,
    organizationTree
  },
  watch: {

  },
  computed: {
    
    ...mapGetters([
      'getuserInfo',

    ]),

    typeList() {
        return this.totalTypeList.filter(list=>{
          console.log(list,this.currentNode.memberType)
          return list.role == this.currentNode.memberType
        })
      // if(this.currentNode.memberType == 'Organization') {
      //   return this.totalTypeList.filter(list=>{
      //     list.role == this.currentNode.memberType
      //   })
      // }else {
      //   return [

      //   ]
      // } 
    }

  },
  mounted() {
    this.$nextTick(()=>{
      this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight -40
    })

    window.onresize = () => {
      this.table_height = this.$refs.wrap.offsetHeight  - this.$refs.search_wrap.offsetHeight -40  
    }
    this.getOrgTree()

  },

  destroyed(){
    window.onresize = null;
  },
  methods: {
    // editNode(node,data) {
    //   this.showOrgDialog(data,true)
    // },

    // appendNode(node,data) {
    //   this.showOrgDialog(data, false)
    // },

    // deleteNode(node,data) {
    //   this.deleteOrg(node)
    // },

    // defaultSelectNode(node){
    //   this.currentNode = node
    //   this.getTableData()
    // },
    handleCheckNode(data) {
      this.search.type = ''
      this.currentNode = data
      this.resetPage()
    },
    getuserType(type) {


      let name = this.totalTypeList.filter(list=> {
        return list.value == type
      })
      if(name && name.length) {
        return name[0].label
      } else {
        return ''
      }
      
    },

    resetPage() {
      this.search.page = 1
      this.getTableData()
    },
    getTableData() {

      this.tableData = []

      if(this.currentNode.memberType == "School") {
        this.$http.get(`/api/internal/schools/${this.currentNode.id}/users?account=${this.search.account}&name=${this.search.name}&userRole=${this.search.type}&enabled=${this.search.status}&page=${this.search.page-1}&size=${this.search.size}`)
        .then((data)=>{
          if(data.status == '200') {

            this.tableData = data.data.content
            this.total = data.data.totalElements


          } 
            
          })

      }else {
        this.$http.get(`/api/internal/organizations/${this.currentNode.id}/users?account=${this.search.account}&name=${this.search.name}&userRole=${this.search.type}&enabled=${this.search.status}&page=${this.search.page-1}&size=${this.search.size}`)
        .then((data)=>{
          if(data.status == '200') {

            this.tableData = data.data.content
            this.total = data.data.totalElements


          } 
            
          })
    
      }



    },
    // 获取组织架构树
    getOrgTree(){
      this.$http.get(`/api/internal/organizations/tree`)
      .then((data)=>{
        if(data.status == '200') {

          this.data = data.data


        } 
        
      })


    },
    //     // 显示添加组织弹窗
    // showOrgDialog(val,flag){
    //   // flag 判断编辑添加
    //   this.selectId = val.resourceId.id
    //   val.memberType == "School"?this.selectParentId = val.parentId.id:null
      

    //   if(flag){
    //     //编辑
    //     this.orgDialogTitle = '编辑节点'

    //     if(val.memberType == 'School') {
    //       this.$http.get(`/api/internal/schools/${this.selectId}`)
    //       .then((data)=>{

    //         if(data.status == '200') {

    //           this.orgForm.name = data.data.schoolName
    //           this.orgForm.type = val.memberType
    //           this.orgForm.learningSection = data.data.learningSection
    //           this.orgForm.description = data.data.description
    //           this.isEdit = true
    //           this.orgDialogVisible = true

    //         } 
    //       })
    //     }else {
    //       this.orgForm.name = val.name
    //       this.orgForm.type = val.memberType
    //       this.orgForm.description = val.description
    //       this.isEdit = true
    //       this.orgDialogVisible = true
    //     }


    //   }else {
    //     this.orgDialogTitle = '添加节点'
    //     this.orgForm.type = 'Organization'
    //     this.orgForm.name = ''
    //     this.orgForm.learningSection = ''
    //     this.orgForm.description = ''
    //     this.isEdit = false
    //     this.orgDialogVisible = true
    //   }
      
      
    // },

    // // 添加组织/添加学校
    // addOrg () {
    //   if(!this.orgForm.name) {
    //     return this.$message({
    //       message: '名称不能为空',
    //       type: 'warning'
    //     })
    //   }


    //   if(this.orgForm.type == 'Organization') {
    //     //编辑组织
    //     if(this.isEdit) {

          

    //       this.$http.put(`/api/internal/organizations/${this.selectId}`,{
    //         name: this.orgForm.name,
    //         description: this.orgForm.description
    //       })  
    //       .then((data)=>{
    //         if(data.status == '200') {

    //           this.orgDialogVisible = false
    //           this.selectId = ''

    //           this.$message({
    //             message:'修改成功',
    //             type:'success'
    //           })

    //           this.getOrgTree()


    //         } 
            
    //       })


    //     }else {
    //       //添加组织
    //       this.$http.post(`/api/internal/organizations/${this.selectId}/organizations`,{
    //         name: this.orgForm.name,
    //         description: this.orgForm.description
    //       })  
    //       .then((data)=>{
    //         if(data.status == '200') {

    //           this.orgDialogVisible = false
    //           this.selectId = ''

    //           this.$message({
    //             message:'添加成功',
    //             type:'success'
    //           })

    //           this.getOrgTree()


    //         } 
            
    //       })



    //     }


    //   }
    //   // 学校
    //   else {
    //     //编辑学校

    //     if(!this.orgForm.learningSection) {
    //       return this.$message({
    //         message: '学段不能为空',
    //         type: 'warning'
    //       })
    //     }
    //     if(this.isEdit) {
         

    //       this.$http.put(`/api/internal/schools/${this.selectId}`,{
    //         organizationId: this.selectParentId,
    //         schoolName: this.orgForm.name,
    //         description: this.orgForm.description,
    //       })  
    //       .then((data)=>{
    //         if(data.status == '200') {
    //           this.selectId = ''
    //           this.orgDialogVisible = false

    //           this.$message({
    //             message:'修改成功',
    //             type:'success'
    //           })

    //           this.getOrgTree()


    //         } 
            
    //       })



    //     }else {
    //       //添加学校

    //       this.$http.post(`/api/internal/schools`,{
    //         organizationId: this.selectId,
    //         schoolName: this.orgForm.name,
    //         description: this.orgForm.description,
    //         learningSection: this.orgForm.learningSection,
    //       })  
    //       .then((data)=>{
    //         if(data.status == '200') {

    //           this.orgDialogVisible = false

    //           this.$message({
    //             message:'添加成功',
    //             type:'success'
    //           })

    //           this.getOrgTree()


    //         } 
            
    //       })



    //     }


    //   }

      
      
    // },

    
    // // 删除组织/删除学校
    // deleteOrg(node){
    //   // if(this.orgForm.type == 'Organization') {
    //   this.$confirm('确认删除该节点?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {


    //     let id = node.data.resourceId.id

    //     if(node.data.memberType == 'Organization') {
    //       this.$http.delete(`/api/internal/organizations/${id}`)
    //       .then((data)=>{
    //         if(data.status == '200') {


    //           this.$message({
    //             message:'删除成功',
    //             type:'success'
    //           })

    //           this.getOrgTree()


    //         } 
            
    //       })

    //     }else {
    //       this.$http.delete(`/api/internal/schools/${id}`)
    //       .then((data)=>{
    //         if(data.status == '200') {


    //           this.$message({
    //             message:'删除成功',
    //             type:'success'
    //           })

    //           this.getOrgTree()


    //         } 
            
    //       })
    //     }
        

    //   })

  
  
    // },

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
      this.resetPage()
    },
    // 分页
    handleCurrentChange(val) {
      this.search.page = val
      // console.log(`当前页: ${val}`);
      this.getTableData()
    },
    addUserDialog() {
      this.UserDialogTitle = "新增用户"
      this.isUserEdit = false
      this.isReset = false
      // this.userForm.userRole = '0'
      // this.userForm.account = ''
      // this.userForm.name = ''
      // this.userForm.pass = ''
      // this.userForm.checkPass = ''
      // this.userForm.phoneNumber = ''
      // this.userForm.email = ''

      this.userDialogVisible = true
      this.$nextTick(()=>{
          this.$refs['userForm'].resetFields();
      })  
    },

    editUserDialog(row) {
      this.UserDialogTitle = "编辑用户"
      this.isUserEdit = true
      this.isReset = false
      let role = this.typeList.filter(item=>item.value == row.userRole)
      this.userForm.userRole = role[0].key

      this.editUserId = row.userId.id
      this.userForm.account = row.username
      this.userForm.name = row.personal.fullName
      this.userForm.pass = '123456'
      this.userForm.checkPass = '123456'
      this.userForm.phoneNumber = row.personal.phoneNumber
      this.userForm.email = row.personal.email
      this.userDialogVisible = true

    },

    resetpassDialog(row) {
      this.UserDialogTitle = "重置密码"
      this.isReset = true
      let role = this.typeList.filter(item=>item.value == row.userRole)
      this.userForm.userRole = role[0].key

      this.editUserId = row.userId.id
      this.userForm.account = row.username
      this.userForm.name = row.personal.fullName
      this.userForm.pass = ''
      this.userForm.checkPass = ''
      this.userForm.phoneNumber = row.personal.phoneNumber
      this.userForm.email = row.personal.email
      this.userDialogVisible = true

    },

    addUser() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          if(this.isUserEdit) {
            //  编辑用户
            this.$http.put(`/api/internal/users/${this.editUserId}`,{
             user: {
                fullName: this.userForm.name,
                phoneNumber: this.userForm.phoneNumber,
                email: this.userForm.email
              },
            })
            .then((data)=>{
              if(data.status == '200') {

                  this.userDialogVisible = false
                  this.$message({
                    message:'编辑成功',
                    type:'success'
                  })
                  this.getTableData()


                } 
                
              })
      


          }else if(this.isReset) {
            //修改密码
            this.$http.put(`/api/internal/users/${this.editUserId}/password`,{
              newPassword: this.userForm.pass,
            })
            .then((data)=>{
              if(data.status == '200') {

                  this.userDialogVisible = false
                  this.isReset = false
                  this.$message({
                    message:'密码重置成功',
                    type:'success'
                  })
                  this.getTableData()


                } 
              })
   
          }else {
            //新增用户

            
            if(this.currentNode.memberType == "School") {
              this.$http.post(`/api/internal/schools/${this.currentNode.id}/users`,{
                username: this.userForm.account,
                password: this.userForm.pass,
                user: {
                  fullName: this.userForm.name,
                  phoneNumber: this.userForm.phoneNumber,
                  email: this.userForm.email
                },
                userRole: this.userForm.userRole
              })

              .then((data)=>{
                if(data.status == '200') {

                  this.userDialogVisible = false
                  this.$message({
                    message:'新增成功',
                    type:'success'
                  })
                  this.getTableData()


                }
                
              })
  

            }else {
              this.$http.post(`/api/internal/organizations/${this.currentNode.id}/users`,{
                username: this.userForm.account,
                password: this.userForm.pass,
                user: {
                  fullName: this.userForm.name,
                  phoneNumber: this.userForm.phoneNumber,
                  email: this.userForm.email
                },
                userRole: this.userForm.userRole
              })

              .then((data)=>{
                if(data.status == '200') {

                  this.userDialogVisible = false

                  this.$message({
                    message:'新增成功',
                    type:'success'
                  })

                  this.getTableData()


                } 
                
              })

            }
          }

        } else {
            return this.$message({
              message:'请检查输入的信息！',
              type:'error'
            })
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
          this.$http.delete(`/api/internal/users/${row.userId.id}`)
          .then((data)=>{
            if(data.status == '200') {

                this.$message({
                  message:'删除成功',
                  type:'success'
                })
                this.getTableData()


              } 
              
            })


        }else {
     
          let selectData = this.$refs.multipleTable.store.states.selection
          let ids = selectData.reduce((prev,current)=>{
            prev.push({id:current.userId.id})
            return prev
          },[])


          this.$http.delete(`/api/internal/users`,{},ids)
          .then((data)=>{
            if(data.status == '200') {

                
                this.$message({
                  message:'删除成功',
                  type:'success'
                })
                this.getTableData()


              } 
              
            })

        }
      })
    },

    lockUser(row) {
      this.$http.put(`/api/internal/users/${row.userId.id}/disable`)

      .then((data)=>{
        if(data.status == '200') {

            this.$message({
              message:'禁用成功',
              type:'success'
            })
            this.getTableData()


          } 
          
        })

    },

    UnLockUser(row) {
      this.$http.put(`/api/internal/users/${row.userId.id}/enable`)

      .then((data)=>{
        if(data.status == '200') {

            this.$message({
              message:'启用成功',
              type:'success'
            })
            this.getTableData()


          } 
          
        })

    }
  }

}
</script>

<style lang="less" scoped>
  .organozation{
	height: 100%;

  .input-class {
    width: 280px;
  }

  .wrap {

    height: calc(100vh - 200px);
    
    .search-class {
      width: 160px;
    }
    .table-wrap {

    }
      

  }


  .tree-wrap {
    height: calc(100vh - 240px);
    overflow-y: auto;
  }




  }
</style>
