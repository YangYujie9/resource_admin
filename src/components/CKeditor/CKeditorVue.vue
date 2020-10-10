<template>
	<div>
		<ckeditor id="editor" :editor="editor"
	      @ready="onReady"
	      v-model="editorData"
	      :config="editorConfig">
	    </ckeditor>
	</div>
</template>

<script>
import DocumentEditor from '../../../public/ckeditor5-simple/build/ckeditor'
import CKEditor from '@ckeditor/ckeditor5-vue';
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
  
    props: {

			readOnly:{
				type:Boolean,
				default: false
			}
		},
		components: {
		    ckeditor: CKEditor.component,
		},
    data() {
	    return {
	      editor: DocumentEditor,
	      editorData:'',
	      editorConfig: {
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
	      },
	    };
	  },   
    mounted() {

    },
    destoryed() {
    },
    methods:{
		// 富文本配置初始化
		onReady(editor) {

			editor.isReadOnly = this.readOnly
			editor.ui.getEditableElement().parentElement.insertBefore(
			    editor.ui.view.toolbar.element,
			    editor.ui.getEditableElement()
      		);

		      // 自定义上传图片插件
		      editor.plugins.get("FileRepository").createUploadAdapter = loader => {
		         return new MyUploadAdapter(loader,this.$http,'http://localhost:8888');
		      };
	    }, 

	    getData(){
	    	return this.editorData;
	    },

	    setData(data){
	    	this.editorData = data
	    }, 

    }
}
</script>

<style lang="less">
.ck-rounded-corners .ck.ck-editor__editable:not(.ck-editor__nested-editable), .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-rounded-corners {
	background: #ffffff;
	border: 1px solid var(--ck-color-toolbar-border);
	border-top: 0px;
	height:226px;
}
html:root {
	--ck-widget-outline-thickness: 1px;
}
.ck .ck-widget {
	outline-style: none;
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
