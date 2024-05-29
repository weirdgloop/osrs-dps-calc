import { useCombobox } from 'downshift';
import { fuzzyFilter } from 'fuzzbunny';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

type ComboboxItem = { label: string, version?: string, value: string | number };

const itemToString = <T extends ComboboxItem>(i: T | null) => (i ? i.label : '');

interface IComboboxProps<T> {
  id: string;
  value?: string;
  items: T[];
  placeholder?: string;
  onSelectedItemChange?: (item: T | null | undefined) => void;
  resetAfterSelect?: boolean;
  blurAfterSelect?: boolean;
  keepOpenAfterSelect?: boolean;
  keepPositionAfterSelect?: boolean;
  className?: string;
  CustomItemComponent?: React.FC<{ item: T, itemString: string }>;
  customFilter?: (v: T[], inputValue: string) => T[];
}

/**
 * Generic combobox component for us to use.
 *
 * I originally tried to use react-select to handle this, but it didn't work
 * well with a large dataset, like the monsters.json. So, we instead use the downshift library to build a headless
 * combobox component, and add all the necessary styling ourselves.
 *
 * @param props
 * @constructor
 */
const Combobox = <T extends ComboboxItem>(props: IComboboxProps<T>) => {
  const {
    id,
    value,
    items,
    onSelectedItemChange,
    resetAfterSelect,
    blurAfterSelect,
    keepPositionAfterSelect,
    keepOpenAfterSelect,
    placeholder,
    className,
    CustomItemComponent,
    customFilter,
  } = props;
  const [inputValue, setInputValue] = useState<string>(value || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [listHeight, setListHeight] = useState(200);

  // When the passed value prop changes, also change the input value
  useEffect(() => {
    if (value) setInputValue(value);
  }, [value]);

  const preprocessedItems = useMemo(() => items.map((item) => ({ item, valueToFilter: `${item.label} ${item.version ? item.version : ''}` })), [items]);

  const filteredItems = useMemo(() => {
    let newFilteredItems = items;

    // When the input value changes, change the filtered items
    if (inputValue) {
      newFilteredItems = fuzzyFilter(preprocessedItems, inputValue, { fields: ['valueToFilter'] }).map((match) => match.item.item);
    }

    if (customFilter !== undefined) {
      newFilteredItems = customFilter(newFilteredItems, inputValue);
    }

    return newFilteredItems;
  }, [inputValue, items, customFilter, preprocessedItems]);

  const {
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    isOpen,
    reset,
    setHighlightedIndex,
  } = useCombobox({
    id,
    items: filteredItems,
    inputValue,
    itemToString,
    onInputValueChange: ({ inputValue: newValue }) => {
      setInputValue(newValue || '');
      setHighlightedIndex(0);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (onSelectedItemChange) onSelectedItemChange(selectedItem);
      if (resetAfterSelect) reset();
      if (blurAfterSelect) inputRef.current?.blur();
    },
    scrollIntoView: () => {},
    onHighlightedIndexChange: (changes) => {
      if (
        virtuosoRef.current
        && changes.type !== useCombobox.stateChangeTypes.MenuMouseLeave
        && changes.highlightedIndex !== undefined
      ) {
        virtuosoRef.current.scrollIntoView({ index: changes.highlightedIndex });
      }
    },
    stateReducer: (state, actionAndChanges) => {
      let { changes } = actionAndChanges;
      const { type } = actionAndChanges;

      if (keepPositionAfterSelect) {
        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            if (onSelectedItemChange) onSelectedItemChange(changes.selectedItem);
            changes = {
              ...changes,
              inputValue, // Keep the input value the same
              selectedItem: null,
              highlightedIndex: state.highlightedIndex, // Keep the highlighted index the same
            };
            break;
          default:
            break;
        }
      }

      if (keepOpenAfterSelect) {
        switch (type) {
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick:
            changes = {
              ...changes,
              isOpen: true,
            };
            break;
          default:
            break;
        }
      }

      return changes;
    },
  });

  return (
    <div>
      <input
        className={`form-control cursor-pointer ${className}`}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getInputProps({
          ref: inputRef, open: isOpen, type: 'text', placeholder: (placeholder || 'Search...'),
        })}
      />
      <div
        className={`absolute bg-white rounded dark:bg-dark-400 dark:border-dark-200 dark:text-white shadow-xl mt-1 border border-gray-300 z-10 transition-opacity ${(isOpen && filteredItems.length) ? 'opacity-100' : 'opacity-0'}`}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getMenuProps({
          ref: menuRef,
        })}
      >
        {!isOpen || !filteredItems.length ? null : (
          <div style={{ height: listHeight, maxHeight: '200px', width: 300 }}>
            <Virtuoso
              ref={virtuosoRef}
              data={filteredItems}
              totalListHeightChanged={setListHeight}
              itemContent={(i, d) => {
                const itemString = itemToString(d);

                return (
                  <div
                    className={
                      `px-3 py-2 leading-none items-center text-sm cursor-pointer ${(highlightedIndex === i) ? 'bg-gray-200 dark:bg-dark-200' : ''}`
                    }
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...getItemProps({
                      index: i,
                      item: d,
                    })}
                  >
                    {(() => {
                      if (CustomItemComponent) {
                        return <div><CustomItemComponent item={d} itemString={itemString} /></div>;
                      }
                      return (
                        <div>
                          {itemString}
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Combobox;
