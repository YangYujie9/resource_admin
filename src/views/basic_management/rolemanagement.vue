<template>
  <div class="rolemana">
    <div class="rolemana-wrap contener">
      <div class="right-header">
        <span>角色管理 </span>
        <!-- <el-button size="mini" style="margin-left: 20px;" @click="addUserShow" type="primary"><i class="el-icon-plus"></i> 添加</el-button> -->
      </div>
      <div class="table-warp" ref="table_warp">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        border>
		    <el-table-column
		      type="selection"
		      width="55"
		      align="center">
		    </el-table-column>
        <el-table-column
          label="角色名称"
          prop="name">
        </el-table-column>
        <el-table-column
          prop="username"
          label="角色类型">
          <template slot-scope="scope">
            {{getRoleName(scope.row.roleType)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="备注"
          show-overflow-tooltip>
        </el-table-column>
<!--         <el-table-column
          prop=""
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="cursor: pointer">
              <i class="iconfont iconbianji iconclass" style="margin-right: 20px;" @click="editUserDialog(scope.row)"></i>
              <i class="iconfont iconshanchu-copy iconclass" @click="deleteUser(scope.row)"></i>
            </span>
          </template>
        </el-table-column> -->
      </el-table>


      </div>
<!--       <div class="pagination">
        <div>
          <el-checkbox v-model="checked" @change="toggleSelection">全选</el-checkbox>
          <el-button type="text" @click="deleteUser" style="margin-left: 20px;">删除</el-button>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="10"
          layout="total, prev, pager, next, sizes , jumper"
          :total="total">
        </el-pagination>
      </div> -->
    </div>


    <el-dialog :title="dialogTitle" :visible.sync="dialogUserVisible" width="400px" :close-on-click-modal='false'>
      <el-form :model="userForm" label-width="80px" size="small">
        <el-form-item label="角色类型" prop="userRole">
          <el-select v-model="userForm.userRole" placeholder="请选择" class="input-class" @change="getroleNameList">
            <el-option v-for="list in roleList" :label="list.label" :key="list.value" :value="list.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="userRole">
          <el-select v-model="userForm.userRolename" placeholder="请选择" class="input-class">
            <el-option v-for="list in roleNameList" :label="list.name" :key="list.id" :value="list.name"></el-option>
          </el-select>
          <!-- <el-input  v-model="userForm.userRolename"  class="input-class"></el-input> -->
        </el-form-item>


        <el-form-item label="描述信息">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            class="input-class"
            v-model="userForm.description">
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="addOrgUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      table_height:300,
      dialogTitle: '添加角色',
      dialogUserVisible: false,
      userForm:{
        userRole:'',
        userRolename: '',
        description:''
      },
      editUserId:'',
      data: [],
      tableData: [],
      roleList: [{
        label:'后台运维',
        value:'BackstageOperation'
      },{
        label:'校领导',
        value:'SchoolLeaders'
      },{
        label:'区域领导',
        value:'AreaLeaders'
      },{
        label:'用户',
        value:'OrdinaryUsers'
      }],
      roleNameList: [],


    }
  },
  watch: {

  },
  computed: {
    
    ...mapGetters([
      'getuserInfo',

    ]),

  },
  mounted() {

      this.gettableData()

  },
  methods:{
    toggleSelection(flag) {
      if (flag) {
        this.tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.getOrgAdminList()
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getOrgAdminList()
    },

    getRoleName(id) {
      let name = ""
      this.roleList.forEach(item=>{
        item.value == id? name = item.label:null
      })
      return name
    },

    addUserShow() {
      this.dialogTitle = '添加角色'
      this.editUserId = ''
      this.userForm.userRolename = ''
      this.userForm.userRole = ''
      this.userForm.description = ''
      this.dialogUserVisible = true
    },

         // 编辑角色弹框
    editUserDialog(row){
      this.dialogTitle = '编辑角色'
      this.editUserId = row.roleId.id
      this.dialogUserVisible = true
      this.userForm.userRolename = row.name
      this.userForm.userRole = row.roleType
      this.userForm.description = row.description
      this.getroleNameList('editShow')
    },
    
    
    // 获取角色列表 
    gettableData() {
        this.$http.get('/api/internal/role-permission/roles')
        .then((data)=>{
          if(data.status == '200') {
            this.tableData = data.data
          } 
        })
  
    },

    // 添加角色
    addOrgUser(){
      if(!this.userForm.userRolename) {
        return this.$message({
          message:'角色名不可以为空',
          type:'warning'
        })
      }
      if(!this.userForm.userRole) {
        return this.$message({
          message:'角色类型不可以为空',
          type:'warning'
        })
      }
      if(this.editUserId) {
    
            this.$http.put(`/api/internal/role-permission/roles/${this.editUserId}`,{
                name: this.userForm.userRolename,
                roleType:this.userForm.userRole,
                description:this.userForm.description,
              }
            ).then(res => {
              this.dialogUserVisible = false
              this.editUserId = ""
              this.gettableData()
            })
  
      }else {
     
          this.$http.post(`/api/internal/role-permission/roles`,{
              name: this.userForm.userRolename,
              roleType:this.userForm.userRole,
              roleCode:this.userForm.userRole,
              description:this.userForm.description,
            }).then(res => {
            // 添加角色成功回调
            this.dialogUserVisible = false
            this.gettableData()
          })

      }
    },


    getroleNameList(name) {
      this.roleNameList = []
      // this.userForm.userRolename = ''

      if(this.userForm.userRole) {
        this.$http.get(`/api/open/common/userRole/${this.userForm.userRole}`)
        .then(data=>{
          if(data.status == '200') {
            this.roleNameList = data.data
            this.userForm.userRolename = name=='editShow'? this.userForm.userRolename :''
            // this.userForm.userRolename = this.roleNameList.length? this.roleNameList[0].id:''
          }
        })
      }
      
    },
    // 删除角色
    deleteUser(row){
      this.$confirm('确定删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let userId = ''
        if(row){
          userId = userId.id
        }else {
          // 批量删除
        }
        this.$http.delete(`/api/internal/role-permission/roles/${row.roleId.id}`)
        .then(res => {
          // 成功删除角色回调
          this.gettableData()
        })
      })
    },


  }
};
</script>

<style lang="less" scoped>
  .rolemana{
	height: 100%;

		&-wrap {
			height: 100%;
			padding: 0px 20px;
			position:relative;

			.table-warp {
				height: calc(100% - 100px);
			}


		}


    .input-class {
      width: 240px;
    }
  }
</style>
