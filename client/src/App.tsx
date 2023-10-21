import "./App.css";
import { ThemeProvider } from "./lib/provider/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Router from "./Router";
import { MantineProvider, createTheme } from "@mantine/core";
import UserContextProvider from "./lib/provider/UserContextProvider";
import { SocketContext, SocketContextProvider } from "./lib/provider/Websocket";

// Mantine Just for File Drop Zone
// will remove the dependency late
const theme = createTheme({
  /** Your theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <UserContextProvider>
        <SocketContextProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-900">
              <div className="hidden w-16 flex-shrink-0 md:block">
                <Sidebar />
              </div>

              <div className="relative w-full flex-1 md:overflow-hidden">
                <Navbar />
                <div className="md:absolute md:inset-x-0 md:top-16 md:bottom-0 rounded-up-left bg-white dark:bg-background shadow-xl">
                  <div className="h-full min-h-screen py-8 px-6 scrollbar md:overflow-y-auto md:px-8">
                    <Router />
                  </div>
                </div>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </SocketContextProvider>
      </UserContextProvider>
    </MantineProvider>
  );
}

export default App;
