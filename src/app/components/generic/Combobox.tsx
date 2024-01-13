import {useCombobox} from 'downshift';
import React, {useEffect, useRef, useState} from 'react';
import {Virtuoso, VirtuosoHandle} from "react-virtuoso";

type ComboboxItem = {label: string, value: any};

const itemToString = <T extends ComboboxItem>(i: T | null) => (i ? i.label : '')

interface IComboboxProps<T> {
  id: string;
  value?: string;
  items: T[];
  placeholder?: string;
  onSelectedItemChange?: (item: T | null | undefined) => void;
  resetAfterSelect?: boolean;
  blurAfterSelect?: boolean;
  keepOpenAfterSelect?: boolean;
  className?: string;
  CustomItemComponent?: React.FC<{item: T, itemString: string}>;
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
    placeholder,
    className,
    CustomItemComponent,
  } = props;
  const [inputValue, setInputValue] = useState<string>(value || '');
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // When the passed value prop changes, also change the input value
  useEffect(() => {
    if (value) setInputValue(value);
  }, [value]);

  useEffect(() => {
    let newFilteredItems: T[] = items;

    // When the input value changes, change the filtered items
    if (inputValue) {
      const iv = inputValue.toLowerCase();
      newFilteredItems = items.filter((v) => v.label.toLowerCase().includes(iv));
    }

    setFilteredItems(newFilteredItems);
  }, [inputValue, items]);

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
    defaultIsOpen: props.keepOpenAfterSelect,
    onInputValueChange: ({inputValue: newValue}) => {
      setInputValue(newValue || '');
      setHighlightedIndex(0);
    },
    onSelectedItemChange: ({selectedItem}) => {
      if (onSelectedItemChange) onSelectedItemChange(selectedItem);
      if (resetAfterSelect) reset();
      if (blurAfterSelect) inputRef.current?.blur();
    },
    scrollIntoView: () => {},
    onHighlightedIndexChange: (changes) => {
      if (
        virtuosoRef.current &&
        changes.type !== useCombobox.stateChangeTypes.MenuMouseLeave &&
        changes.highlightedIndex !== undefined
      ) {
        virtuosoRef.current.scrollIntoView({index: changes.highlightedIndex});
      }
    }
  });

  const virtuosoRef = React.useRef<VirtuosoHandle>(null)

  return (
    <div>
      <input className={`form-control cursor-pointer ${className}`} {...getInputProps({ref: inputRef, open: isOpen, type: 'text', placeholder: (placeholder || 'Search...')})} />
      <div
          className={`absolute bg-white rounded dark:bg-dark-400 dark:border-dark-200 dark:text-white shadow-xl mt-1 border border-gray-300 z-10 transition-opacity ${(isOpen && filteredItems.length) ? 'opacity-100' : 'opacity-0'}`}
          {...getMenuProps({
            ref: menuRef
          })}
      >
        {!filteredItems.length ? null : (
            <Virtuoso
              ref={virtuosoRef}
              style={{ height: 200, width: 300 }}
              data={filteredItems}
              itemContent={(i, d) => {
                const itemString = itemToString(d);

                return (
                  <div
                    className={
                      `px-3 py-2 leading-none items-center text-sm cursor-pointer ${(highlightedIndex === i) ? 'bg-gray-200 dark:bg-dark-200' : ''}`
                    }
                    {...getItemProps({
                      index: i,
                      item: d
                    })}
                  >
                    {(() => {
                      if (CustomItemComponent) {
                        return <div><CustomItemComponent item={d} itemString={itemString}/></div>
                      } else {
                        return (
                          <div>
                            {itemString}
                          </div>
                        )
                      }
                    })()}
                  </div>
                )
              }}
            >
            </Virtuoso>
        )}
      </div>
    </div>
  )
}

export default Combobox;
