import $http from '@/common/axios';
import { Message } from 'element-ui';
/**
 * 文件分片上传（支持不分片直接上传）
 * 这个方法在 init 初始化后调用
 * @param {!Object} Object.file 读取的文件
 * @param {!String} Object.uploadUrl 上传地址
 * @param {!Number | Null} Object.limitSize 文件限制多大需要分片 20 * 1024 * 1024 即20MB，null则不限制大小
 * @param {!Function} Object.callBack 每片上传成功的回调函数
 * @param {!Function} Object.errBack 每片上传失败的回调函数
 * @param {!Object} Object.httpConfig 上传时的http配置
 * @returns Array 返回分片的id和tag
 */
export const uploadFilesBySteaps = async ({file, uploadUrl, limitSize=null, callBack, errBack, httpConfig = {}})=>{
  const totalPieces = limitSize ? file.size > limitSize ? Math.ceil(file.size / limitSize) : 1 : 1; //需要多少切片，默认一片

  let uploadArray = [];
  let start = 0; //片段开始位置
  let end; //片段截止位置
  let currenyIndex = 0; //当前所在片段

  while(start < file.size) {
    end = start + (limitSize ? limitSize : file.size);
    if(end > file.size) {
      end = file.size;
    }
    let chunk = file.slice(start, end);//切割文件
    let formData = new FormData();
    formData.append('file', chunk);
    uploadArray[currenyIndex] = await uploadFn({uploadUrl, currenyIndex, totalPieces, formData, callBack, errBack, httpConfig});
    currenyIndex++;
    start = end;
  }
  return uploadArray;
};

/**
 * 上传http
 * @returns Object 上传文件的id、tag
 */
const uploadFn = ({uploadUrl, currenyIndex, totalPieces, formData, callBack, errBack, httpConfig}) =>{
  return new Promise((resolve, reject)=>{
    $http.post(uploadUrl, { partNumber: currenyIndex + 1, lastPart: currenyIndex == (totalPieces - 1) }, formData, httpConfig).then((uploadResponse)=>{
      callBack && callBack();
      resolve(Object.assign({}, uploadResponse.data));
    }).catch((uploadErr)=>{
      errBack && errBack();
      
      // console.error(uploadErr);

      // Message.error(uploadErr.msg)
      // 重新上传该片段
      // if(tryAgain >= 0) {
      //   reject(uploadFn({uploadUrl, currenyIndex, totalPieces, formData, callBack, errBack, httpConfig}));
      // } else {
        reject(uploadErr);
      //}
      
    });
  });
}