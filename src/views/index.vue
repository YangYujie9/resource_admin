<template>
  <div class="admini">
		<div class="header">
			<div class="header-left">
				<div style="display: flex;align-items: center;">
					<div class="circle"><i class="iconfont icontouxiang2 customclass"></i></div>


					<span style="margin-left: 20px;">{{getuserInfo.username}}</span>
				</div>
				
				
			</div>

			<p style="margin-left: 80px;">教育管理平台  > {{title}}</p>

			<el-button size="mini" type="text" style="position: absolute;right: 20px;top: 20px;color: #ffffff;" @click="exit()">退出登录</el-button>
		</div>

		<div class="content-wrap">
			<div class="content">
				<div class="left ">
					<div class="menu-wrap contener">
						<el-menu
					      :collapse="isCollapse"
					      :default-active="defaultActive"
					      class="el-menu-vertical-demo"
					      @select="handleSelect">
					      <el-submenu index="1">
					        <template slot="title">
					          <i class="el-icon-menu"></i>
					          <span>基础数据</span>
					        </template>
					        <el-menu-item-group>
					          
					          <el-menu-item index="/administrator/rolemanagement">角色管理</el-menu-item>
					          <!-- <el-menu-item index="/administrator/gradeManagement">学段年级</el-menu-item> -->
					          <el-menu-item index="/administrator/subjectManagement">学科管理</el-menu-item>
					          <el-menu-item index="/administrator/organizational">组织架构</el-menu-item>
					          <el-menu-item index="/administrator/classManagement">班级管理</el-menu-item>
					          <el-menu-item index="/administrator/userManagement">用户管理</el-menu-item>
					          <!-- <el-menu-item index="1-7">权限管理</el-menu-item> -->
					          <el-menu-item index="/administrator/siteManagement">站点管理</el-menu-item>
					          <el-menu-item index="/administrator/versionManagement">教材管理</el-menu-item>
					          <el-menu-item index="/administrator/knowledgePoint">知识点管理</el-menu-item>
					          <el-menu-item index="/administrator/textbookManagement">用书管理</el-menu-item>
					          <!-- <el-submenu index="4">
							        <template slot="title">
							          <span>章节知识</span>
							        </template>
							        <el-menu-item-group>
							          
							          <el-menu-item index="/administrator/chapterKnow">章节列表</el-menu-item>
							          <el-menu-item index="/administrator/knowledgePoint">知识点列表</el-menu-item>
						
							        </el-menu-item-group>
			
							      </el-submenu> -->
					          <!-- <el-menu-item index="">章节知识</el-menu-item> -->
					        </el-menu-item-group>
	
					      </el-submenu>
					      <el-submenu index="2">
					        <template slot="title">
					          <i class="el-icon-document"></i>
					          <span>审核管理</span>
					        </template>
					        <el-menu-item-group>
					          
					          <el-menu-item index="/administrator/passwordReview">申诉审核</el-menu-item>
					          <el-menu-item index="/administrator/resourceManagement">资源管理</el-menu-item>
					          <el-menu-item index="/administrator/questionManagement">题库管理</el-menu-item>
										<el-menu-item index="/administrator/correctionReview">题库纠错</el-menu-item>
					        </el-menu-item-group>
	
					      </el-submenu>
					      <el-submenu index="3">
					        <template slot="title">
					          <i class="el-icon-setting"></i>
					          <span>系统配置</span>
					        </template>
					        <el-menu-item-group>
					          
					          <el-menu-item index="/administrator/systemConfig">系统配置</el-menu-item>
					          <el-menu-item index="/administrator/questionType">题目类型配置</el-menu-item>
					          <el-menu-item index="/administrator/resourceType">资源类型配置</el-menu-item>
					          <el-menu-item index="/administrator/thirdPartyServer">第三方服务配置</el-menu-item>
					          <el-menu-item index="/administrator/systemLog">系统日志</el-menu-item>
				
					        </el-menu-item-group>
	
					      </el-submenu>

					    </el-menu>
					</div>

					<div class="collapse-class" :class="{collapseleft:isCollapse}"><i class="iconfont iconhengshuqiehuanshu" style="font-size: 26px;" @click="$store.commit('setisCollapse')"></i></div>
				</div>

				<div class="right">
          <router-view v-if="!$route.meta.keepAlive"></router-view>
			    <keep-alive>
			      <router-view v-if="$route.meta.keepAlive"></router-view>
			    </keep-alive>
				</div>
			</div>

			
		</div>
  </div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import Cookies from "js-cookie"
export default {

  data() {
    return {
      defaultActive: '/administrator/rolemanagement',
      title:'',
    };

  },
  computed: {
    
    ...mapGetters([
      'isCollapse',
      'getuserInfo'

    ]),

  },
  mounted() {
  	this.defaultActive = this.$route.fullPath
  	if(this.$route.fullPath.indexOf('rolemanagement')>-1 ||this.$route.fullPath.indexOf('subjectManagement')>-1||this.$route.fullPath.indexOf('organizational')>-1||this.$route.fullPath.indexOf('classManagement')>-1||this.$route.fullPath.indexOf('userManagement')>-1||this.$route.fullPath.indexOf('siteManagement')>-1||this.$route.fullPath.indexOf('versionManagement')>-1||this.$route.fullPath.indexOf('textbookManagement')>-1||this.$route.fullPath.indexOf('knowledgePoint')>-1) {
  		this.title = "基础管理"
  	}else if(this.$route.fullPath.indexOf('passwordReview')>-1 || this.$route.fullPath.indexOf('questionType')>-1||this.$route.fullPath.indexOf('resourceManagement')>-1
  	||this.$route.fullPath.indexOf('resourcePreview')>-1 ||this.$route.fullPath.indexOf('questionManagement')>-1 ||this.$route.fullPath.indexOf('questionCorrection')>-1 ||this.$route.fullPath.indexOf('correctionReview')>-1) {
  		this.title = "审核管理"
  	}else if (this.$route.fullPath.indexOf('systemConfig')>-1 || this.$route.fullPath.indexOf('resourceType')>-1
  				|| this.$route.fullPath.indexOf('thirdPartyServer')>-1){
  		this.title = "系统配置"

  	}
  	
  }, 
  methods: {

  	      //退出登录
      exit() {
      	this.$http.get(`/api/open/user/logout`)
      	.then((data)=>{
      		if(data.status == '200') {
						// let cookies = Cookies.get()
						// for(let key in cookies) {
						// 	Cookies.remove(key)
						// }

						Cookies.remove("resource-admin")

		        //this.$router.push('/login')
		        window.location.reload()
      		}
      	})




        
      },

        handleSelect(key, keyPath) {

            

            // if (key.indexOf('sale_report')>0 && (!this.$isInArray(37) && !this.$isInArray(38) && !this.$isInArray(39)&& !this.$isInArray(76)) ) {
            //     return this.$message({
            //       message: '您没有权限进入运营数据中心',
            //       type: 'error'
            //     });
            // }



            
            if(key.indexOf('rolemanagement')>-1 ||key.indexOf('subjectManagement')>-1||key.indexOf('organizational')>-1||key.indexOf('classManagement')>-1||key.indexOf('userManagement')>-1||key.indexOf('siteManagement')>-1||key.indexOf('versionManagement')>-1||key.indexOf('knowledgePoint')>-1||key.indexOf('textbookManagement')>-1) {
				  		this.title = "基础管理"
				  	}else if(key.indexOf('passwordReview')>-1 ||key.indexOf('resourceManagement')>-1
				  	||key.indexOf('resourcePreview')>-1 ||key.indexOf('questionManagement')>-1||key.indexOf('questionCorrection')>-1||key.indexOf('correctionReview')>-1 ){
				  		this.title = "审核管理"
				  	}else if (key.indexOf('systemConfig')>-1|| key.indexOf('questionType')>-1 || key.indexOf('resourceType')>-1
				  				|| key.indexOf('thirdPartyServer')>-1 || key.indexOf('systemLog')>-1){
				  		this.title = "系统配置"

				  	}

            if (key.indexOf('/')==0) {

               this.$router.push(key) 
            }

            

            
        
      }
  }
};

</script>

<style lang="less">
.admini {

	.inpucus {
    opacity: 0;
    background: red;
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    cursor: pointer;
    left: 240px;
    top: 0px;

    &.iupzinde {
        z-index: 1;
    }
	}
	.iconclass:hover {
		cursor: pointer;
	  color:#5a8bff;

	}
	.el-menu {
	  border-right: 0px;
	}
	.el-submenu__title {
		width: 200px;
	}
	.el-submenu .el-menu-item {
		height: 46px;
		line-height: 46px;
	}
	.el-menu-item-group__title {
		display: none;
	}
	.el-menu-item.is-active {

		background-color: #ecf5ff;
	}
	.el-table td {
		text-align: center;
	}
	.el-table th {
    font-size: 14px;
    font-weight: 500;
    background-color:#f5f7fc;
    text-align: center;
	}
	.contener {
		background-color:#ffffff;
		border-radius: 4px;
	  box-shadow: 0 2px 8px 0 rgba(32,39,51,.07);
	}

	.right-header {
		height: 60px;
		line-height: 60px;
		position: relative;
		// font-size: 1rem;
	}

	.tree-wrap {
		margin-top: 10px;
	}

	.pagination {

		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		// flex-wrap: wrap;
		left: 20px;
		right: 20px;
		bottom:20px;
	}


	.input-wrap {
		display: flex;
		align-items: center;
		margin-bottom: 20px;

		.label-class {
			width: 100px;
			text-align: right;
			margin-right: 10px;
		}

		.require-class {
			color: red;
		}
	}


	//单选框组

	.radio-button {
		.el-radio-button__inner {
			border: 0px;
		}
		.el-radio-button__orig-radio:checked+.el-radio-button__inner {
			color:#409eff;
			background-color:transparent;
			border-color:transparent;
			box-shadow: 0px 0 0 0 #409EFF;
		}
		.el-radio-button:first-child .el-radio-button__inner {
			border-left: 0px;
		}
	}



	.icon-active {
		&:hover {

      cursor: pointer;
      color: #409eff;
      
		}
	}


	.el-table__header tr,
	  .el-table__header th {
	    padding: 0;
	    height: 46px;
	}
	.el-table__body tr,
	  .el-table__body td {
	    padding: 0;
	    height: 40px;
	}


	.el-card .qt1 img {
    vertical-align: middle;
    float: right;
    max-height: 200px;
    width: auto;
  }

	// el-radio-button el-radio-button--small is-active"{}
}

</style>
<style lang="less">
  .form-class {
    .el-radio-button__inner {
      border-left: 1px solid #b3d8ff;
      border-radius: 3px;
      color: #409eff;
      background: #ecf5ff;
      border-color: #b3d8ff;

      &:hover {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      -webkit-box-shadow: 0px 0 0 0 #409eff;
      box-shadow: 0px 0 0 0 #409eff;
    }
    .el-radio-button:first-child .el-radio-button__inner,
    .el-radio-button:last-child .el-radio-button__inner {
      // border-left: 1px solid #b3d8ff;
      border-radius: 3px;
    }


    .el-radio-button__orig-radio:disabled:checked+.el-radio-button__inner {
      background-color: #409eff;
      color: #ffffff;
    }
  }
</style>
<style lang="less" scoped>
.admini {

	min-width: 1300px;
	
	.header {
		height: 72px;
		line-height: 72px;
		background-color: #5a8bff;
		color: #ffffff;
		display: flex;


		&-left {
			width: 260px;
			background-color:#5182f4;
			padding: 0 20px 0 40px;
			display: flex;
			align-items:center;
			justify-content: space-between;

			.circle {
				width: 46px;
				height: 46px;
				border-radius:50%;
				background-color:#ffffff;
				text-align: center;
				line-height: 46px;

				.customclass {
					color: #5182f4;
					font-size: 24px;
				}
			}
		}
	}

	.content-wrap {
		background-color:#f0f3fa;
		height: calc(100vh - 72px);
		
		.content {
			padding: 20px;
			height: 100%;
			display: flex;

			.left {
				position: relative;
				//padding-bottom: 10px;

				.menu-wrap {
					//width: 200px;
					max-height: 90%;
    			overflow-y: auto;
    			overflow-x: hidden;
    			padding-bottom: 10px;

    		}

    		.collapse-class {

    			position: absolute;
    			bottom: 2%;
    			width: 40px;
    			height: 40px;
    			line-height: 40px;
    			font-size: 30px;
    			left: 80px;
    			text-align: center;
    			cursor: pointer;
    			background-color: #ffffff;
    			border-radius: 6px;
    			box-shadow: 0 2px 8px 0 rgba(32,39,51,.07);
    			transition: left 0.5s;
    		}
    		.collapseleft {
    			left: 10px;
    		}

				
			}

			.right {
				// width: 100%;
				flex: 1;
        width: calc(100vw - 300px);
				margin-left: 20px;
			}
		}




	}
}
</style>