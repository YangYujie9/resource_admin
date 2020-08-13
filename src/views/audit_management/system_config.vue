<template>
  <div class="system">
    <rightNav>
      <div slot="left">
        <p class="right-header">站点管理 </p>
        <div class="meau-wrap">
          <ul>
            <li v-for="list in meauList" :class="{activemeau:list.check}" @click="changeType(list)">{{list.label}}</li>
          </ul>
        </div>



 
      
      </div>
      <div slot="right">
        <p class="right-header">{{title}} </p>

        <div v-show="title=='自动审核设置'">
        

          <el-radio-group v-model="automaticCheck" @change="setVerifyConfiguration">
            <el-radio-button label="1" >是</el-radio-button>
            <el-radio-button label="0" >否</el-radio-button>

          </el-radio-group>
        </div> 
        <div class="wrap" v-show="title=='题目难度设置'">
<!--           <ul>
          	<li v-for="list in difficultyList" :key="list.key">
          		<p style="width: 100px;">{{list.value}}</p>
          		<p>{{list.description}}</p>
          	</li>
          </ul> -->

				  <el-table
				    :data="difficultyList"
				    border
				    style="width: 100%">
				    <el-table-column
				      type="index"
				      width="100px"
				      label="序号">
				    </el-table-column>
				    <el-table-column
				      prop="value"
				      label="难度">
				    </el-table-column>
				    <el-table-column
				      prop="description"
				      label="难度比例">
				    </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                  <i class="iconfont iconbianji icon-active" @click="editDifficulty(scope.row)"></i>

              </template>
            </el-table-column>
				  </el-table>

        </div>

        <el-dialog
          title="编辑难度"
          :visible.sync="dialogVisible"
          width="500px">
          <div class="class-wrap">
            <el-form :model="difficulty" size="small" label-width="100px">

              <el-form-item label="难度" prop="value">
                <el-input v-model="difficulty.value"  class="input-class" placeholder="请输入" disabled></el-input>
              </el-form-item>
              <el-form-item label="比例" prop="description">
                <el-input v-model.number="difficulty.description"  class="input-class" placeholder="请输入" autocomplete="off"></el-input>
              </el-form-item>



            </el-form>

          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="setDifficultyConfig" size="mini">确 定</el-button>
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
      automaticCheck:'',
      difficultyList: [],
      dialogVisible: false,
      difficulty: {
      	key: '',
      	value:'',
      	description:''
      },
      meauList: [{
          label:'自动审核设置',
          check: true
        },{
          label:'题目难度设置',
          check: false
        }
      ],
      title:'自动审核设置'





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

    this.getVerifyConfiguration()
    this.getDifficultyConfig()



  },
  methods: {
    changeType(list) {
      this.meauList.forEach(item=>{
        item.check = false
      })

      list.check = true
      this.title = list.label
    },
  	getVerifyConfiguration() {

		  this.$http.get(`/api/internal/configuration/configs/VerifyConfiguration`)
      .then((data)=>{
        if(data.status == '200') {


        	this.automaticCheck = data.data.configItems[0].value


          } 
          
        })

  	},

  	setVerifyConfiguration() {

  		let data = []

  		data.push({key:"auto", value:this.automaticCheck})

		  this.$http.put(`/api/internal/configuration/configs/VerifyConfiguration`,data)
      .then((data)=>{
        if(data.status == '200') {

        		this.getVerifyConfiguration()

		        this.$message({
	            message:'自动审核修改成功',
	            type:'success'
	          })
          } 
          
        })

  	},


  	getDifficultyConfig() {


  		this.difficultyList = []


		  this.$http.get(`/api/internal/configuration/configs/DifficultyConfiguration`)
      .then((data)=>{
        if(data.status == '200') {

        	this.difficultyList = data.data.configItems


          } 
          
        })

  	},
  	editDifficulty(row) {

  		this.difficulty.key = row.key
  		this.difficulty.value = row.value
  		this.difficulty.description = row.description
  		this.dialogVisible = true

  	},

  	setDifficultyConfig() {
  		if(!this.difficulty.description) {
        return this.$message({
          message: '题目难度不可以为空',
          type:'warning'
        })
  		}
  		if(typeof this.difficulty.description != "number") {
        return this.$message({
          message: '题目难度必须为数字',
          type:'warning'
        })
  		}

  		let data = []

  		data.push({key: this.difficulty.key,
  			value: this.difficulty.value,
  			description: this.difficulty.description
  		})

		  this.$http.put(`/api/internal/configuration/configs/DifficultyConfiguration`,data)
      .then((data)=>{
        if(data.status == '200') {

        		this.dialogVisible = false
		        this.$message({
	            message:'修改成功',
	            type:'success'
	          })

	          this.getDifficultyConfig()
          } 
          
        })
      


  	},





  }
}
</script>
<style lang="less">
.system {

	.el-radio-group {
		width: 400px;
	}

	.el-radio-button {
		width: 100%;
		position: relative;
    height: 40px;
    margin-bottom: 16px;
    border-radius: 4px;
    border: 1px solid #d8dbe4;
    overflow: hidden;
    cursor: pointer;
	}
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  	color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
  }
	.el-radio-button__inner {
		width: 100%;
		height: 100%;
    // height: 42px;
    text-align: left;
    // font-size: 14px;
    background: #f6f7fa;
    overflow: hidden;
    // cursor: pointer;
	}
}

</style>
<style lang="less" scoped>
 .system{
  height: 100%;

  .input-class {
    width: 280px;
  }

  .meau-wrap {
    height: calc(100vh - 240px);
    overflow-y: auto;
    padding-left: 20px;

    .activemeau {
      color:#409EFF;
    }

    ul li {
      height: 40px;
      cursor: pointer;

      &:hover {
        color:#409EFF;
      }
    }
  }
  .wrap {


    height: calc(100vh - 200px);
    // background-color: red;
  	ul {
  		li {
  			line-height: 32px;
  			height: 32px;
  			display: flex;
  		}
  	}


  }
}
</style>
