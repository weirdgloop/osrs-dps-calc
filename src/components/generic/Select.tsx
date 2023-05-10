import {
  GetPropsCommonOptions,
  useSelect,
  UseSelectGetItemPropsOptions,
  UseSelectGetToggleButtonPropsOptions
} from 'downshift';
import React, {createRef} from 'react';
import {FixedSizeList as List} from 'react-window';
import {motion, AnimatePresence} from 'framer-motion';

// TODO: change SelectItem to use TS generics
type SelectItem = {label: string, value: any};

const itemToString = (i: SelectItem | null) => (i ? i.label : '')

interface ISelectProps {
  items: SelectItem[];
  placeholder?: string;
  onSelectedItemChange?: (item: SelectItem | null | undefined) => void;
  resetAfterSelect?: boolean;
  className?: string;
  CustomSelectComponent?: React.FC<{getToggleButtonProps: (options?: UseSelectGetToggleButtonPropsOptions | undefined, otherOptions?: GetPropsCommonOptions | undefined) => any}>
  CustomItemComponent?: React.FC<{item: SelectItem, itemString: string}>;
}

interface IItemRendererProps {
  index: number;
  style: any;
  data: {
    items: SelectItem[];
    getItemProps: (options: UseSelectGetItemPropsOptions<any>) => any;
    highlightedIndex: number;
    selectedItem: any;
    CustomItemComponent?: React.FC<{item: SelectItem, itemString: string}>;
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
 * Generic select component for us to use.
 *
 * @param props
 * @constructor
 */
const Select: React.FC<ISelectProps> = (props) => {
  const {
    items,
    onSelectedItemChange,
    resetAfterSelect,
    placeholder,
    className,
    CustomSelectComponent,
    CustomItemComponent
  } = props;
  const menuRef = createRef<HTMLDivElement>();

  const {
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    selectedItem,
    isOpen,
    selectItem,
  } = useSelect({
    items,
    itemToString,
    onSelectedItemChange: ({selectedItem}) => {
      if (onSelectedItemChange) onSelectedItemChange(selectedItem);
      if (resetAfterSelect) selectItem(null);
    }
  });

  return (
    <div>
      {(() => {
        if (CustomSelectComponent) {
          return <CustomSelectComponent getToggleButtonProps={getToggleButtonProps} />
        } else {
          return (
            <div className={`bg-white cursor-pointer form-control ${className}`} {...getToggleButtonProps()}>
              {selectedItem ? selectedItem.label : (placeholder || 'Select...')}
            </div>
          )
        }
      })()}
      <AnimatePresence>
        {!isOpen || !items.length ? null : (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className={'absolute bg-white rounded shadow-xl mt-1 border border-gray-300 z-10 text-black font-normal font-sans'}
            {...getMenuProps({
              ref: menuRef
            })}
          >
            <List
              itemSize={30}
              height={200}
              itemCount={items.length}
              width={300}
              itemData={{
                items,
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

export default Select;