<template>
  <div class="site">
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
      	<div class="content-wrap" ref="content_wrap">
      		<div  v-show="title=='站点信息'">
		      	<p class="right-header">站点信息  </p>
						
						<el-form :model="site" label-width="100px" size="small">
						  <el-form-item label="站点标题：">
						    <el-input v-model="site.name" class="input-div"></el-input>
						  </el-form-item>
						  <el-form-item label="站点版权：">
								<el-input v-model="site.copyright" class="input-div"></el-input>
						  </el-form-item>
						  <el-form-item label="ICP备案号：">
								<el-input v-model="site.icp" class="input-div"></el-input>
						  </el-form-item>

						  <el-form-item label="公安备案号：">
						    <el-input v-model="site.police" class="input-div"></el-input>
						  </el-form-item>
						  <el-form-item label="网站LOGO：">
								<div class="logo-div">
									<div class="logo-div-left">
										<img :src="site.picture" alt="" width="110px" height="30px">
										<div>
											<el-button size="mini" type="primary" style="position: relative;">上传
												<input style="left:0px" type="file" class="inpucus cursor" @change="tirggerFile($event,'picture')" />
											</el-button>
											<el-button size="mini" type="primary" @click="deleteFile('picture')">删除</el-button>
										</div>
										
									</div>
									<div class="logo-div-right">请上传jpg,gif,png格式的图片。logo图片尺寸建议不超过250 x 50px。图片大小建议不超过2MB</div>	
								</div>
						  </el-form-item>
						  <el-form-item label="浏览器图标：">
								<div class="logo-div">
									<div class="logo-div-left">
										<img :src="site.icon" alt="" width="110px" height="30px">
										<div>
											<el-button size="mini" type="primary" style="position: relative;">上传
												<input style="left:0px" type="file" class="inpucus cursor" @change="tirggerFile($event,'icon')" />
											</el-button>
											</el-button>
											<el-button size="mini" type="primary" @click="deleteFile('icon')">删除</el-button>
										</div>
										
									</div>
									<div class="logo-div-right">建议上传icon格式的图标文件，支持ico，jpg，gif，png等格式，建议尺寸32 x 32px。</div>	
								</div>
						  </el-form-item>
<!-- 						  <el-form-item label="校本LOGO：">
								<div class="logo-div">
									<div class="logo-div-left">
										<img src="@/assets/images/logo1.png" alt="" width="110px" height="30px">
										<div>
											<el-button size="mini" type="primary">上传</el-button>
											<el-button size="mini" type="primary">删除</el-button>
										</div>
										
									</div>
									<div class="logo-div-right">请上传jpg,gif,png格式的图片。logo图片尺寸建议不超过250 x 50px。图片大小建议不超过2MB</div>	
								</div>
						  </el-form-item> -->
						</el-form>

						<div style="text-align: center;margin-top: 30px;">
							<el-button size="mini" type="primary" @click="setStieInfo">保存</el-button>
						</div>

					</div>


					<div  v-show="title=='导航栏目'" style="padding-bottom: 20px">
						<div class="">
			        <div class="right-header">
			          <span>顶部导航 </span>
			          <el-button size="mini" style="margin-left: 20px;" @click="addDialogshow('TopNavigationBar')"><i class="el-icon-plus"></i> 新增顶部导航</el-button>
			        </div>
				      <el-table
	              :data="topData"
	              border>
	              <el-table-column
                	label="序号"
              		width="100px"
	                type="index">
	              </el-table-column>
	              <el-table-column
	                  label="导航标题"
	                  prop="navigationName">
	                </el-table-column>
	              <el-table-column
	                prop="状态"
	                label="账号">
	                <template slot-scope="scope">
	                	{{scope.row.enabled?"启用":"禁用"}}
	                </template>
	              </el-table-column> 
	              <el-table-column
	                prop=""
	                label="操作">
	                <template slot-scope="scope">
	                  <div style="cursor: pointer;width: 100%;display: flex;justify-content: space-around;">
	                    <i class="iconfont iconbianji icon-active" @click="editDialog(scope.row)"></i>
                      <i class="iconfont iconsuo icon-active" style="" v-if="!scope.row.enabled" @click="UnLockNav(scope.row)"></i>
                    	<i class="iconfont iconkaisuo icon-active" v-if="scope.row.enabled" @click="lockNav(scope.row)"></i>
                    	<i class="iconfont iconshang-copy icon-active" :class="{hide:scope.$index==0}" @click="upsort(scope.row,scope.$index)"></i>

                    	<i class="iconfont iconxia icon-active" :class="{hide:scope.$index==topData.length-1}" @click="downsort(scope.row,scope.$index)"></i>
	                  </div>
	                </template>
	              </el-table-column>
	            </el-table>
			      </div>	

			      <div class="">
			        <div class="right-header">
			          <span>分类栏目 </span>
			          <el-button size="mini" style="margin-left: 20px;" @click="addDialogshow('SubjectCatalog')"><i class="el-icon-plus"></i> 新增分类栏目</el-button>
			        </div>
				      <el-table
	              :data="cateageData"
	              border>
	              <el-table-column
                	label="序号"
              		width="100px"
	                type="index">
	              </el-table-column>
	              <el-table-column
	                  label="导航标题"
	                  prop="navigationName">
	                </el-table-column>
	              <el-table-column
	                prop="状态"
	                label="账号">
	                <template slot-scope="scope">
	                	{{scope.row.enabled?"启用":"禁用"}}
	                </template>
	              </el-table-column> 
	              <el-table-column
	                prop=""
	                label="操作">
	                <template slot-scope="scope">
	                  <div style="cursor: pointer;width: 100%;display: flex;justify-content: space-around;">
	                    <i class="iconfont iconbianji icon-active" @click="editDialog(scope.row)"></i>
                     	<i class="iconfont iconsuo icon-active" style="" v-if="!scope.row.enabled" @click="UnLockNav(scope.row)"></i>
                    	<i class="iconfont iconkaisuo icon-active" v-if="scope.row.enabled" @click="lockNav(scope.row)"></i>
                    	<i class="iconfont iconshang-copy icon-active" :class="{hide:scope.$index==0}" @click="upsort(scope.row,scope.$index)"></i>

                    	<i class="iconfont iconxia icon-active" :class="{hide:scope.$index==cateageData.length-1}" @click="downsort(scope.row,scope.$index)"></i>
	                  </div>
	                </template>
	              </el-table-column>
	            </el-table>
			      </div>	
						


					</div> 

<!-- 					<div  v-show="title=='导航栏目'" style="padding-bottom: 20px;" >
						<div class="meau-table" ref="meau_table">
			        <div class="right-header">
			          <span>顶部导航 </span>
			          <el-button size="mini" style="margin-left: 20px;" @click="addDialogshow('TopNavigationBar')"><i class="el-icon-plus"></i> 新增顶部导航</el-button>
			        </div>
			        
					      <el-table
		              :data="topData"
		              :height="table_height"
		              border>
		              <el-table-column
  	              	label="序号"
	              		width="100px"
		                type="index">
		              </el-table-column>
		              <el-table-column
		                  label="导航标题"
		                  prop="navigationName">
		                </el-table-column>
		              <el-table-column
		                prop="状态"
		                label="账号">
		                <template slot-scope="scope">
		                	{{scope.row.enabled?"启用":"禁用"}}
		                </template>
		              </el-table-column> 
		              <el-table-column
		                prop=""
		                label="操作">
		                <template slot-scope="scope">
		                  <div style="cursor: pointer;width: 100%;display: flex;justify-content: space-around;">
		                    <i class="iconfont iconbianji icon-active" @click="editDialog(scope.row)"></i>
	                      <i class="iconfont iconsuo icon-active" style="" v-if="!scope.row.enabled" @click="UnLockNav(scope.row)"></i>
	                    	<i class="iconfont iconkaisuo icon-active" v-if="scope.row.enabled" @click="lockNav(scope.row)"></i>
	 
	                    	<i class="iconfont iconshang-copy icon-active" :class="{hide:scope.$index==0}" @click="upsort(scope.row,scope.$index)"></i>

	                    	<i class="iconfont iconxia icon-active" :class="{hide:scope.$index==topData.length-1}" @click="downsort(scope.row,scope.$index)"></i>
		                  </div>
		                </template>
		              </el-table-column>
		            </el-table>
			       

			      </div>	

			      <div class="meau-table" style="">
			        <div class="right-header">
			          <span>分类栏目 </span>
			          <el-button size="mini" style="margin-left: 20px;" @click="addDialogshow('SubjectCatalog')"><i class="el-icon-plus"></i> 新增分类栏目</el-button>
			        </div>
				      <el-table
	              :data="cateageData"
	              :height="table_height"
	              border>
	              <el-table-column
	              	label="序号"
	              	width="100px"
	                type="index">
	              </el-table-column>
	              <el-table-column
	                  label="导航标题"
	                  prop="navigationName">
	                </el-table-column>
	              <el-table-column
	                prop="状态"
	                label="账号">
	                <template slot-scope="scope">
	                	{{scope.row.enabled?"启用":"禁用"}}
	                </template>
	              </el-table-column> 
	              <el-table-column
	                prop=""
	                label="操作">
	                <template slot-scope="scope">
	                  <div style="cursor: pointer;width: 100%;display: flex;justify-content: space-around;">
	                    <i class="iconfont iconbianji icon-active" @click="editDialog(scope.row)"></i>
                     	<i class="iconfont iconsuo icon-active" style="" v-if="!scope.row.enabled" @click="UnLockNav(scope.row)"></i>
                    	<i class="iconfont iconkaisuo icon-active" v-if="scope.row.enabled" @click="lockNav(scope.row)"></i>

                    	<i class="iconfont iconshang-copy icon-active" :class="{hide:scope.$index==0}" @click="upsort(scope.row,scope.$index)"></i>

                    	<i class="iconfont iconxia icon-active" :class="{hide:scope.$index==cateageData.length-1}" @click="downsort(scope.row,scope.$index)"></i>
	                  </div>
	                </template>
	              </el-table-column>
	            </el-table>
			      </div>	
						


					</div> -->
        </div>	


      </div>
    </rightNav>


   <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" :close-on-click-modal='false'>
      <el-form :model="navigation"  size="small" label-width="80px" :show-message='false'>
        <el-form-item label="名称">
          <el-input v-model="navigation.name" placeholder="请输入名称"  class="input-class"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="name">
          <el-input v-model="navigation.url" placeholder="请输入地址"  class="input-class"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addNavigation" size="mini">确 定</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import rightNav from '@/components/Nav/rightNav'

export default {

  data() {

    return {
    	meauList: [{
	    		label:'站点信息',
	    		check: true
	    	},{
	    		label:'导航栏目',
	    		check: false
	    	}
    	],
    	title: '站点信息',
    	site: {
    		name:'',
    		copyright:'',
    		icp:'',
    		police:''
    	},
    	isEdit: false,
    	cateageData:[],
    	topData:[],
    	oldSite:{},
    	dialogTitle:'',
    	dialogVisible: false,
    	navigation:{
    		name:'',
    		url:'',
    		navigationType:''
    	},
    	navigationId:'',
    	table_height:100,







    }
  },
  components: {
    rightNav,
    
    
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
      this.table_height = this.$refs.content_wrap.offsetHeight * 0.45 - 40
    })

  	this.getSiteInfo()
  	this.getnavigationBar()





  },
  methods: {


  	changeType(list) {
  		this.meauList.forEach(item=>{
  			item.check = false
  		})

  		list.check = true
  		this.title = list.label
  	},


  	getSiteInfo() {


      this.$http.get(`/api/internal/configuration/logo`)
      .then((data)=>{
        if(data.status == '200') {


        	this.site = data.data
        	this.oldSite = JSON.parse(JSON.stringify(data.data))

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
		deleteFile(type) {

			type == "picture" ?this.site.picture = "":this.site.icon = ""
		},
    tirggerFile(event,type) {
    	let that = this
      var filePath = event.target.value
      let file = event.target.files[0]
			let src = window.URL.createObjectURL(file)

			let fileFormat = filePath.substring(filePath.lastIndexOf(".")).toLowerCase()

      if (!fileFormat.match(/(.png|.jpg|.jpeg)$/)) {

      	event.target.value=""
      		return this.$message({
	  				message:"格式必须为：.png/.jpg/.jpeg",
	  				type:"warning"
	  			})

      }



      let size = file.size;

      if (size > 1048576) {

      	event.target.value=""
    		return this.$message({
  				message:"上传文件不能超过1M",
  				type:"warning"
  			})
      }


      //FileReader可直接将上传文件转化为二进制流
      var reader = new FileReader();
      reader.readAsDataURL(file);//转化二进制流，异步方法
      reader.onload = function () {//完成后this.result为二进制流
          var base64Str = this.result;
          var startNum = base64Str.indexOf("base64,");
          startNum = startNum + 7;
          //去除前部格式信息
          // var baseStr = base64Str.slice(startNum);
          //临时存储二进制流
          type == "picture" ?that.site.picture = base64Str:that.site.icon = base64Str

          console.log(that.site.icon)
      };
      // type == "picture" ?this.site.picture = src:this.site.icon = src

      
      



    },
  	setStieInfo() {
  		let info = []

  		this.site.name != this.oldSite.name? info.push({key:"name",value:this.site.name}):null
  		this.site.copyright != this.oldSite.copyright? info.push({key:"copyright",value:this.site.copyright}):null
  		this.site.icp != this.oldSite.icp? info.push({key:"icp",value:this.site.icp}):null
  		this.site.police != this.oldSite.police? info.push({key:"police",value:this.site.police}):null
  		this.site.picture != this.oldSite.picture? info.push({key:"picture",value:this.site.picture}):null
  		this.site.icon != this.oldSite.icon? info.push({key:"icon",value:this.site.icon}):null

  		if(info.length==0) {
  			return this.$message({
  				message:"未修改信息",
  				type:"warning"
  			})
  		}

  		this.$http.put(`/api/internal/configuration/configs/LogoConfiguration`,info)
      .then((data)=>{
        if(data.status == '200') {

        	this.getSiteInfo()
					this.$message({
	  				message:"修改成功",
	  				type:"success"
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
  	},


  	addDialogshow(type) {
  		this.isEdit = false
  		this.dialogTitle = type=="TopNavigationBar"?"新增顶部导航":"新增分类栏目"
  		this.navigation.navigationType = type
  		this.navigation.name = ''
  		this.navigation.url = ''
  		this.dialogVisible = true
  	},

  	editDialog(row) {
  		this.isEdit = true
  		this.dialogTitle = row.navigationType=="TopNavigationBar"?"新增顶部导航":"新增分类栏目"
  		this.navigation.navigationType = row.navigationType
  		this.navigation.name = row.navigationName
  		this.navigation.url = row.url
  		this.navigationId = row.navigationId.id
  		this.dialogVisible = true
  	},

  	addNavigation() {

  		if(!this.navigation.name) {
  			return this.$message({
  				message:'导航栏名称不能为空',
  				type:"warning"
  			})
  		}

  		if(this.isEdit) {
	  		this.$http.put(`/api/internal/navigationBar/${this.navigationId}`,{
	  			navigationName: this.navigation.name,
	  			url: this.navigation.url
	  		})
	      .then((data)=>{
	        if(data.status == '200') {
	        	this.navigationId =''
						this.dialogVisible = false
						this.getnavigationBar()
						this.$message({
		  				message:"修改成功",
		  				type:"success"
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

  		}else {
  			
	  		this.$http.post(`/api/internal/navigationBar`,{
	  			navigationName: this.navigation.name,
	  			navigationType: this.navigation.navigationType,
	  			url: this.navigation.url
	  		})
	      .then((data)=>{
	        if(data.status == '200') {

						this.dialogVisible = false

						this.getnavigationBar()
						this.$message({
		  				message:"新增成功",
		  				type:"success"
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

  	},

  	getnavigationBar() {


  		this.topData = []
  		this.cateageData = []


  		this.$http.get(`/api/internal/navigationBar`)
  		.then((data)=>{
        if(data.status == '200') {
        	if(data.data.length) {
        		data.data.forEach(list=> {
        			list.navigationType == "TopNavigationBar"?this.topData.push(list):this.cateageData.push(list)
        		})
        	}

        	//console.log(this.topData,this.cateageData)
        	


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

  	lockNav(row) {
      this.$http.put(`/api/internal/navigationBar/${row.navigationId.id}/disable`)

      .then((data)=>{
        if(data.status == '200') {

						this.getnavigationBar()
            this.$message({
              message:'禁用成功',
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
    },

    UnLockNav(row) {
      this.$http.put(`/api/internal/navigationBar/${row.navigationId.id}/enable`)

      .then((data)=>{
        if(data.status == '200') {

        		this.getnavigationBar()

            this.$message({
              message:'启用成功',
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
    },

    upsort(row,index) {

      this.$http.put(`/api/internal/navigationBar/${row.navigationId.id}/turnUpNavigationBar/${index}`)

      .then((data)=>{
        if(data.status == '200') {

        		this.getnavigationBar()

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


    downsort(row,index) {

      this.$http.put(`/api/internal/navigationBar/${row.navigationId.id}/turnDownNavigationBar/${index+2}`)

      .then((data)=>{
        if(data.status == '200') {

        		this.getnavigationBar()

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








  }
}
</script>
<style lang="less">

</style>
<style lang="less" scoped>
 .site{
	height: 100%;

  .input-class {
    width: 280px;
  }

  .input-div {
    width: 380px;
  }
  .search-class {
    width: 160px;
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

  .content-wrap {
    height: calc(100vh - 120px);
    // height: 100%;
    .logo-div {
			display: flex;
			align-items: center;

			&-left {
				width: 160px;
				flex-shrink: 0
			}

			&-right {
				margin-left: 20px;
				color: #b9c1d2;
			}
    }
		
		.hide {
			color: transparent;
		}

    .meau-table {
    	// height: calc(45vh - 20px);
    	//background-color: red;
    }
  }


 }
</style>
