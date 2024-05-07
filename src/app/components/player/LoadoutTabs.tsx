import { useStore } from '@/state';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface DraggableTabs {
  calculateButtonClasses(index: number): string;
  calculateButtonTransform(index: number): number;
  handleMouseDown(e: React.MouseEvent, index: number): void;
  handleMouseOver(e: React.MouseEvent, index: number): void;
  handleMouseUp(): void;
}

const DraggableTabsContext = createContext<DraggableTabs>({
  calculateButtonClasses: () => '',
  calculateButtonTransform: () => 0,
  handleMouseDown: () => {},
  handleMouseOver: () => {},
  handleMouseUp: () => {},
});

const DraggableTabsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const store = useStore();
  const {
    loadouts,
    selectedLoadout,
    deleteLoadout,
    setLoadouts,
    setSelectedLoadout,
  } = store;

  const [draggedTab, setDraggedTab] = useState(-1);
  const [dragStartCoords, setDragStartCoords] = useState({ x: 0, y: 0 });
  const [draggedOverTab, setDraggedOverTab] = useState(-1);
  const [dragTimeout, setDragTimeout] = useState<NodeJS.Timeout | null>(null);
  const [transitionOn, setTransitionOn] = useState(true);

  const calculateButtonClasses = useCallback(
    (index: number) => [
      'w-[40px] h-full text-left first:md:rounded-tl px-4 py-1 border-l-2 first:border-l-0',
      'last:rounded-tr border-body-100 dark:border-dark-300',
      selectedLoadout === index
        ? 'bg-orange-400 dark:bg-orange-700'
        : 'bg-btns-400 dark:bg-dark-400',
      transitionOn ? 'transition-transform  transition-colors' : '',
      draggedTab > -1 ? 'cursor-grabbing' : 'cursor-pointer',
    ].join(' '),
    [selectedLoadout, transitionOn, draggedTab],
  );

  const calculateButtonTransform = useCallback(
    (index: number) => {
      const elementWidth = 40;

      if (draggedTab === -1 || draggedOverTab === -1) return 0;
      if (index === draggedTab && index === draggedOverTab) return 0;
      if (index === draggedTab) {
        return elementWidth * (draggedOverTab - draggedTab);
      }
      if (index < draggedTab && index >= draggedOverTab) return elementWidth;
      if (index > draggedTab && index <= draggedOverTab) return -elementWidth;

      return 0;
    },
    [draggedTab, draggedOverTab],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    if (e.button === 1) {
      deleteLoadout(index);
      return;
    }
    setSelectedLoadout(index);
    const rects = e.currentTarget.getBoundingClientRect();
    setDragTimeout(
      setTimeout(() => {
        setDraggedTab(index);
        setDraggedOverTab(index);
        setDragStartCoords({ x: rects.x, y: rects.y });
      }, 100),
    );
  }, [setSelectedLoadout, deleteLoadout]);

  const handleMouseUp = useCallback(() => {
    if (dragTimeout) clearTimeout(dragTimeout);

    if (draggedTab > -1 && draggedOverTab > -1) {
      setSelectedLoadout(draggedOverTab);
      setTransitionOn(false);
      setTimeout(() => {
        setTransitionOn(true);
      }, 150);

      const newLoadouts = [...loadouts];
      newLoadouts.splice(draggedTab, 1);
      newLoadouts.splice(draggedOverTab, 0, loadouts[draggedTab]);

      setLoadouts([...newLoadouts]);

      setDraggedTab(-1);
      setDraggedOverTab(-1);
    }
  }, [dragTimeout, draggedTab, draggedOverTab, loadouts, setSelectedLoadout, setLoadouts]);

  const handleMouseOver = useCallback(
    (e: React.MouseEvent, index: number) => {
      if (draggedTab !== index) {
        const deltaX = e.clientX - dragStartCoords.x;
        setDraggedOverTab(
          Math.max(
            0,
            Math.min(
              loadouts.length - 1,
              draggedTab + Math.round((deltaX - 20) / 40),
            ),
          ),
        );
      }
    },
    [draggedTab, loadouts, dragStartCoords],
  );

  const handleContainerMouseLeave = () => {
    setDraggedTab(-1);
    setDraggedOverTab(-1);
  };

  const contextValue = useMemo(
    () => ({
      calculateButtonClasses,
      calculateButtonTransform,
      handleMouseDown,
      handleMouseOver,
      handleMouseUp,
    }),
    [
      calculateButtonClasses,
      calculateButtonTransform,
      handleMouseDown,
      handleMouseOver,
      handleMouseUp,
    ],
  );

  return (
    <DraggableTabsContext.Provider value={contextValue}>
      <div
        className="my-1 flex h-full relative"
        onMouseLeave={handleContainerMouseLeave}
      >
        {children}
      </div>
    </DraggableTabsContext.Provider>
  );
};

const useDraggableTabs = (index: number) => {
  const handlers = useContext(DraggableTabsContext);

  return {
    calculateButtonClasses: () => handlers.calculateButtonClasses(index),
    calculateButtonTransform: () => handlers.calculateButtonTransform(index),
    handleMouseDown: (e: React.MouseEvent) => handlers.handleMouseDown(e, index),
    handleMouseOver: (e: React.MouseEvent) => handlers.handleMouseOver(e, index),
    handleMouseUp: handlers.handleMouseUp,
  };
};

const LoadoutTabButton: React.FC<{ index: number }> = ({ index }) => {
  const {
    calculateButtonClasses,
    calculateButtonTransform,
    handleMouseDown,
    handleMouseOver,
    handleMouseUp,
  } = useDraggableTabs(index);
  return (
    <div>
      <button
        type="button"
        className={calculateButtonClasses()}
        style={{
          transform: `translate(${calculateButtonTransform()}px)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        onMouseOver={handleMouseOver}
      >
        <span className="select-none pointer-events-none">{index + 1}</span>
      </button>
    </div>
  );
};

const LoadoutTabs: React.FC = () => {
  const store = useStore();
  const { loadouts } = store;

  return (
    <DraggableTabsProvider>
      {loadouts.map((_, ix) => (
        // eslint-disable-next-line react/no-array-index-key
        <LoadoutTabButton key={ix} index={ix} />
      ))}
    </DraggableTabsProvider>
  );
};

export default LoadoutTabs;
