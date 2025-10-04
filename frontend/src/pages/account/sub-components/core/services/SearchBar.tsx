import Input from "../../../../../global/components/Input";
import Switch from "../../../../../global/components/Switch";


const SearchService = ({
    onSearch,
} : {
    onSearch: (query: string) => void;
}) => {
    return (
        <div className="services__header__tabs__search">
            <Input
                type="text"
                name="search"
                autoComplete={false}
                onChange={(value) => onSearch(value.toString().toLowerCase())}
                editMode={true}
                value=""
                label="Search services"
                required={false}
                fitContent={false}
            />                
        </div>
    )
}

export default SearchService;