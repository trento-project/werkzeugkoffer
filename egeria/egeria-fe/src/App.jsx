import { useEffect, useState } from "react";
import Bar from "./components/Bar";
import EnvTable from "./components/EnvTable";

function LoadingSpinner() {
  return (
    <div
      className="mx-auto inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}
function App() {
  const [environments, setEnvironments] = useState([]);
  const [environmentsLoading, setEnvironmentsLoading] = useState(false);
  const [environmentsError, setEnvironmentsError] = useState(false);

  useEffect(() => {
    setEnvironmentsLoading(true);
    fetch("/api/v1/environments")
      .then((r) => r.json())
      .then(({ data }) => setEnvironments(data || []))
      .catch((error) => {
        console.error(error);
        setEnvironmentsError(true);
      })
      .finally(() => setEnvironmentsLoading(false));
  }, []);

  return (
    <>
      <div className="min-h-full">
        <Bar />

        <header className="bg-white shadow">
          <div className="mx-auto max-w-[80%] px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Running PR Environments
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto px-11 py-6 max-w-[60%]">
            <div className="flex flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden">
                    {environmentsError && (
                      <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                      >
                        <strong className="font-bold">Fetch error!</strong>
                        <span className="block sm:inline">
                          Something went wrong, check the service log and reload
                          the page to try again.
                        </span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                          <svg
                            className="fill-current h-6 w-6 text-red-500"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <title>Close</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                          </svg>
                        </span>
                      </div>
                    )}
                    {environmentsLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <EnvTable environments={environments} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
