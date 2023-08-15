/**
 * 
 * @param {string} contentType  
 * @returns {Boolean} - true, если это файл
 */
export const isFile = (contentType) => {
  const fileTypes = [
    "application/pdf",
    "image/", 
    "audio/",
    "video/", 
    "application/msword", // для .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // для .docx
    "application/vnd.ms-excel", // для .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // для .xlsx
    "application/vnd.ms-powerpoint", // для .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation" // для .pptx
  ];
  
  return fileTypes.some(type => contentType.includes(type));
}