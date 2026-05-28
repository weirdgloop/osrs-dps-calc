import { observer } from 'mobx-react-lite';
import { useUIState } from '@/state/UIStateStore';

const SearchBox = observer(() => {
  const { leagues, nodesMatchingSearch, updateUIState } = useUIState();
  const { pactsSearchQuery } = leagues.six;

  return (
    <>
      <div className="px-4 py-2 bg-[#28221d] shadow-lg flex flex-row gap-4 w-full items-center justify-between hidden md:flex">
        <h2 className="text-shadow-md">
          Search Demonic Pacts:
        </h2>
        <input
          type="text"
          className="form-control rounded flex-grow"
          value={pactsSearchQuery}
          placeholder="Search pact descriptions..."
          onChange={(e) => {
            updateUIState({ leagues: { six: { pactsSearchQuery: e.target.value } } });
          }}
        />
        <div className="w-28 text-right text-sm">
          {pactsSearchQuery
              && (nodesMatchingSearch.size > 0
                ? `${nodesMatchingSearch.size} highlighted`
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
            value={pactsSearchQuery}
            placeholder="Search pact descriptions..."
            onChange={(e) => {
              updateUIState({ leagues: { six: { pactsSearchQuery: e.target.value } } });
            }}
          />
        </div>
        {pactsSearchQuery
                      && (
                      <div className="w-28 text-right text-sm">
                        {nodesMatchingSearch.size > 0
                          ? `${nodesMatchingSearch.size} highlighted`
                          : 'No matches'}
                      </div>
                      )}
      </div>
    </>
  );
});

export default SearchBox;
