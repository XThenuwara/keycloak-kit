import React, { useContext, useEffect, useState } from "react";
import { Pagination } from "../lib/types";
import { UserContext } from "../lib/provider/UserContextProvider";
import { useToast } from "../components/ui/use-toast";
import { getUsers } from "../api/api";
import { UserViewTable, UserViewTableColumns } from "../components/UserViewTable";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { handleErrors } from "../lib/utils";
import { WebSocketDemo } from "../components/Websocket";

const ViewUsersPage = () => {
  const { user } = useContext(UserContext);
  const { toast } = useToast();
  const [pagination, setPagination] = useState<Pagination>({
    first: 0,
    max: 10,
    search: null,
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const auth = sessionStorage.getItem("token");
        if (!auth) throw new Error("No auth found");
        const requestObj = {
            realm: user?.realm,
            auth: JSON.parse(auth),
            pagination,
        };
        const response = await getUsers(requestObj);
        if (!response) throw new Error("No Response Found");
        if (response.error) throw new Error(response.message);
        const responseData = response.data;
        setData(responseData);
      } catch (e) {
        console.log(e);
        handleErrors(e, toast);
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl">View</h2>
        <span className="text-sm font-semibold text-muted-foreground">View the user list here, with their roles and group in one page</span>
      </div>
      <div>
        <Card className="mt-3">
          <div className="p-1 md:p-3 flex justify-between items-center">
            <h3>Search</h3>
            <Input className="w-[180]" placeholder="Search"/>
          </div>
        <UserViewTable data={data} columns={UserViewTableColumns} />
        </Card>
        <WebSocketDemo />
      </div>
    </div>
  );
};

export default ViewUsersPage;
