<template>
  <div class="typemana">
    <div class="typemana-wrap contener">
      <div class="right-header">
        <span>资源类型管理 </span>
        <el-button size="mini" style="margin-left: 20px;" @click="addTypeShow"><i class="el-icon-plus"></i> 添加</el-button>
      </div>
      <div class="table-warp" ref="table_warp">
      <el-table
        :data="tableData"
        style="width: 100%"
        :height="table_height"
        border>
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column label="标示" prop="code"> </el-table-column>
        <el-table-column label="名称" prop="name"> </el-table-column>
        <el-table-column label="状态" prop="enabledName"> </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="cursor: pointer">
              <i class="iconfont iconbianji iconclass" style="margin-right: 20px;" @click="editTypeDialog(scope.row)"></i>
              <i class="iconfont iconsuo icon-active"  v-if="!scope.row.enabled" @click="updateEnabled(scope.row)"></i>
              <i class="iconfont iconkaisuo icon-active" v-if="scope.row.enabled" @click="updateEnabled(scope.row)"></i>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">   
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


    <el-dialog :title="dialogTitle" :visible.sync="dialogTypeVisible" width="400px" :close-on-click-modal='false'>
      <el-form :model="typeForm" label-width="80px" size="small">
        
        <el-form-item label="名称" prop="name">
          <el-input  v-model="typeForm.name"  class="input-class"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTypeVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="addResourceType">确 定</el-button>
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
      dialogTitle: '添加类型',
      dialogTypeVisible: false,
      typeForm:{
        code:'',
        name: ''
      },
      search: {
        name:'',
        page:1,
        size:10
      },
      total:0,
      editCode:'',
      tableData: []

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
      this.$nextTick(()=>{
        this.table_height = this.$refs.table_warp.offsetHeight - 20
      })

      this.gettableData()

    window.onresize = () => {
      this.table_height = this.$refs.table_warp.offsetHeight - 20
    }
  },

  destroyed(){
    window.onresize = null;
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
      this.search.size = val
      this.gettableData()
    },
    // 分页
    handleCurrentChange(val) {
      this.search.page = val
      this.gettableData()
    },

    addTypeShow() {
      this.dialogTitle = '添加类型'
      this.typeForm.name = ''
      this.typeForm.code = ''
      this.dialogTypeVisible = true
      this.editCode = '';
    },

         // 编辑类型弹框
    editTypeDialog(row){
      this.dialogTitle = '编辑类型'
      this.dialogTypeVisible = true
      this.typeForm.name = row.name
      this.typeForm.code = row.code
      this.editCode = row.code;
    },
    
    
    // 获取类型列表 
    gettableData() {
      let params = {
          name: this.search.name,
          page: this.search.page - 1,
          size: this.search.size,
        }
        this.$http.get('/api/internal/resourceType',params)
        .then((result)=>{
          if(result.status == '200') {
            result.data.content.forEach(item=>{
              item.enabledName = item.enabled ? '启用' :'停用'
            })
            this.tableData = result.data.content
            this.total = result.data.totalElements;
          } 
        })
    },

    // 添加角色
    addResourceType(){
      if(!this.typeForm.name) {
        return this.$message({
          message:'名称不可以为空',
          type:'warning'
        })
      }
      if(this.editCode) {
            this.$http.put(`/api/internal/resourceType/${this.editCode}`,{
                name: this.typeForm.name
              }).then(res => {
                this.dialogTypeVisible = false
                this.editType = ""
                this.gettableData()
            })
  
      } else {
          this.$http.post(`/api/internal/resourceType`,{
              name: this.typeForm.name,
              code: this.typeForm.code
            }).then(res => {
              // 添加成功回调
              this.dialogTypeVisible = false
              this.gettableData()
          })

      }
    },

    // 启用停用类型
    updateEnabled(row){
      this.$confirm('确定更新?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.put(`/api/internal/resourceType/${row.code}/enabled`,{})
          .then(res => {
            // 成功更新回调
            this.gettableData()
          })
      })
    },


  }
};
</script>

<style lang="less" scoped>
  .typemana{
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
