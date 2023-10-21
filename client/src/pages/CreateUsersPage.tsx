import React, { useContext, useEffect, useState } from "react";
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
import { SocketContext } from "../lib/provider/Websocket";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import TemplateModal from "../components/TemplateModal";

interface IProgress {
  message: string;
  progress: number;
}

interface IProgressList {
  list: IProgress[];
  latest: number;
}

interface IIssues {
  list: any[];
  view: boolean;
}

const CreateUsersPage = () => {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const uploadDialogRef = React.useRef<HTMLButtonElement>(null);
  const actionPopOverRef = React.useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const [fileData, setFileData] = useState<any[]>([]);
  const [errorList, setErrorList] = useState<IErrorObj[]>([]);
  const [action, setAction] = useState<string>("CREATE");
  const [progress, setProgress] = useState<IProgressList>({
    list: [],
    latest: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    view: false,
  });
  const [issues, setIssues] = useState<IIssues>({
    list: [],
    view: false,
  });

  useEffect(() => {
    socket?.on("progress", (data: IProgress) => {
      setProgress({
        list: [...progress.list, data],
        latest: data.progress,
      });
    });
  }, [socket]);

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
      let issueList: any[] = [];
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

        if (JSON.stringify(item).includes("error") || JSON.stringify(item).includes("Error") || JSON.stringify(item).includes(`"status":false`)) {
          issueList.push(item);
        }
        return item;
      });

      setIssues({
        ...issues,
        list: issueList,
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

  const handleShowIssues = () => {
    setIssues({
      ...issues,
      view: true,
    });
  };

  const handleTemplateFile = () => {
    const columns = ["username", "password", "firstName", "lastName", "email", "roles", "groups"];
    const rows: typeof columns = [];

    const csvContent = "data:text/csv;charset=utf-8," + columns.join(",") + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "userList.csv");
    document.body.appendChild(link); // Required for FF

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl">Create</h2>
        <span className="text-sm font-semibold text-muted-foreground">Create the user list here</span>
      </div>
      <div className="grid grid-flow-row-dense grid-cols-3 gap-3 mt-3 items-stretch">
        <div className="md:col-span-2 col-span-3 space-y-2">
          {/* Upload Dialog */}
          <Card className="md:col-span-2 col-span-3 hover-parent">
            <CardHeader>
              <div className="flex justify-between">
                <h4 className="text-lg font-semibold">Import User List</h4>
                <div className="flex gap-1">
                  <Button className="rounded-full hover-child" onClick={handleTemplateFile}>
                    <DocumentDownloadIcon className="h-5 w-5" />
                  </Button>

                  <Dialog>
                    <DialogTrigger ref={uploadDialogRef}>
                      <Button variant="primary" role="group" className=" rounded-3xl">
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
        <div className="col-span-3 md:col-span-1 h-full">
          <ProgressComponent errorList={errorList} setErrorList={setErrorList} progress={progress} stats={stats} action={action} />
        </div>
      </div>
      <div className="my-3 mb-10 pb-10 hover-parent">
        <Card>
          <CardHeader>
            <div className="flex justify-between align-center">
              <h3 className="text-lg font-semibold">Create</h3>
              <div className="flex gap-1 items-center divide-x-2">
                {stats.view && (
                  <div className="flex gap-3 hover-child">
                    <div className="flex flex-col w-fit  text-gray-900 dark:text-gray-200 p-1 px-2 rounded-sm ">
                      <div className="font-bold flex gap-1 mt-1 items-center">
                        <UsersIcon className="h-4 w-4" />
                        <span>{stats.total}</span>
                      </div>
                    </div>
                    <div className="flex flex-col w-fit  text-teal-600  dark:text-teal-500 p-1 px-2 rounded-sm ">
                      <div className="font-bold flex gap-1 mt-1 items-center">
                        <CheckIcon className="h-4 w-4" />
                        <span>{stats.failed}</span>
                      </div>
                    </div>
                    <div className="flex flex-col w-fit  text-pink-500 dark:text-pink-500  p-1 px-2 rounded-sm ">
                      <div className="font-bold flex gap-1 mt-1 items-center">
                        <XIcon className="h-4 w-4" />
                        <span>{stats.success}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="inline-block mx-2 min-h-[1em] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50"></div>
                {issues.list.length > 0 && (
                  <TemplateModal
                    trigger={
                      <Button variant="destructive" className="bg-pink-100 text-pink-500 dark:text-pink-300 dark:bg-pink-500 p-1 px-2" onClick={handleShowIssues} disabled={isLoading}>
                        <ExclamationTriangleIcon className="h-4 w-4" />
                      </Button>
                    }
                    size="3xl"
                    title="Issues"
                    description="Issues with the user list file"
                    action={<></>}>
                    <div className="max-h-screen h-96 min-h-fit overflow-y-scroll">
                      <DataTable data={issues.list} columns={UserTableColumns} />
                    </div>
                  </TemplateModal>
                )}

                <Select
                  onValueChange={(value: string) => {
                    setStats({ ...stats, view: false });
                    setAction(value);
                  }}
                  defaultValue={action}>
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
          <DataTable data={fileData ? fileData : []} columns={UserTableColumns} />
        </Card>
      </div>
    </div>
  );
};

const ProgressComponent = ({ errorList, setErrorList, progress, stats, action }: any) => {
  return (
    <>
      {errorList.length > 0 && (
        <Card className="hover-parent h-full">
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
            {errorList.map((item: IErrorObj, index: number) => {
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

      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Progress
            <div>
              <span className="bg-teal-500 text-teal-950 px-2 p-1 text-sm rounded-xl">{progress.latest}%</span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  );
};

export default CreateUsersPage;
