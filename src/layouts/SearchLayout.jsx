import React from 'react';

const SearchLayout = props => {
    const { onFilter, placeHolderText } = props;
    const [query, setQuery] = React.useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        onFilter(query);
    };

    return (
        <form onSubmit={handleSearch}>
            <div className="row mb-5">
                <div className="col-md-12">
                    <div className="input-group serch-sec">
                        <input
                            type="search"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="form-control rounded"
                            placeholder={placeHolderText}
                            aria-label="Search"
                            aria-describedby="search-addon"
                        />
                        <button
                            type="submit"
                            className="btn btn-outline-primary"
                            onClick={handleSearch}
                        >
                            Go
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SearchLayout;
