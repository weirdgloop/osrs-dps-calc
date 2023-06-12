import {useCombobox, UseComboboxGetItemPropsOptions} from 'downshift';
import React, {useEffect, useRef, useState} from 'react';
import {VariableSizeList as List} from 'react-window';

// TODO: change ComboboxItem to use TS generics
type ComboboxItem = {label: string, value: any};

const itemToString = (i: ComboboxItem | null) => (i ? i.label : '')

interface IComboboxProps {
  id: string;
  value?: string;
  items: ComboboxItem[];
  placeholder?: string;
  onSelectedItemChange?: (item: ComboboxItem | null | undefined) => void;
  resetAfterSelect?: boolean;
  blurAfterSelect?: boolean;
  className?: string;
  CustomItemComponent?: React.FC<{item: ComboboxItem, itemString: string}>;
}

interface IItemRendererProps {
  index: number;
  style: any;
  data: {
    items: ComboboxItem[];
    getItemProps: (options: UseComboboxGetItemPropsOptions<any>) => any;
    highlightedIndex: number;
    selectedItem: any;
    CustomItemComponent?: React.FC<{item: ComboboxItem, itemString: string}>;
  }
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
const Combobox: React.FC<IComboboxProps> = (props) => {
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

  // Virtualisation
  const listRef = useRef<List>(null);
  const rowHeights = useRef<{[k: number]: number}>({});

  const getRowHeight = (ix: number) => {
    return rowHeights.current[ix] + 15 || 30;
  }

  const setRowHeight = (ix: number, height: number) => {
    listRef.current?.resetAfterIndex(0);
    rowHeights.current = {...rowHeights.current, [ix]: height};
  }

  useEffect(() => {
    let newFilteredItems: ComboboxItem[] = items;

    // When the input value changes, change the filtered items
    if (inputValue) {
      const iv = inputValue.toLowerCase();
      newFilteredItems = items.filter((v) => v.label.toLowerCase().includes(iv));
    }

    setFilteredItems(newFilteredItems);
  }, [inputValue, items]);

  /**
   * Sub-component for rendering each individual combobox item.
   *
   * @param props
   * @constructor
   */
  const ItemRenderer: React.FC<IItemRendererProps> = (props) => {
    const {index} = props;
    const {items, getItemProps, highlightedIndex, CustomItemComponent} = props.data;
    const item = items[props.index];
    const itemString = itemToString(item);

    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (rowRef.current) {
        setRowHeight(index, rowRef.current.clientHeight);
      }
      // eslint-disable-next-line
    }, [rowRef]);

    return (
        <div
            className={
              `px-3 py-2 leading-none items-center text-sm cursor-pointer ${(highlightedIndex === props.index) ? 'bg-gray-200 dark:bg-dark-200' : ''}`
            }
            {...getItemProps({
              index: props.index,
              item
            })}
            style={props.style}
        >
          {(() => {
            if (CustomItemComponent) {
              return <div ref={rowRef}><CustomItemComponent item={item} itemString={itemString} /></div>
            } else {
              return (
                  <div ref={rowRef}>
                    {itemString}
                  </div>
              )
            }
          })()}
        </div>
    )
  }

  const {
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    selectedItem,
    isOpen,
      reset,
    setHighlightedIndex
  } = useCombobox({
    id,
    items: filteredItems,
    inputValue,
    itemToString,
    onIsOpenChange: () => {
      setHighlightedIndex(0);
    },
    onInputValueChange: ({inputValue: newValue}) => {
      setInputValue(newValue || '');
      listRef.current?.scrollToItem(0);
      setHighlightedIndex(0);
    },
    onSelectedItemChange: ({selectedItem}) => {
      if (onSelectedItemChange) onSelectedItemChange(selectedItem);
      if (resetAfterSelect) reset();
      if (blurAfterSelect) inputRef.current?.blur();
    }
  });

  return (
    <div>
      <input className={`form-control ${className}`} {...getInputProps({ref: inputRef, open: isOpen, type: 'text', placeholder: (placeholder || 'Search...')})} />
      <div
          className={`absolute bg-white rounded dark:bg-dark-400 dark:border-dark-200 dark:text-white shadow-xl mt-1 border border-gray-300 z-10 transition-opacity ${(isOpen && filteredItems.length) ? 'opacity-100' : 'opacity-0'}`}
          {...getMenuProps({
            ref: menuRef
          })}
      >
        {!isOpen || !filteredItems.length ? null : (
            <List
                ref={listRef}
              itemSize={getRowHeight}
              height={(filteredItems.length < 10 ? filteredItems.length * 36 : 200)}
                estimatedItemSize={35}
              itemCount={filteredItems.length}
              width={300}
              itemData={{
                items: filteredItems,
                getItemProps,
                highlightedIndex,
                selectedItem,
                CustomItemComponent
              }}
            >
              {ItemRenderer}
            </List>
        )}
      </div>
    </div>
  )
}

export default Combobox;