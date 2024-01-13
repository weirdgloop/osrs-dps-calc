import {
  GetPropsCommonOptions,
  useSelect,
  UseSelectGetItemPropsOptions,
  UseSelectGetToggleButtonPropsOptions
} from 'downshift';
import React, {useEffect, useRef} from 'react';
import {Virtuoso, VirtuosoHandle} from "react-virtuoso";

type SelectItem = {label: string, value: any};

const itemToString = <T extends SelectItem>(i: T | null) => (i ? i.label : '')

interface ISelectProps<T> {
  id: string;
  value?: T;
  items: T[];
  placeholder?: string;
  onSelectedItemChange?: (item: T | null | undefined) => void;
  resetAfterSelect?: boolean;
  className?: string;
  menuClassName?: string;
  CustomSelectComponent?: React.FC<{getToggleButtonProps: (options?: UseSelectGetToggleButtonPropsOptions | undefined, otherOptions?: GetPropsCommonOptions | undefined) => any}>
  CustomItemComponent?: React.FC<{item: T, itemString: string}>;
}

/**
 * Generic select component for us to use.
 *
 * @param props
 * @constructor
 */
const Select = <T extends SelectItem>(props: ISelectProps<T>) => {
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

  const menuRef = useRef<HTMLDivElement>(null);

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
    },
    scrollIntoView: () => {},
    onHighlightedIndexChange: (changes) => {
      if (
        virtuosoRef.current &&
        changes.type !== useSelect.stateChangeTypes.MenuMouseLeave &&
        changes.highlightedIndex !== undefined
      ) {
        virtuosoRef.current.scrollIntoView({index: changes.highlightedIndex});
      }
    }
  });

  useEffect(() => {
    if (value !== undefined) {
      selectItem(value);
    }
  }, [selectItem, value]);

  const virtuosoRef = React.useRef<VirtuosoHandle>(null)

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
        {!items.length ? null : (
          <Virtuoso
            ref={virtuosoRef}
            style={{ height: 200, width: 300 }}
            data={items}
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

export default Select;
