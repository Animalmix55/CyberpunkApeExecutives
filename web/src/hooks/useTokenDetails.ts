import axios from 'axios';
import React from 'react';
import { IERC721Metadata } from '../models/IERC721Metadata';
import { ERC721Meta } from '../models/Meta';

export const useTokenDetails = (
    id: number,
    contract?: IERC721Metadata
): ERC721Meta | undefined => {
    const [meta, setMeta] = React.useState<ERC721Meta>();

    React.useEffect(() => {
        if (!contract) return;
        contract.methods
            .tokenURI(id)
            .call()
            .then((uri) =>
                axios.get(uri).then((data) => {
                    setMeta(data.data as ERC721Meta);
                })
            );
    }, [contract, id]);

    return meta;
};

export default useTokenDetails;
