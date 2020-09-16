import $http from '@/common/axios';

// 初始化上传文件
export const initFileUpload = (bodyParams) => {
  return $http.post(`/api/open/common/file/initUpload`, bodyParams);
};

// 文件上传确认，返回预览URL
export const completeFileUpload = (fileId) => {
  return $http.put(`/api/open/common/file/${fileId}/complete`);
};

// 获取文件预览URL
export const getFilePreview = (fileId) => {
  return $http.get(`/api/open/common/${fileId}/preview`);
};

// 获取文件下载地址
export const getFileDownload = (fileId) => {
  return $http.get(`/api/open/common/${fileId}/download`);
};
