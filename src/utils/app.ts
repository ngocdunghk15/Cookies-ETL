import {FileFilterMode} from "~enum/app.enum";
import type {RcFile} from "antd/lib/upload";

interface ValidateFileUploadPayload {
  file: RcFile,
  filter?: {
    fileTypeRegexes: string[],
    mode: FileFilterMode
  }
}

export function downloadFile(payload: any, fileName: string = "cookies") {
  const blob = new Blob([payload], {
    type: 'application/octet-stream'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function getTime() {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const day = time.getDate();
  const month = time.getMonth() + 1;
  const year = time.getFullYear();
  return `${day}-${month}-${year}_${hour}h${minute}`;
}

export const validateFileExtension = async (payload: ValidateFileUploadPayload) => {
  const {filter, file} = payload;
  let isValidFile = true;
  switch (filter?.mode) {
    case FileFilterMode.ACCEPT: {
      isValidFile = !!filter?.fileTypeRegexes?.filter(regex => file?.type.match(regex)).length;
      break;
    }
    case FileFilterMode.EXCEPT: {
      isValidFile = !filter?.fileTypeRegexes?.filter(regex => file?.type.match(regex)).length;
      break;
    }
  }
  return isValidFile;
};

export const onReadFileContent = (file: RcFile) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = function (e) {
        resolve(e?.target?.result);
      }
      reader.readAsText(file)
    } catch (error) {
      console.log('Import file', {error})
      reject(error);
    }
  })
}
