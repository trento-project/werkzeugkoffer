import classNames from "classnames";
import Pill from "./Pill";

const data = {
  data: [
    {
      id: "eac4794fd6a493d6b30f2345fe44806f6d5de59b0dc5d39113ec997d0001d2c4",
      name: "3056web",
      image: "ghcr.io/trento-project/trento-web:3056-env",
      status: "Up 11 hours",
      sync_status: "synced",
      dangling: false,
      created_at: "2024-11-12T10:12:36Z",
      revision: {
        pr: "pr-3056",
        pr_link: "https://github.com/trento-project/web/pull/3056",
        commit:
          "Merge 04926c71a8bd739e1e39816a9afa5e063cf732fc into e4de1f9d058e23999d1dfae4de24389519e740ec",
        author: "nelsonkopliku",
      },
    },
    {
      id: "cbec71df19cb69b5aebabac54adf4a62b5c7b1a948d6b9242e0756548cb83a2c",
      name: "3111web",
      image: "ghcr.io/trento-project/trento-web:3111-env",
      status: "Up 30 hours",
      sync_status: "synced",
      dangling: false,
      created_at: "2024-11-11T14:55:41Z",
      revision: {
        pr: "pr-3111",
        pr_link: "https://github.com/trento-project/web/pull/3111",
        commit:
          "Merge d63f6b685825ab0a1aa00d92ba252320a7a62c63 into f7f26de6096230a0efe744d237a224394a3e73ba",
        author: "EMaksy",
      },
    },
    {
      id: "19b2b79c7e795f1aa751ef7fadd12c232a4dc5403cda18c706e1604ceaf90236",
      name: "3125web",
      image: "ghcr.io/trento-project/trento-web:3125-env",
      status: "Up 5 days",
      sync_status: "synced",
      dangling: false,
      created_at: "2024-11-07T08:28:08Z",
      revision: {
        pr: "pr-3125",
        pr_link: "https://github.com/trento-project/web/pull/3125",
        commit:
          "Merge 905cd1132b2c107af4d87a0aa440429509f17b5c into 2c21098a057bdb2c4a25a86f01e28e0cc667f066",
        author: "arbulu89",
      },
    },
    {
      id: "30749b7a2de9a95591e9cb4ce78052cdbee481b67b5028b2d447bf1524d1cbeb",
      name: "search-pocweb",
      image: "ghcr.io/trento-project/trento-web:search-poc-env",
      status: "Up 4 weeks",
      sync_status: "not_synced",
      dangling: true,
      created_at: "2024-10-10T09:23:28Z",
      revision: {
        pr: "search-poc",
        pr_link: "https://github.com/trento-project/web/pull/poc",
        commit: "clear unused",
        author: "balanza",
      },
    },
  ],
};

function EnvTable() {
  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            {/* <table className="min-w-full">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium  uppercase "
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium  uppercase "
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium  uppercase "
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium  uppercase "
                  >
                    Sync
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium  uppercase "
                  >
                    Dangling
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium  uppercase "
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-start text-xs font-medium  uppercase "
                  >
                    Last Commit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {data.data.map((d) => (
                  <tr key={d.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  ">
                      {d.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  ">
                      {d.image}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  ">
                      {d.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  ">
                      {d.sync_status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  ">
                      {d.dangling.toString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  ">
                      {d.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm  ">
                      {d.revision.commit} - {d.revision.author}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}

            {data.data.map((d) => (
              <div
                key={d.id}
                className="flex flex-col bg-white border shadow-sm rounded-xl mb-5"
              >
                <div className="p-4 md:p-5">
                  <div className="flex flex-row justify-between">
                    <h3 className="text-lg font-bold">
                      {d.name} - {d.id}
                    </h3>
                    <div>
                      <Pill
                        className={classNames({
                          "bg-yellow-200 text-black":
                            d.sync_status === "paused",
                          "bg-red-500 text-white":
                            d.sync_status === "not_synced",
                        })}
                      >
                        {d.sync_status}
                      </Pill>
                      {d.dangling && (
                        <Pill className="ml-2 bg-gray-500 text-white">
                          Dangling
                        </Pill>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-neutral-400 mb-4">
                    {d.image}
                  </p>
                  <div className="flex flex-col mb-5">
                    <h5 className="font-bold mb-2">Created</h5>
                    <p className="mt-2">{d.created_at}</p>
                  </div>

                  <div className="flex flex-col mb-5">
                    <h5 className="font-bold mb-2">Last commit</h5>
                    <p className="mt-2">
                      <code>{d.revision.commit}</code> from {d.revision.author}
                    </p>
                  </div>

                  <div className="flex flex-col mb-5">
                    <h5 className="font-bold mb-2">Pull Request</h5>
                    <p className="mt-2">
                      <a
                        href={d.revision.pr_link}
                        className="font-semibold text-blue-500"
                      >
                        {d.revision.pr}{" "}
                      </a>
                    </p>
                  </div>

                  <a
                    className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
                    href="#"
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
                    Status: {d.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnvTable;
