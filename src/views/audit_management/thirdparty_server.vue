<template>
  <div class="typemana">
    <div class="typemana-wrap contener">
      <div class="right-header">
        <span>第三方服务配置管理</span>
        <el-button size="mini" style="margin-left: 20px;" @click="addTypeShow"><i class="el-icon-plus"></i> 添加</el-button>
      </div>
      <div class="table-warp" ref="table_warp">
        <el-table
          :data="tableData"
          style="width: 100%"
          height="100%"
          border>
          <el-table-column label="名称" prop="serverName"> </el-table-column>
          <el-table-column label="第三方服务类型" prop="type"> </el-table-column>
          <el-table-column label="IP" prop="ip"> </el-table-column>
          <el-table-column label="外网IP" prop="externalIp"> </el-table-column>
          <el-table-column label="端口" prop="port"> </el-table-column>
          <el-table-column label="状态" prop="enabledName"> </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="cursor: pointer">
                <i class="iconfont iconbianji iconclass" style="margin-right: 20px;" @click="editTypeDialog(scope.row)"></i>
                <i class="iconfont iconsuo icon-active"  v-if="!scope.row.enable" style="margin-right: 20px;" @click="updateEnabled(scope.row,'on')"></i>
                <i class="iconfont iconkaisuo icon-active" v-if="scope.row.enable" style="margin-right: 20px;" @click="updateEnabled(scope.row,'off')"></i>
                <i class="iconfont iconshanchu-copy icon-active" v-if="!scope.row.enable" style="margin-right: 20px;" @click="deleteType(scope.row)"></i>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
   </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogTypeVisible" width="450px" :close-on-click-modal='false'>
      <el-form :model="typeForm" :rules="rules" ref="typeForm" label-width="120px" size="small">
        
         <el-form-item label="名称" prop="serverName">
          <el-input  v-model="typeForm.serverName" type="text" maxlength="30" show-word-limit  class="input-class" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="第三方服务类型" prop="type">
          <el-select v-model="typeForm.type" class="input-class" placeholder="请选择类型">
              <el-option v-for="list in typeList" :label="list.name" :value="list.id" :key="list.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input  v-model="typeForm.ip" class="input-class" placeholder="请输入IP"></el-input>
        </el-form-item>
        <el-form-item label="外网IP" prop="externalIp">
          <el-input  v-model="typeForm.externalIp"  class="input-class" placeholder="请输入外网IP"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input  v-model="typeForm.port" type="number" max="65535" class="input-class" placeholder="请输入端口"></el-input>
        </el-form-item>
        <el-form-item label="鉴权账户" prop="account">
          <el-input  v-model="typeForm.account" type="text" maxlength="30" show-word-limit  class="input-class" placeholder="请输入鉴权账户"></el-input>
        </el-form-item>
        <el-form-item label="鉴权密码" prop="password">
          <el-input  v-model="typeForm.password" maxlength="30" class="input-class" show-password placeholder="请输入鉴权密码"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            class="input-class"
            :autosize="{ minRows: 2, maxRows: 4}"
            maxlength="200"
            show-word-limit
            placeholder="请输入描述"
            v-model="typeForm.description">
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTypeVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="addThirdPartServer">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
export default {
  data() {

    const IPV4_REG = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$(?::+(\\d+))?/;
    const ipValidator = (rule, value, callback) => {
      if(!IPV4_REG.test(value)) {
        callback(new Error('请输入正确的ip地址'));
      } else {
        callback();
      }
    }

    return {
      table_height:300,
      dialogTitle: '添加服务',
      dialogTypeVisible: false,
      typeForm:{
        serverName:'',
        type:'',
        ip:'',
        externalIp:'',
        port:'',
        account:'',
        password:'',
        description: ''
      },
      editCode:'',
      tableData: [],
      typeList:[{'id':'EBMS','name':'教育业务平台'}],
       rules: {
          serverName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          ip: [
            { required: true, message: '请输入IP', trigger: 'blur' },
            { validator: ipValidator, trigger: 'blur', }
          ],
          externalIp: [
            { required: true, message: '请输入外网IP', trigger: 'blur' },
            { validator: ipValidator, trigger: 'blur', }
          ],
          port: [
            { required: true, message: '请输入端口', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '请输入鉴权账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入鉴权密码', trigger: 'blur' },
            { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
          ]
        }
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

    addTypeShow() {
      this.dialogTitle = '添加服务'
      this.typeForm = {
        serverName:'',
        type:'',
        ip:'',
        externalIp:'',
        port:'',
        account:'',
        password:'',
        description: ''
      }
      this.dialogTypeVisible = true
      this.editCode = '';
    },

    // 编辑服务弹框
    editTypeDialog(row){
      this.dialogTitle = '编辑服务'
      this.dialogTypeVisible = true
      this.typeForm = {
        serverName:row.serverName,
        type:row.type,
        ip:row.ip,
        externalIp:row.externalIp,
        port:row.port,
        account:row.account,
        password:row.password,
        description: row.description
      }
      this.editCode = row.thirdPartyServerId.id;
    },
    
    
    // 获取类型列表 
    gettableData() {
        this.$http.get('/api/internal/thirdPartyServer/list',{})
        .then((result)=>{
          if(result.status == '200') {
            result.data.forEach(item=>{
              item.enabledName = item.enable ? '启用' :'停用'
            })
            this.tableData = result.data
          } 
        })
    },

    // 添加三方服务
    addThirdPartServer(){
      this.$refs['typeForm'].validate((valid) => {
          if (valid) {
            if(this.editCode) {
              this.$http.put(`/api/internal/thirdPartyServer/${this.editCode}`,{
                  serverName:this.typeForm.serverName,
                  type:this.typeForm.type,
                  ip:this.typeForm.ip,
                  externalIp:this.typeForm.externalIp,
                  port:this.typeForm.port,
                  account:this.typeForm.account,
                  password:this.typeForm.password,
                  description: this.typeForm.description
                }).then(res => {
                  this.dialogTypeVisible = false
                  this.editType = ""
                  this.gettableData()
              })
            } else {
                this.$http.post(`/api/internal/thirdPartyServer`,{
                    serverName:this.typeForm.serverName,
                    type:this.typeForm.type,
                    ip:this.typeForm.ip,
                    externalIp:this.typeForm.externalIp,
                    port:this.typeForm.port,
                    account:this.typeForm.account,
                    password:this.typeForm.password,
                    description: this.typeForm.description
                  }).then(res => {
                    // 添加成功回调
                    this.dialogTypeVisible = false
                    this.gettableData()
                })
            }
          } else {
            return false;
          }
      });
      
    },

    // 启用停用类型
    updateEnabled(row,status){
      this.$confirm('确定更新?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          if ( status === 'on'){
            this.$http.post(`/api/internal/thirdPartyServer/enable/${row.thirdPartyServerId.id}`,{})
              .then(res => {
                // 成功更新回调
                this.gettableData()
              })
          } else {
            this.$http.post(`/api/internal/thirdPartyServer/disable/${row.thirdPartyServerId.id}`,{})
              .then(res => {
                // 成功更新回调
                this.gettableData()
              })
          }  
      })
    },

    // 删除类型
    deleteType(row){
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
           this.$http.delete(`/api/internal/thirdPartyServer/${row.thirdPartyServerId.id}`,{})
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
