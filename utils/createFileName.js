import path from "path";
/**
 * 
 * @param {Object} response - response 
 * @returns {string} - возвращает имя файла name.ext
 */

export const createFileName = (response) => {
  const timestampFileName = new Date().toISOString().replace(/[:\-T\.Z]/g, ''); 

  const contentDisposition = response.headers.get("Content-Disposition");

  let fileExtension = "";

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(
      /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    );

    if (filenameMatch && filenameMatch[1]) {
      const filename = filenameMatch[1].replace(/['"]/g, "");
      fileExtension = path.extname(filename).slice(1);
    }
  }

  if (fileExtension) {
    return `${timestampFileName}.${fileExtension}`;
  }

  return false;
};