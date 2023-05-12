import {useCombobox, UseComboboxGetItemPropsOptions} from 'downshift';
import React, {createRef, useEffect, useState} from 'react';
import {FixedSizeList as List} from 'react-window';
import {motion, AnimatePresence} from 'framer-motion';

// TODO: change ComboboxItem to use TS generics
type ComboboxItem = {label: string, value: any};

const itemToString = (i: ComboboxItem | null) => (i ? i.label : '')

interface IComboboxProps {
  items: ComboboxItem[];
  placeholder?: string;
  onSelectedItemChange?: (item: ComboboxItem | null | undefined) => void;
  resetAfterSelect?: boolean;
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
 * Component for rendering each individual combobox item.
 *
 * @param props
 * @constructor
 */
const ItemRenderer: React.FC<IItemRendererProps> = (props) => {
  const {items, getItemProps, highlightedIndex, selectedItem, CustomItemComponent} = props.data;
  const item = items[props.index];
  const itemString = itemToString(item);

  return (
    <div
      className={
        `px-3 py-2 leading-none items-center text-sm cursor-pointer ${(highlightedIndex === props.index) ? 'bg-gray-200' : ''}`
      }
      {...getItemProps({
        index: props.index,
        item
      })}
      style={props.style}
    >
      {(() => {
        if (CustomItemComponent) {
          return <CustomItemComponent item={item} itemString={itemString} />
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
    items,
    onSelectedItemChange,
    resetAfterSelect,
    placeholder,
    className,
    CustomItemComponent,
  } = props;
  const menuRef = createRef<HTMLDivElement>();

  const [inputValue, setInputValue] = useState<string | undefined>('');
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  useEffect(() => {
    let newFilteredItems: ComboboxItem[] = items;

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
    selectedItem,
    isOpen,
    selectItem,
  } = useCombobox({
    items: filteredItems,
    inputValue,
    itemToString,
    onInputValueChange: ({inputValue: newValue}) => setInputValue(newValue),
    onSelectedItemChange: ({selectedItem}) => {
      if (onSelectedItemChange) onSelectedItemChange(selectedItem);
      if (resetAfterSelect) selectItem(null);
    }
  });

  return (
    <div>
      <input className={`form-control ${className}`} {...getInputProps({open: isOpen, type: 'text', placeholder: (placeholder || 'Search...')})} />
      <AnimatePresence>
        {!isOpen || !filteredItems.length ? null : (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className={'absolute bg-white rounded shadow-xl mt-1 border border-gray-300 z-10'}
            {...getMenuProps({
              ref: menuRef
            })}
          >
            <List
              itemSize={32}
              height={(filteredItems.length < 10 ? filteredItems.length * 32 : 200)}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Combobox;