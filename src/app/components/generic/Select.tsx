import {
  GetPropsCommonOptions,
  useSelect,
  UseSelectGetToggleButtonPropsOptions,
} from 'downshift';
import React, { useEffect, useRef, useState } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

type SelectItem = { label: string };

const itemToString = <T extends SelectItem>(i: T | null) => (i ? i.label : '');

interface ISelectProps<T> {
  id: string;
  value?: T;
  items: T[];
  placeholder?: string;
  onSelectedItemChange?: (item: T | null | undefined) => void;
  resetAfterSelect?: boolean;
  className?: string;
  menuClassName?: string;
  CustomSelectComponent?: React.FC<{ getToggleButtonProps: (options?: UseSelectGetToggleButtonPropsOptions | undefined, otherOptions?: GetPropsCommonOptions | undefined) => unknown }>
  CustomItemComponent?: React.FC<{ item: T, itemString: string }>;
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
    CustomItemComponent,
  } = props;

  const menuRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [listHeight, setListHeight] = useState(200);

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
    onIsOpenChange: (changes) => {
      if (changes.isOpen) {
        // When the menu opens, detect where it is on the page
        const pos = menuRef.current?.getBoundingClientRect();
        if (pos) {
          // If it's near the bottom of the viewport, open it "upwards" instead of downwards
          if (pos.bottom > ((window.innerHeight || document.documentElement.clientHeight) / 1.5)) {
            menuRef.current?.classList.add('bottom-[100%]');
          } else {
            menuRef.current?.classList.remove('bottom-[100%]');
          }

          // If it would overflow the right edge of the viewport, align the right edges of the select and dropdown elements instead of the left edges
          if (pos.right > window.innerWidth) {
            menuRef.current?.classList.add('right-0');
          }
        }
      }
    },
    onSelectedItemChange: (changes) => {
      if (onSelectedItemChange) onSelectedItemChange(changes.selectedItem);
      if (resetAfterSelect) selectItem(null);
    },
    scrollIntoView: () => {},
    onHighlightedIndexChange: (changes) => {
      if (
        virtuosoRef.current
        && changes.type !== useSelect.stateChangeTypes.MenuMouseLeave
        && changes.highlightedIndex !== undefined
      ) {
        virtuosoRef.current.scrollIntoView({ index: changes.highlightedIndex });
      }
    },
  });

  useEffect(() => {
    if (value !== undefined) {
      selectItem(value);
    }
  }, [selectItem, value]);

  return (
    <div className="relative">
      {(() => {
        if (CustomSelectComponent) {
          return <CustomSelectComponent getToggleButtonProps={getToggleButtonProps} />;
        }
        return (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <div className={`bg-white cursor-pointer form-control ${className}`} {...getToggleButtonProps()}>
            {selectedItem ? selectedItem.label : (placeholder || 'Select...')}
          </div>
        );
      })()}
      <div
        className={`absolute bg-white dark:bg-dark-400 dark:border-dark-200 dark:text-white rounded shadow-xl mt-1 border border-gray-300 z-10 text-black font-normal transition-opacity ${(isOpen && items.length) ? 'opacity-100' : 'opacity-0'} ${menuClassName}`}
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif' }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...getMenuProps({
          ref: menuRef,
        })}
      >
        {!isOpen || !items.length ? null : (
          <div style={{ height: listHeight, maxHeight: '200px', width: 300 }}>
            <Virtuoso
              ref={virtuosoRef}
              totalListHeightChanged={setListHeight}
              data={items}
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

export default Select;
