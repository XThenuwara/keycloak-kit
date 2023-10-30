import React, { useContext } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LockClosedIcon, ShieldCheckIcon, TerminalIcon, UserIcon } from "@heroicons/react/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { checkAuth, getAuth, getRealmsForUser } from "../api/api";
import { IErrorObj, handleErrors } from "../lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserContext } from "../lib/provider/UserContextProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocketContext } from "../lib/provider/Websocket";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

const AuthenticationDrawer = () => {
  const { user, setUser } = useContext(UserContext);
  const { socket, identify } = useContext(SocketContext);
  const { toast } = useToast();
  const [errorList, setErrorList] = React.useState<IErrorObj[]>([]);
  const [isAuth, setIsAuth] = React.useState(false);
  const [realms, setRealms] = React.useState<string[]>([]);
  const [selectedRealm, setSelectedRealm] = React.useState<string>("master");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  React.useEffect(() => {
    handleCheckAuth();
    const intervalId = setInterval(handleCheckAuth, 30000); // 60,000 milliseconds = 1 minute

    // Clear the timer when the component unmounts to avoid memory leaks
    return () => clearInterval(intervalId);
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { username, password } = data;
    await updateStatus(username, password);
  };

  const updateStatus = async (username: string, password: string) => {
    try {
      const res = await getAuth(username, password);
      if (!res.status) throw new Error(res.msg);

      if (res) {
        handleSaveAuth(res.data);
      }
    } catch (e) {
      handleErrors(e, toast, setErrorList);
    }
  };

  const handleCheckAuth = async () => {
    try {
      const sessionData = sessionStorage.getItem("token");
      const tokenData = sessionData ? JSON.parse(sessionData) : null;
      if (tokenData) {
        const res = await checkAuth(tokenData);
        if (!res.status) throw new Error(res.msg);
        if (res) {
          handleSaveAuth(res.data);
        }
      }
    } catch (e) {
      handleErrors(e, toast, setErrorList);
    }
  };

  const getWhoami = async () => {
    try {
      const sessionData = sessionStorage.getItem("token");
      const tokenData = sessionData ? JSON.parse(sessionData) : null;
      if (tokenData) {
        const res = await getRealmsForUser(tokenData);
        if (!res.status) throw new Error(res.msg);
        if (res) {
          setIsAuth(true);
          setUser({ ...res.data, realm: selectedRealm ?? res.data.realm });
          // get realms from res.data.realm_access
          const realms = Object.keys(res.data.realm_access);
          setRealms(realms);
          return res.data;
        }
      }
      return null;
    } catch (e) {
      handleErrors(e, toast, setErrorList);
    }
  };

  const handleSaveAuth = async (tokenData: any) => {
    try {
      sessionStorage.setItem("token", JSON.stringify(tokenData));
      const user = await getWhoami();
      if (!user) throw new Error("No user found");

      const newAuth = { ...tokenData, ...user };

      sessionStorage.setItem("token", JSON.stringify(newAuth));
      setErrorList([]);
      setIsAuth(true);
      identify();
    } catch (e) {
      handleErrors(e, toast, setErrorList);
    }
  };

  const handleRealmChange = (value: string) => {
    setSelectedRealm(value);
    // update user context
    const updatedUser: any = { ...user, realm: value };
    setUser(updatedUser);
  };

  return (
    <Sheet>
      <SheetTrigger>
        <div className="inline-flex -z-10 relative cursor-pointer items-center justify-center rounded-xl border-none border-transparent bg-transparent p-2.5 font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text sm:flex">
          <UserIcon className="h-6 w-6" />
          {isAuth ? (
            <span className="text-xs absolute top-0 -right-2 bg-teal-400 px-2 p-1 rounded-xl">
              <LockClosedIcon className="h-3 w-3" />
            </span>
          ) : (
            <span className="text-xs absolute top-0 -right-2 bg-pink-400 px-2 p-1 rounded-xl">
              <LockClosedIcon className="h-3 w-3" />
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent>
        {/* <SheetHeader>
          <SheetTitle>Log into Keycloak</SheetTitle>
          <SheetDescription>Use Your admin login credentials here</SheetDescription>
        </SheetHeader> */}
        <Card className="overflow-y-scroll h-5/6">
          {/* <button onClick={()=> handleCheckAuth()}>xx</button> */}
          <CardHeader>
            <CardTitle>Log into Keycloak</CardTitle>
            <CardDescription>Use Your admin login credentials here</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                {isAuth ? (
                  <div>
                    <div className="bg-teal-400 px-2 p-2 text-teal-950 font-bold rounded-sm my-1 flex gap-1 shadow-md items-center">
                      <ShieldCheckIcon className="h-4 w-4" />
                      <h5>Hi {user?.displayName}You are logged in</h5>
                    </div>
                    <div className="flex justify-end" onClick={() => setIsAuth(false)}>
                      <Button variant="primary">log out</Button>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-md font-medium">Select A Realm</h3>
                      <Select onValueChange={(value: any) => handleRealmChange(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Realm" />
                        </SelectTrigger>
                        <SelectContent>
                          {realms.map((item, index) => (
                            <SelectItem key={index} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input placeholder="d@#r3jnasd" {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-1">
                      {errorList.map((error, index) => {
                        return (
                          <Alert key={index} variant="destructive">
                            <TerminalIcon className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error.msg}</AlertDescription>
                          </Alert>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4">
                      <Button type="submit" variant="default">
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  );
};

export default AuthenticationDrawer;
