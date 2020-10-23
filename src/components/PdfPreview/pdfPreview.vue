<template>
  <div class="pdf-view">
    <!-- <div style="text-align:center;line-height: 42px;">
      <i @touchstart="idx=0" @touchend="idx=-1" @click="scaleD" class="el-icon-zoom-in pdf-icon"></i>
      <span @click="changePdfPage(0)" class="cursor"><i class="iconfont el-icon-arrow-left"></i></span>
      <span style="font-size:15px;font-weight:600;margin-left:10px;">{{currentPage}}</span> 
      <span style="font-size:15px;font-weight:600;"> / </span> 
      <span style="font-size:15px;font-weight:600;margin-right:10px;">{{pdfPagenum}}</span>
      <span @click="changePdfPage(1)" class="cursor"><i class="iconfont el-icon-arrow-right"></i></span>

      
   
      <i @touchstart="idx=1" @touchend="idx=-1" @click="scaleX" class="el-icon-zoom-out pdf-icon"> </i>
    </div>
    <pdf
      ref="pdf"
      class="pdf-wrap"
      :src="pdfUrl"
      :page='currentPage'
      @num-pages="pageCount=$event" 
      @page-loaded="currentPage=$event"
    >
    </pdf> -->

    <pdf
      class="pdf-wrap"
      v-for="i in currentPageNum"
      :key="i"
      :src="pdfUrl"
      :page="i"
    ></pdf>

    <div v-if="pdfPagenum && pdfPagenum>currentPageNum" style="text-align: center;line-height: 40px;">
      剩余{{pdfPagenum-currentPageNum}}页未读， 
      <span style="color: #409EFF;cursor: pointer;" @click="addPageNum">继续阅读 
        <i class="el-icon-arrow-down"></i>
      </span>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  data() {
    return {
      currentPage: 1,
      pageCount: 0,
      // totalPages: 
      scale: 90, //放大系数
      idx: -1,
      currentPageNum: 0,

    }
  },

  components: {
    pdf
  },

  props:{
    pdfUrl: String,
    pdfPagenum: Number
  },

  created() {
    this.pdfPreviewUrl = pdf.createLoadingTask(this.pdfUrl);

    
  },

  mounted() {

    this.currentPageNum = this.pdfPagenum < 10? this.pdfPagenum: 10
  },


  methods: {
    changePdfPage(val) {
      if(val === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
      if(val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },



    //预览pdf
    previewPDF(url){
      this.src = pdf.createLoadingTask(url)
    },
    //下载PDF
    downloadPDF(url,fileName){
        this.$http({
            method: 'get',
            responseType: 'arraybuffer',
            url: url
        }).then((res)=>{
                //调用下载方法，把后端传过来的流传给fileDownload方法
                this.fileDownload(res.data, fileName);
            }
        )
        .catch((error)=> {
                this.$message.error("网络请求出错")
                //调试阶段可以看看报的什么错
                //console.log("error",error)
            }
        );
    },
    fileDownload:function (data, fileName) {
        let blob = new Blob([data], {
            //type类型后端返回来的数据中会有，根据自己实际进行修改
            type: "application/vnd.ms-excel"
        });
        let filename = fileName || "报表.xls";
        if (typeof window.navigator.msSaveBlob !== "undefined") {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var blobURL = window.URL.createObjectURL(blob);
            // 创建隐藏<a>标签进行下载
            var tempLink = document.createElement("a");
            tempLink.style.display = "none";
            tempLink.href = blobURL;
            tempLink.setAttribute("download", filename);
            if (typeof tempLink.download === "undefined") {
                tempLink.setAttribute("target", "_blank");
            }
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
        }
    },


      //放大
      scaleD() {
        if (this.scale == 100) {
          return;
        }
        this.scale += 5;
        this.$refs.pdf.$el.style.width = parseInt(this.scale) + "%";
      },
 
      //缩小
      scaleX() {
        if (this.scale == 70) {
          return;
        }
        this.scale += -5;
        this.$refs.pdf.$el.style.width = parseInt(this.scale) + "%";
      },


      addPageNum() {

        if(this.pdfPagenum<this.currentPageNum + 10) {
          this.currentPageNum = this.pdfPagenum
        }else {
          this.currentPageNum += this.currentPageNum
        }
      }
  }
}
</script>

<style lang="less">
.pdf-view {
  padding: 0 20px 20px 20px;
  width: 100%;

  .pdf-wrap {
    width:90%;
    margin: 0px auto 20px;
    border:1px solid rgb(212 211 211);
    
    // width: 100%;
    // margin-bottom: 20px;
  }

  .pdf-icon {
    font-size: 1.2rem;
    margin: 0 8px;
    cursor: pointer;
  }
}
</style>