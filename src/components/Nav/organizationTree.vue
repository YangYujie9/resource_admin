<template>
	<div class="school-select">

		<div class="school-select-wrap" :class="{hiddenclass:isHidden}">

			<div class="aside-class"  @click="isHidden = !isHidden" >
				<i class="iconfont iconxiangzuo1 aside-icon" v-show="!isHidden"></i>
				<i class="iconfont iconxiangyou2 aside-icon" style="top: 16%;" v-show="isHidden"></i>
			</div>

			<div v-if="!isHidden">
		    <p class="right-header">组织架构 </p>
		    <el-input v-model="filterText" placeholder="请输入组织名称开始搜索..." suffix-icon="el-icon-search" size="mini"></el-input>
		    <div class="tree-wrap">
		      <basicTree :tree-data="data" :filterText="filterText" :enableEdit="enableEdit" :orgSelectable="orgSelectable" :defaultRoot="defaultRoot" @selectnode="handleNodeClick" @handleNodeClick="handleNodeClick" @editnode="editNode" @appendnode="appendNode" @deletenode="deleteNode"></basicTree>
		    </div>
	    </div>

	    <div v-if="isHidden" class="hidden-wrap">
	    	<div>组织架构</div>
	    </div>
    </div>


    <el-dialog :title="orgDialogTitle" :visible.sync="orgDialogVisible" width="500px" :close-on-click-modal='false'>
      <el-form :model="orgForm"  size="small" label-width="100px" :show-message='false'>
        <el-form-item label="节点类型">
          <el-select v-model="orgForm.type" placeholder="请选择" class="input-class" :disabled="isEdit">
            <el-option label="组织" value="Organization"></el-option>
            <el-option label="学校" value="School"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="orgForm.type ==='Organization' ? '组织名称' : '学校名称'" prop="name" :required="true">
          <el-input v-model="orgForm.name" placeholder="请输入名称"  class="input-class"></el-input>
        </el-form-item>
        <el-form-item label="学校学段" prop="description" v-show="orgForm.type ==='School'"
        >
          <el-select v-model="orgForm.learningSection" placeholder="请选择"  class="input-class" :disabled="isEdit">
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
    </el-dialog>
	</div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'
  import basicTree from '@/components/Tree/basicTree'

export default {
	props: {
		enableEdit: {
			type: Boolean,
			default: false
		},
		orgSelectable: {
			type: Boolean,
			default: false
		},
		defaultRoot: {
			type: Boolean,
			default: false
		},

	},
  data() {

    return {
    	filterText:'',
    	data:[],
    	currentNode:'',
    	isHidden: false,
    	orgDialogVisible: false,
    	orgDialogTitle: '添加节点',
      orgForm: {
        type:'Organization',
        name: '',
        learningSection: '',
        description: ''
      },
      isEdit:false,




    }
  },
  components: {
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



    this.getOrgTree()



  },
  methods: {

    // 获取组织架构树
    getOrgTree(){
      this.$http.get(`/api/internal/organizations/tree`)
      .then((data)=>{
        if(data.status == '200') {

          this.data = data.data


        } 
        
      })


    },



    handleNodeClick(data) {
    	this.$emit('handleCheckNode',data)
    },
    editNode(node,data) {
    	this.isEdit = true
      this.showOrgDialog(data,true)
    },

    appendNode(node,data) {
    	this.false = true
      this.showOrgDialog(data, false)
    },
    // 删除组织/删除学校
    deleteNode(node,data) {
      this.$confirm('确认删除该节点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {


        let id = node.data.resourceId.id

        if(node.data.memberType == 'Organization') {
          this.$http.delete(`/api/internal/organizations/${id}`)
          .then((data)=>{
            if(data.status == '200') {


              this.$message({
                message:'删除成功',
                type:'success'
              })

              this.getOrgTree()


            } 
            
          })

        }else {
          this.$http.delete(`/api/internal/schools/${id}`)
          .then((data)=>{
            if(data.status == '200') {


              this.$message({
                message:'删除成功',
                type:'success'
              })

              this.getOrgTree()


            } 
            
          })
        }
        

      })
    },
        // 显示添加组织弹窗
    showOrgDialog(val,flag){
      // flag 判断编辑添加
      this.selectId = val.resourceId.id
      val.memberType == "School"?this.selectParentId = val.parentId.id:null
      

      if(flag){
        //编辑
        this.orgDialogTitle = '编辑节点'

        if(val.memberType == 'School') {
          this.$http.get(`/api/internal/schools/${this.selectId}`)
          .then((data)=>{

            if(data.status == '200') {

              this.orgForm.name = data.data.schoolName
              this.orgForm.type = val.memberType
              this.orgForm.learningSection = data.data.learningSection
              this.orgForm.description = data.data.description
              this.isEdit = true
              this.orgDialogVisible = true

            } 
          })
        }else {
          this.orgForm.name = val.name
          this.orgForm.type = val.memberType
          this.orgForm.description = val.description
          this.isEdit = true
          this.orgDialogVisible = true
        }


      }else {
        this.orgDialogTitle = '添加节点'
        this.orgForm.type = 'Organization'
        this.orgForm.name = ''
        this.orgForm.learningSection = ''
        this.orgForm.description = ''
        this.isEdit = false
        this.orgDialogVisible = true
      }
      
      
    },

    // 添加组织/添加学校
    addOrg () {
      if(!this.orgForm.name) {
        return this.$message({
          message: '名称不能为空',
          type: 'warning'
        })
      }


      if(this.orgForm.type == 'Organization') {
        //编辑组织
        if(this.isEdit) {

          

          this.$http.put(`/api/internal/organizations/${this.selectId}`,{
            name: this.orgForm.name,
            description: this.orgForm.description
          })  
          .then((data)=>{
            if(data.status == '200') {

              this.orgDialogVisible = false
              this.selectId = ''

              this.$message({
                message:'修改成功',
                type:'success'
              })

              this.getOrgTree()


            } 
            
          })


        }else {
          //添加组织
          this.$http.post(`/api/internal/organizations/${this.selectId}/organizations`,{
            name: this.orgForm.name,
            description: this.orgForm.description
          })  
          .then((data)=>{
            if(data.status == '200') {

              this.orgDialogVisible = false
              this.selectId = ''

              this.$message({
                message:'添加成功',
                type:'success'
              })

              this.getOrgTree()


            } 
            
          })



        }


      }
      // 学校
      else {
        //编辑学校

        if(!this.orgForm.learningSection) {
          return this.$message({
            message: '学段不能为空',
            type: 'warning'
          })
        }
        if(this.isEdit) {
         

          this.$http.put(`/api/internal/schools/${this.selectId}`,{
            organizationId: this.selectParentId,
            schoolName: this.orgForm.name,
            description: this.orgForm.description,
          })  
          .then((data)=>{
            if(data.status == '200') {
              this.selectId = ''
              this.orgDialogVisible = false

              this.$message({
                message:'修改成功',
                type:'success'
              })

              this.getOrgTree()


            } 
            
          })



        }else {
          //添加学校

          this.$http.post(`/api/internal/schools`,{
            organizationId: this.selectId,
            schoolName: this.orgForm.name,
            description: this.orgForm.description,
            learningSection: this.orgForm.learningSection,
          })  
          .then((data)=>{
            if(data.status == '200') {

              this.orgDialogVisible = false

              this.$message({
                message:'添加成功',
                type:'success'
              })

              this.getOrgTree()


            } 
            
          })



        }


      }

      
      
    },


  }
}
</script>

<style lang="less" scoped>
.school-select {
	height: 100%;

	.school-select-wrap {
		height: 100%;
		width: 300px;
		padding: 0 20px;
		position: relative;
		transition: width 0.2s;

		&:hover {
			.aside-class {
				// display: block;
				visibility: visible;
      	opacity: 1;
			}
		}

		.aside-class {
			position: absolute;
			width: 16px;
			height: 50px;
			border-radius: 5px 0 0 5px;
			background-color: #e9ebef;
			right: 0px;
			top: 46%;
			cursor: pointer;
			// padding-top: 16px;
			transition: all 0.5s;
			opacity: 0;
      visibility: hidden;


			.aside-icon {
				color: #ffffff;
				position: relative;
				top: 30%;
				
			}
		}

	  .tree-wrap {
	    height: calc(100vh - 240px);
	    overflow-y: auto;
	  }
	}


	.hiddenclass {
		// width: 40px;
		width: 52px;
		line-height: 32px;
		animation: foldSider .2s ease-in-out;
		.hidden-wrap {
			padding-top: 20px;

		}
	}

  .input-class {
    width: 280px;
  }


}
</style>