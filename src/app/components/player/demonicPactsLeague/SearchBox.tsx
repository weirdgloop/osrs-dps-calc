import { observer } from 'mobx-react-lite';
import { useStore } from '@/state';

const SearchBox = observer(() => {
  const store = useStore();

  return (
    <>
      <div className="px-4 py-2 bg-[#28221d] shadow-lg flex flex-row gap-4 w-full items-center justify-between hidden md:flex">
        <h2 className="text-shadow-md">
          Search Demonic Pacts:
        </h2>
        <input
          type="text"
          className="form-control rounded flex-grow"
          value={store.ui.leagues.six.pactsSearchQuery}
          placeholder="Search pact descriptions..."
          onChange={(e) => {
            (store.ui.leagues.six.pactsSearchQuery = e.target.value);
          }}
        />
        <div className="w-28 text-right text-sm">
          {store.ui.leagues.six.pactsSearchQuery
              && (store.nodesMatchingSearch.size > 0
                ? `${store.nodesMatchingSearch.size} highlighted`
                : 'No matches')}
        </div>
      </div>
      <div className="px-4 py-2 bg-[#28221d] shadow-lg flex flex-col gap-2 w-full md:hidden items-center">
        <div className="flex items-center gap-2 w-full">
          <h2 className="text-shadow-md">
            Search:
          </h2>
          <input
            type="text"
            className="form-control rounded flex-grow"
            value={store.ui.leagues.six.pactsSearchQuery}
            placeholder="Search pact descriptions..."
            onChange={(e) => {
              (store.ui.leagues.six.pactsSearchQuery = e.target.value);
            }}
          />
        </div>
        {store.ui.leagues.six.pactsSearchQuery
                      && (
                      <div className="w-28 text-right text-sm">
                        {store.nodesMatchingSearch.size > 0
                          ? `${store.nodesMatchingSearch.size} highlighted`
                          : 'No matches'}
                      </div>
                      )}
      </div>
    </>
  );
});

export default SearchBox;
