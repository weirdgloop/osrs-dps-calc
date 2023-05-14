import {
    useMultipleSelection,
    useSelect,
    UseSelectGetItemPropsOptions,
} from 'downshift';
import React, {useRef} from 'react';
import {FixedSizeList as List} from 'react-window';
import {IconTrash} from "@tabler/icons-react";

// TODO: change SelectItem to use TS generics
type SelectItem = {label: string, value: any};

const itemToString = (i: SelectItem | null) => (i ? i.label : '')

interface ISelectProps {
    id: string;
    items: SelectItem[];
    placeholder?: string;
    onSelectedItemChange?: (item: SelectItem[] | null | undefined) => void;
    className?: string;
    menuClassName?: string;
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
 * Generic multi-select component for us to use.
 *
 * @param props
 * @constructor
 */
const MultiSelect: React.FC<ISelectProps> = (props) => {
    const {
        id,
        items,
        onSelectedItemChange,
        placeholder,
        className,
        menuClassName,
        CustomItemComponent
    } = props;

    const menuRef = useRef<HTMLElement>(null);

    const {
        getSelectedItemProps,
        getDropdownProps,
        addSelectedItem,
        removeSelectedItem,
        selectedItems,
    } = useMultipleSelection({
        onSelectedItemsChange: (chg) => {
            if (onSelectedItemChange) onSelectedItemChange(chg.selectedItems as SelectItem[]);
        }
    })

    let it = items.filter((i) => {
        return !(selectedItems as SelectItem[]).find((i2) => i2.value === i.value);
    });

    const {
        getItemProps,
        getMenuProps,
        getToggleButtonProps,
        highlightedIndex,
        selectedItem,
        isOpen,
    } = useSelect({
        id,
        items: it,
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
        onStateChange: ({type, selectedItem: newSelectedItem}) => {
            switch (type) {
                case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
                case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
                case useSelect.stateChangeTypes.ItemClick:
                case useSelect.stateChangeTypes.ToggleButtonBlur:
                    if (newSelectedItem) {
                        addSelectedItem(newSelectedItem)
                    }
                    break
                default:
                    break
            }
        },
    });

    return (
        <div className={'relative'}>
            <div className={`bg-white cursor-pointer form-control flex items-center gap-2 ${className}`} {...getToggleButtonProps(
                getDropdownProps()
            )}>
                {selectedItems.map((i, ix) => {
                    let it = i as SelectItem;
                    return <span
                        key={ix}
                        className={'px-2 bg-gray-200 rounded flex items-center gap-1'}
                        {...getSelectedItemProps({
                            selectedItem: it,
                            index: ix,
                        })}
                    >
                        {it.label} <IconTrash className={'inline-block w-4 transition-colors hover:text-red'} onClick={(e) => {
                            e.stopPropagation();
                            removeSelectedItem(it);
                        }} />
                    </span>
                })}
                <span>{(placeholder || 'Select...')}</span>
            </div>
            <div
                className={`absolute bg-white rounded shadow-xl mt-1 border border-gray-300 z-10 text-black font-normal transition-opacity ${(isOpen && it.length) ? 'opacity-100' : 'opacity-0'} ${menuClassName}`}
                style={{fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'}}
                {...getMenuProps({
                    ref: menuRef
                })}
            >
                {!isOpen || !it.length ? null : (
                    <List
                        itemSize={32}
                        height={(it.length < 10 ? it.length * 32 : 200)}
                        itemCount={it.length}
                        width={300}
                        itemData={{
                            items: it,
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

export default MultiSelect;