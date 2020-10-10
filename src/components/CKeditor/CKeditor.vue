<template>
	<div>
		<!-- 工具栏容器 -->
		<div id="toolbar-container"></div>
		<!-- 编辑器容器 -->
		<div id="editor" ></div>
	</div>
</template>
<script>
import DocumentEditor from '../../../public/ckeditor5-simple/build/ckeditor'
import { mapGetters } from 'vuex'

class MyUploadAdapter {
  constructor( loader ,http, url) {
    // Save Loader instance to update upload progress.
    this.loader = loader;
    this.http = http;
    this.url = url;
  }
 
  async upload() {
    const data = new FormData();
    data.append('file', await this.loader.file);
 
    return new Promise((resolve, reject) => {

    	this.http.post(`/api/open/upload/file`,data)
	        .then((result)=>{
	          if(result.status == '200') {
          		let response = {
                    default:result.data
                }
	        	resolve(response);
	          } else {
	          	reject(false);
	          }
	        }).catch(error => {
		        reject(error)
		    });
    });
  }
}

export default {
  
    props: { },
	components: { },
    data() {
	    return {
	      editor: null
	    };
	  },   
    mounted() {
		this.initCKEditor();   
    },
    destoryed() { },
    methods:{
		initCKEditor() {
	        DocumentEditor.create(document.querySelector('#editor'), {
	        	toolbar: {
					items: [
						'heading',
						'|',
						'fontSize',
						'fontFamily',
						'|',
						'bold',
						'italic',
						'underline',
						'strikethrough',
						'|',
						'alignment',
						'indent',
						'outdent',
						'|',
						'numberedList',
						'bulletedList',
						'todoList',
						'horizontalLine',
						'|',
						'removeFormat',
						'specialCharacters',
						'MathType',
						'ChemType',
						'|',
						'blockQuote',
						'imageUpload',
						'insertTable',
						'|',
						'undo',
						'redo'
					]
				},
				language: 'zh-cn',
				image: {
					styles: [
		                'alignLeft', 'alignCenter', 'alignRight'
		            ],
		            resizeOptions: [
		                {
		                    name: 'imageResize:original',
		                    label: 'Original',
		                    value: null
		                },
		                {
		                    name: 'imageResize:50',
		                    label: '50%',
		                    value: '50'
		                },
		                {
		                    name: 'imageResize:75',
		                    label: '75%',
		                    value: '75'
		                }
		            ],
					toolbar: [
						'imageStyle:alignLeft',
						'imageStyle:alignCenter',
						'imageStyle:alignRight',
						'|',
						'imageResize',
						'|',
						'imageTextAlternative'
					]
				},
				table: {
					contentToolbar: [
						'tableColumn',
						'tableRow',
						'mergeTableCells',
						'tableCellProperties',
						'tableProperties'
					]
				},
				licenseKey: '',
	         
	        }).then(editor => {
	          document.querySelector('#toolbar-container').appendChild(editor.ui.view.toolbar.element);
	          document.querySelector( '.ck-toolbar' ).classList.add( 'ck-reset_all' );

			  //将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
	          this.editor = editor
	           
	           // 自定义上传图片插件
		       editor.plugins.get("FileRepository").createUploadAdapter = loader => {
		        return new MyUploadAdapter(loader,this.$http,'http://localhost:8888');
		      };
		      editor.setData('<p>123123</p><math mathvariant="italic" display="inline"><mi>x</mi><mo>&lt;</mo><mtext>sup</mtext><mo>&gt;</mo><mn>2</mn><mfrac><mo>&lt;</mo><mtext>sup</mtext></mfrac><mo>&gt;</mo></math><img src="http://localhost:8888/upload/2020-09-10/1599720522933.jpg">');
	        }).catch(error => {
	          console.error(error);
	        });
	    },

	    getData(){
	    	return this.editor.getData();
	    },

	    setData(data){
	    	this.editor.setData(data)
	    },  
    }
}
</script>

<style lang="less">
.ck-rounded-corners .ck.ck-editor__editable:not(.ck-editor__nested-editable), .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-rounded-corners {
	background: #ffffff;
	border: 1px solid var(--ck-color-toolbar-border);
	border-top: 0px;
	min-height:226px;
}
.ck.ck-editor__editable_inline>:last-child {
  min-height:200px;

}

.ck.ck-editor__editable_inline:focus {
  outline: 0px;
}

.ck .ck-editor__main:focus {
  outline: 0px;
}
</style>
