import classNames from "classnames";
import Pill from "./Pill";


function EnvEntry({ environment }) {
  let [, prNumber] = environment.revision.pr.split("pr-");
  if (!prNumber) {
    prNumber = environment.revision.pr;
  }

  return (
    <div className="flex flex-col bg-white border shadow-sm rounded-xl mb-5">
      <div className="p-4 md:p-5">
        <div className="flex flex-row justify-between">
          <h3 className="text-lg font-bold">
            {environment.name} - {environment.id}
          </h3>
          <div>
            <Pill
              className={classNames({
                "bg-yellow-200 text-black":
                  environment.sync_status === "paused",
                "bg-red-500 text-white":
                  environment.sync_status === "not_synced",
              })}
            >
              {environment.sync_status}
            </Pill>
            {environment.dangling && (
              <Pill className="ml-2 bg-gray-500 text-white">Dangling</Pill>
            )}
          </div>
        </div>
        <p className="mt-2 text-gray-500 dark:text-neutral-400 mb-4">
          {environment.image}
        </p>
        <div className="flex flex-col mb-5">
          <h5 className="font-bold mb-2">Created</h5>
          <p className="mt-2">{environment.created_at}</p>
        </div>

        <div className="flex flex-col mb-5">
          <h5 className="font-bold mb-2">Last commit</h5>
          <p className="mt-2">
            <code>{environment.revision.commit}</code> from{" "}
            {environment.revision.author}
          </p>
        </div>

        <div className="flex flex-col mb-5">
          <h5 className="font-bold mb-2">Pull Request</h5>
          <p className="mt-2">
            <a
              className="font-semibold text-blue-500"
              href={environment.revision.pr_link}
              target="_blank"
            >
              {environment.revision.pr}{" "}
            </a>
          </p>
        </div>

        <a
          className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
          href={`https://${prNumber}.prenv.trento.suse.com`}
          target="_blank"
        >
          Link
          <svg
            className="shrink-0 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </a>
      </div>
      <div className="bg-gray-100 border-t rounded-b-xl py-3 px-4 md:py-4 md:px-5">
        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
          Status: {environment.status}
        </p>
      </div>
    </div>
  );
}

function EnvTable({ environments = [] }) {
  if (environments.length === 0) {
    return (
      <div className="min-h-60 flex flex-col bg-white border shadow-sm rounded-xl">
        <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
          <svg
            className="size-10"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" x2="2" y1="12" y2="12"></line>
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            <line x1="6" x2="6.01" y1="16" y2="16"></line>
            <line x1="10" x2="10.01" y1="16" y2="16"></line>
          </svg>
          <p className="mt-2 text-sm text-gray-800">No data to show</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            {environments.map((d) => (
              <EnvEntry environment={d} key={d.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnvTable;
