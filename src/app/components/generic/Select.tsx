import {
  GetPropsCommonOptions,
  useSelect,
  UseSelectGetItemPropsOptions,
  UseSelectGetToggleButtonPropsOptions
} from 'downshift';
import React, {useEffect, useRef} from 'react';
import {FixedSizeList as List} from 'react-window';

// TODO: change SelectItem to use TS generics
type SelectItem = {label: string, value: any};

const itemToString = (i: SelectItem | null) => (i ? i.label : '')

interface ISelectProps {
  id: string;
  value?: SelectItem;
  items: SelectItem[];
  placeholder?: string;
  onSelectedItemChange?: (item: SelectItem | null | undefined) => void;
  resetAfterSelect?: boolean;
  className?: string;
  menuClassName?: string;
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
    id,
    value,
    items,
    onSelectedItemChange,
    resetAfterSelect,
    placeholder,
    className,
    menuClassName,
    CustomSelectComponent,
    CustomItemComponent
  } = props;

  const menuRef = useRef<HTMLElement>(null);

  const {
    getItemProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    selectedItem,
    isOpen,
    selectItem,
  } = useSelect({
    id,
    items,
    itemToString,
    onIsOpenChange: ({isOpen}) => {
      if (isOpen) {
        // When the menu opens, detect where it is on the page
        const pos = menuRef.current?.getBoundingClientRect();
        if (pos) {
          // If it's near the bottom of the viewport, open it "upwards" instead of downwards
          if (pos.bottom > ((window.innerHeight || document.documentElement.clientHeight) / 1.5)) {
            menuRef.current?.classList.add('bottom-[100%]');
          } else {
            menuRef.current?.classList.remove('bottom-[100%]');
          }
        }
      }
    },
    onSelectedItemChange: ({selectedItem}) => {
      if (onSelectedItemChange) onSelectedItemChange(selectedItem);
      if (resetAfterSelect) selectItem(null);
    }
  });

  useEffect(() => {
    if (value !== undefined) {
      selectItem(value);
    }
  }, [selectItem, value]);

  return (
    <div className={'relative'}>
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
      <div
          className={`absolute bg-white dark:bg-dark-400 dark:border-dark-200 dark:text-white rounded shadow-xl mt-1 border border-gray-300 z-10 text-black font-normal transition-opacity ${(isOpen && items.length) ? 'opacity-100' : 'opacity-0'} ${menuClassName}`}
          style={{fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'}}
          {...getMenuProps({
            ref: menuRef
          })}
      >
        {!isOpen || !items.length ? null : (
            <List
              itemSize={32}
              height={(items.length < 10 ? items.length * 32 : 200)}
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
        )}
      </div>
    </div>
  )
}

export default Select;