<template>
  <div class="login">
	<img src="../assets/images/loginpage.png" alt />
	<div class="frames">
	  <p style="margin-bottom: 20px;">{{ msg }}</p>
	  <div class="center">
		<el-form :model="loginForm" :rules="rules" ref="formName">
		  <el-form-item prop="username">
			<el-input placeholder="账号" v-model="loginForm.username"></el-input>
		  </el-form-item>
		  <el-form-item prop="password">
			<el-input
			  placeholder="密码"
			  v-model="loginForm.password"
			  show-password>
			</el-input>
		  </el-form-item>
		  <el-form-item>
			<p class="gos" @click="loginFn">登录</p>
		  </el-form-item>
		</el-form>
	  </div>
	</div>
  </div>
</template>

<script> 
import Cookies from "js-cookie";
export default {
  data() {
		return {
		  msg: "资源题库管理平台",
		  loginForm: {
			username: "",
			password: ""
		  },
		  rules: {
			username: [
			  { required: true, message: "请输入用户名", trigger: "blur" },
			  // { min: 1, max: 4, message: "长度在1至4个字符", trigger: "blur" }
			],
			password: [
			  { required: true, message: "请输入密码", trigger: "blur" },
			  { type: "string", min: 4, message: "密码至少四位", trigger: "blur" }
			]
		  }
		};
  },
  mounted() {
  	let that = this
	  document.addEventListener("keyup", function(event){
      //that.searchresult = false
      if (event.keyCode == 13 && that.$route.name == "login") {
        that.loginFn()
      }


    }, false);
  },
  methods: {
		loginFn() {
		  this.$refs['formName'].validate(valid => {
			if (valid) {

				this.$http.post(`/api/internal/user/login`,this.loginForm)

				.then(data => {

				  if(data.status == '200') {
						let Authorization = data.data.tokenType + ' ' +data.data.token

						Cookies.set("resource-admin", Authorization);
						// this.$store.commit('setUserInfo',data.data.userInfo);
						this.$store.dispatch('getUserBaseInfo', this.$router)
						
						
						this.$router.push("/administrator/rolemanagement")
						

						
				  }else {
				  	
						Cookies.remove("resource-admin")
						this.$message({
							message:data.msg,
							type:"error"
						})
						this.$router.push("/login")
						
				  }
		
				})
				.catch(()=>{
					return this.$message({
						message:'接口报错',
						type:'error'
					})
				})
			}
		  });
		}
  }
};
</script>
<style lang="less">
.login {
	.el-form-item {
		margin-bottom: 12px;
	}
}
</style>
<style lang="less" scoped>
.login {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url(../assets/images/login-bj.png) no-repeat 100% 100%;
  background-size: cover;
}
.login img {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.frames {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  width: 434px;
  height: 310px;
  text-align: center;
  padding: 40px 32px;
  margin: 0 auto;
  -webkit-transform: translateY(-65%);
  transform: translateY(-65%);
  border-radius: 8px;
  -webkit-box-shadow: 0 6px 10px 0 rgba(47, 110, 56, 0.74);
  box-shadow: 0 6px 10px 0 rgba(47, 110, 56, 0.74);
  background: #fff;
}
.frames p {
  color: #2d2d2d;
  font-size: 20px;
}
.frames .gos {
  width: 100%;
  height: 46px;
  line-height: 46px;
  font-size: 18px;
  color: #fff;
  -webkit-box-shadow: 0 2px 4px 0 rgba(32, 82, 30, 0.19);
  box-shadow: 0 2px 4px 0 rgba(32, 82, 30, 0.19);
  border-radius: 4px;
  background-color: #52bc4d;
  cursor: pointer;
}
.center .el-input {
  line-height: 60px;
}
</style>
