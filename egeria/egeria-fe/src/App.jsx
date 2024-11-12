import Bar from "./components/Bar";
import EnvTable from "./components/EnvTable";

function App() {
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
                    <EnvTable />
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
