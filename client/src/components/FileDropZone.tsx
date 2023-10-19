import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useContext, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { getErrorObj, handleErrors, handleExcelCsvFile, readFile } from "../lib/utils";
import { DocumentIcon, DocumentReportIcon, DocumentRemoveIcon, UploadIcon } from "@heroicons/react/outline";
import "@mantine/dropzone/styles.css";
import { useToast } from "./ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface IFileHandler {
  setData: any;
}

export default function FileDropZone(props: Partial<DropzoneProps> & IFileHandler) {
  const { setData } = props;
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [errors, setErrors] = useState<any[]>([]);

  const handleNext = async () => {
    try {
      if (!selectedFile) throw new Error("No file selected");
      const data = await readFile(selectedFile);
      const isValidData = await validateFile({ name: selectedFile.name, data });
      if (!isValidData) throw new Error("File is not valid");

      setData({
        name: selectedFile.name,
        data: isValidData
      });
    } catch (e: any) {
      setData(null);
      handleErrors(e, toast, setErrors)
    }
  };

  const validateFile = async (file: any) => {
    try {
      const bookData: any = await handleExcelCsvFile(file.name.split(".")[1], file.data);
      if (!bookData) throw new Error("No data found");
      //add status column to json
      bookData.forEach((item: any) => {
        item.status = [];
      });
      // check if bookData is contains username keyword
      let requiredHeaders = ["username", "password", "groups", "roles"];
      //check if file has the required headers
      let fileHeaders = Object.keys(bookData[0]);
      let hasRequiredHeaders = requiredHeaders.every((item) => fileHeaders.includes(item));
      if (!hasRequiredHeaders) throw new Error("File is missing required headers");
      if (bookData.length > 2000) throw new Error("File contains more than 1000 records");

      //set file data
      return bookData;
    } catch (e) {
      handleErrors(e, toast, setErrors)
      return false;
    }
  };

  return (
    <div>
      {selectedFile ? (
        <Card className="p-3">
          <div>
            <DocumentIcon className="h-6" />
          </div>
          <div className="flex justify-between items-center">
            {selectedFile.name}
            <div className="hover:cursor-pointer bg-destructive text-destructive-foreground rounded-sm p-1">
              <DocumentRemoveIcon
                className="h-5"
                onClick={() => {
                  setSelectedFile(null);
                  setErrors([]);
                }}
              />
            </div>
          </div>
        </Card>
      ) : (
        <Dropzone onDrop={(files: any) => setSelectedFile(files[0])} onReject={(files: any) => console.log("rejected files", files)} maxSize={3 * 1024 ** 2}>
          <Card style={{ pointerEvents: "none" }} className="border border-dotted border-2 p-2 md:p-4">
            <Dropzone.Accept>
              <UploadIcon className="h-6" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <DocumentReportIcon className="h-6" />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <UploadIcon className="h-6" />
            </Dropzone.Idle>
            <div>
              <h2 className="text-xl">Upload file</h2>
              <span className="text-md font-semibold text-slate-500">Drag and Drop or Click to open file browser</span>
            </div>
          </Card>
        </Dropzone>
      )}
      <div className="mt-2 space-y-2">
        {errors.map((error, index) => (
          <Alert key={index} variant="destructive">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.msg}</AlertDescription>
          </Alert>
        ))}
      </div>

      <div className="d-flex justify-content-end mt-3" onClick={() => handleNext()}>
        <Button variant="primary">Save File</Button>
      </div>
    </div>
  );
}
