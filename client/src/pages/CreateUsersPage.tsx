import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckIcon, DocumentAddIcon, DocumentDownloadIcon, TrashIcon, UsersIcon, XIcon } from "@heroicons/react/outline";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FileDropZone from "../components/FileDropZone";
import { useToast } from "../components/ui/use-toast";
import { IErrorObj, handleErrors } from "../lib/utils";
import { DataTable, UserTableColumns } from "../components/UserTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserContext } from "../lib/provider/UserContextProvider";
import { activateUsers, createUsers, deactivateUsers, deleteUsers } from "../api/api";


const CreateUsersPage = () => {
  const { user } = useContext(UserContext);
  const uploadDialogRef = React.useRef<HTMLButtonElement>(null);
  const actionPopOverRef = React.useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const [fileData, setFileData] = useState<any[]>([]);
  const [errorList, setErrorList] = useState<IErrorObj[]>([]);
  const [action, setAction] = useState<string>("CREATE");
  // const [progressList, setProgressList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    view: false,
  });

  const handleFileData = (file: any) => {
    try {
      if (!file) throw new Error("No data found");
      setFileData(file.data);
      uploadDialogRef.current?.click();
    } catch (e) {
      handleErrors(e, toast, setErrorList);
    }
  };

  const handleAction = async () => {
    try {
      setIsLoading(true);
      actionPopOverRef.current?.click();
      setStats({
        total: 0,
        success: 0,
        failed: 0,
        view: false,
      });

      const auth = sessionStorage.getItem("token");
      if (!auth) throw new Error("No auth found");
      const requestObj = {
        realm: user?.realm,
        users: fileData,
        auth: JSON.parse(auth),
      };

      let response: any = null;

      if (action === "CREATE") {
        response = await createUsers(requestObj);
      } else if (action === "ACTIVATE") {
        response = await activateUsers(requestObj);
      } else if (action === "DEACTIVATE") {
        response = await deactivateUsers(requestObj);
      } else if (action === "DELETE") {
        response = await deleteUsers(requestObj);
      }

      if (!response) throw new Error("No Response Found");
      if (response.error) throw new Error(response.message);

      const responseData = response.data;
      getStats(responseData);
      // update
      //get the username and update the status on fileData
      const updatedFileData = fileData.map((item: any) => {
        const user = responseData.find((user: any) => user.username === item.username);
        if (user) {
          item.status = {
            status: user.status,
            message: user.message,
            roles: user.roles && user.roles,
            groups: user.groups && user.groups,
          };
        }
        return item;
      });

      setFileData(updatedFileData);
    } catch (e) {
      handleErrors(e, toast, setErrorList);
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = (responseData: any) => {
    const total = responseData.length;
    const success = [];
    const failed = [];
    for (const item of responseData) {
      if (item.toString().includes("status:true")) {
        success.push(item);
      } else {
        failed.push(item);
      }
    }
    setStats({
      total: total,
      success: success.length,
      failed: failed.length,
      view: true,
    });
  };

  return (
    <div>
      {/* <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
          <li>
            <a href="#" className="block transition hover:text-gray-700">
              <span className="sr-only"> Home </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>
          </li>

          <li className="rtl:rotate-180">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </li>

          <li>
            <a href="#" className="block transition hover:text-gray-700 font-bold">
              {" "}
              Create{" "}
            </a>
          </li>
        </ol>
      </nav> */}
      <div>
        <h2 className="text-2xl">Create</h2>
        <span className="text-sm font-semibold text-muted-foreground">Create the user list here</span>
      </div>
      <div className="grid grid-flow-row-dense grid-cols-3 gap-3 mt-3">
        <div className="md:col-span-2 col-span-3 space-y-2">
          {/* Upload Dialog */}
          <Card className="md:col-span-2 col-span-3">
            <CardHeader>
              <div className="flex justify-between">
                <h4 className="text-lg font-semibold">Import User List</h4>
                <div className="flex gap-1">
                  <Button className="rounded-full">
                    <DocumentDownloadIcon className="h-5 w-5" />
                  </Button>

                  <Dialog>
                    <DialogTrigger ref={uploadDialogRef}>
                      <Button variant="primary" className=" rounded-3xl">
                        <DocumentAddIcon className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Your User List File Here</DialogTitle>
                        <DialogDescription>File Should be structured according to the Template given</DialogDescription>
                      </DialogHeader>
                      <FileDropZone setData={handleFileData} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Error list and Progress */}
        <div className="col-span-3 md:col-span-1">
          {errorList.length > 0 && (
            <Card className="hover-parent">
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between flex-row">
                    <h4 className="text-lg font-semibold mb-0">Errors</h4>
                    <Button onClick={() => setErrorList([])} className="p-1 px-2 hover-child">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {errorList.map((item, index) => {
                  return (
                    <Alert key={index} variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{item.msg}</AlertDescription>
                    </Alert>
                  );
                })}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Progress
                {isLoading && (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-1 md:p-2">
              {
                stats.view && (
                  <Card>
                  <CardContent className="bg-background rounded-3 p-0 p-2 md:p-2 lg:p-3 rounded-md">
                    <h3 className="text-md font-medium">{action}</h3>
                    <div className="grid-cols-3 grid mt-2">
                      <div className="text-gray-500 flex flex-col w-fit ">
                        <h1 className="bg-gray-300 text-gray-600 px-2 font-semibold rounded-md">Total</h1>
                        <div className="font-bold flex gap-1 mt-1 items-center">
                          <UsersIcon className="h-4 w-4" />
                          <span>{stats.total}</span>
                        </div>
                      </div>
                      <div className="text-teal-500 flex flex-col w-fit ">
                        <h1 className="bg-teal-500 text-teal-100 px-2 font-semibold rounded-md">Success</h1>
                        <div className="font-bold flex gap-1 mt-1 items-center">
                          <CheckIcon className="h-4 w-4" />
                          <span>{stats.failed}</span>
                        </div>
                      </div>
                      <div className="text-pink-500 flex flex-col w-fit ">
                        <h1 className="bg-pink-500 text-pink-100 px-2 font-semibold rounded-md">Failed</h1>
                        <div className="font-bold flex gap-1 mt-1 items-center">
                          <XIcon className="h-4 w-4" />
                          <span>{stats.success}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )
              }
           
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between align-center">
              <h3 className="text-lg font-semibold">Create</h3>
              <div className="flex gap-1 items-center">
                <Select onValueChange={(value: string) => setAction(value)} defaultValue={action}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="ACTIVATE">Activate</SelectItem>
                    <SelectItem value="DEACTIVATE">Deactivate</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger>
                    <Button variant="primary" ref={actionPopOverRef} disabled={isLoading}>
                      Submit
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-1 md:p-2">
                    <h3 className="text-md font-semibold">Are you sure to {action} these users?</h3>
                    <div className="flex justify-end">
                      <Button variant="destructive" onClick={handleAction}>
                        YES
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable data={fileData ? fileData : []} columns={UserTableColumns} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateUsersPage;
