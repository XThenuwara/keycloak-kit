import { ArrowNarrowUpIcon, CloudUploadIcon, CursorClickIcon, FolderAddIcon } from "@heroicons/react/outline";
import { Button } from "../components/ui/button";
import KeycloakImg from "../assets/Keycloak-logo.png";

const HomePage = () => {
  return (
    <div className="">
      <div className="card-track ">
        <div className="card-wrapper ">
          <div className="card ">
            <div className="card-image bg-opacity-80 bg-white dark:bg-black dark:bg-opacity-70">
              <section>
                <div className="max-w-screen-xxl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                  <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16">
                    <div>
                      <img src={KeycloakImg} alt="" className="h-28 aspect-auto" />
                      <h1 className="text-5xl">Get Started</h1>
                      <h5 className="text-muted-foreground mt-3 font-medium text-lg">
                        In just three simple steps, seamlessly import your user list into Keycloak, streamlining your authentication and access management process effortlessly.
                      </h5>
                      <div className="mt-6 flex gap-2">
                        <Button>Documentation</Button>
                        <Button variant="outline">Create</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div className="block rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
                        <span className="inline-block rounded-lg bg-gray-50 dark:bg-background p-3">
                          <FolderAddIcon className="h-6 w-6" />
                        </span>

                        <h2 className="mt-2 font-bold">1. Excel</h2>

                        <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-400">Create the excel file with the configurations</p>
                      </div>

                      <div className="block rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
                        <span className="inline-block rounded-lg bg-gray-50 dark:bg-background p-3">
                          <CloudUploadIcon className="h-6 w-6" />
                        </span>

                        <h2 className="mt-2 font-bold">2. Upload</h2>

                        <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-400">Upload the File to the app</p>
                      </div>

                      <div className="block rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring">
                        <span className="inline-block rounded-lg bg-gray-50 dark:bg-background p-3">
                          <CursorClickIcon className="h-6 w-6" />
                        </span>

                        <h2 className="mt-2 font-bold">3. Create</h2>

                        <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-400">Create Users with one click</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="card-gradient"></div>
            <div className="card-letters"></div>
          </div>
          <div className="card-corners">
            <span className="card-corner"></span>
            <span className="card-corner"></span>
            <span className="card-corner"></span>
            <span className="card-corner"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
