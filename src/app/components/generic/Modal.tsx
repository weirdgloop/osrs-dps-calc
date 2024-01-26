import React, { Fragment, PropsWithChildren, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { classNames } from '@/utils';
import { IconX } from '@tabler/icons-react';

interface IModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string | ReactNode;
  hideCloseButton?: boolean;
  footerChildren?: ReactNode;
}

const Modal: React.FC<PropsWithChildren<IModalProps>> = (props) => {
  const {
    isOpen, setIsOpen, title, children, hideCloseButton, footerChildren,
  } = props;

  return (
    <Transition
      show={isOpen}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      as={Fragment}
    >
      <Dialog onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white dark:bg-dark-300 dark:text-white text-black shadow-xl">
            <Dialog.Title className="py-3 text-md bg-btns-300 dark:bg-dark-500 font-bold rounded-t-lg text-center text-white font-serif select-none relative flex justify-center items-center">
              {title}
              {!hideCloseButton && (
                <button
                  type="button"
                  className={classNames(
                    'text-sm',
                    'absolute',
                    'right-4',
                    'text-gray-400',
                    'hover:text-white',
                  )}
                  aria-label="Close"
                  onClick={() => setIsOpen(false)}
                >
                  <IconX />
                </button>
              )}
            </Dialog.Title>
            <div className="px-4 py-2 max-w-xl my-2 mx-auto">
              {children}
            </div>
            {footerChildren && (
              <div className="p-4 border-t border-gray-300 dark:border-dark-200 flex gap-2 justify-between">
                {footerChildren}
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
