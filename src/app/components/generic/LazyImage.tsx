import React, {useState} from "react";
import {IconRotate2} from "@tabler/icons-react";

interface ILazyImageProps extends React.HTMLProps<HTMLImageElement> {
    // Whether to add max-height, max-width: 100% and object-fit: contain
    responsive?: boolean;
    // Whether to show a loading spinner while the image is loading
    showSpinner?: boolean;
}

const LazyImage: React.FC<ILazyImageProps> = (props) => {
    if (!props) {
        // todo i have no idea how this happens,
        // but there's an undefined-props call on first click of the equipment search
        return <></>;
    }
    
    const {responsive, showSpinner} = props;
    const [loading, setLoading] = useState(true);

    return <>
        {(showSpinner && loading) && (
            <div className={'max-h-full max-w-full'}>
                <IconRotate2 className={'w-4 animate-spin text-gray-300'} />
            </div>
        )}
        <img
            {...props}
            className={`${responsive ? 'max-h-full max-w-full object-contain' : ''} ${(showSpinner && loading) ? 'hidden' : 'visible'}`}
            onLoad={() => setLoading(false)}
        />
    </>
}

export default LazyImage;
