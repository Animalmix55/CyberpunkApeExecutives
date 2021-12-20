export interface ERC721Attribute {
    trait_type: string;
    value: string;
    /**
     * Special formatting in opensea.
     * @see https://docs.opensea.io/docs/metadata-standards
     */
    display_type?: 'number' | 'boost_percentage' | 'boost_number';
}

export interface ERC721Meta {
    description?: string;
    external_url?: string;
    image: string;
    name: string;
    attributes: ERC721Attribute[];
}
