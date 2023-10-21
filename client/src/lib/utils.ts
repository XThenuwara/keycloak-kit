import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from "xlsx";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface IErrorObj {
  error: any;
  msg: string;
  status: string | number;
}


export const getErrorObj = (e: any): IErrorObj => {
  if (e.response && e.response.data && e.response.data.error && e.response.data.error_description) {
    return {
      error: e.response,
      msg: e.response.data.error_description,
      status: e.response.status,
    };
  }

  if (e.response && e.response.data && e.response.data.error && e.response.data.message) {
    return {
      error: e.response.data,
      msg: Array.isArray(e.response.data.message) ? e.response.data.message[0] : e.response.data.message,
      status: e.response.status,
    };
  }

  if (e.response && e.response.data && e.response.data.errorMessage) {
    return {
      error: e.response,
      msg: e.response.data.errorMessage,
      status: e.response.status,
    };
  }

  if (e.message && e.code) {
    return {
      error: e,
      msg: e.message.toString(),
      status: e.code,
    };
  }

  if (e.message) {
    return {
      error: e,
      msg: e.message.toString(),
      status: "error",
    };
  }

  if (e.msg) {
    return {
      error: e,
      msg: e.msg.toString(),
      status: "error",
    };
  }

  if (e.data) {
    if (e.data.statusCode && e.data.message) {
      return {
        error: e,
        msg: e.data.message.toString(),
        status: e.data.statusCode,
      };
    }
  }

  if(typeof e === "string"){
    return {
      error: e,
      msg: e,
      status: "error",
    };
  }

  return {
    error: e,
    msg: JSON.stringify(e),
    status: "error",
  };
};

export const readFile = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      resolve(text);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsText(file);
  });
};

export const handleExcelCsvFile = async (type: any, data: any) => {
  try {
    const excelData = data;
    if (type === "xls" || type === "xlsx") {
      const workbook = XLSX.read(data, { type: "binary" }); 
      const sheet_name_list = workbook.SheetNames;
      const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      return xlData;
    }
    if (type === "csv") {
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet_name_list = workbook.SheetNames;
      //get headers even if they are empty
      const headers = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet_name_list[0]]).split("\n")[0].split(",");
      const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

      //map headers to data
      const mappedData = xlData.map((item: any) => {
        const obj: any = {};
        headers.forEach((header: any) => {
          obj[header] = item[header];
        });
        return obj;
      });

      return mappedData;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};


export const handleErrors =  (e: any, toast: any, setErrorList?: any) =>{
  const errorObj = getErrorObj(e);
  toast && toast({
    title: errorObj.msg,
    variant: 'destructive'
  });
  
  setErrorList && setErrorList((prev: any) => [prev, errorObj]);
}