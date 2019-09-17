import { Component } from 'react';
import PropTypes from "prop-types";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
    let i = from;
    const range = [];
  
    while (i <= to) {
        range.push(i);
        i += step;
    }
  
    return range;
};

class Paginacion extends Component {
    constructor(props) {
        super(props);
        const { totalRecords = null, pageLimit = 20, pageNeighbours = 0 } = props;

        this.pageLimit = typeof pageLimit === "number" ? pageLimit : 20;
        this.totalRecords = typeof totalRecords === "number" ? totalRecords : 0;

        this.pageNeighbours =
            typeof pageNeighbours === "number"
                ? Math.max(0, Math.min(pageNeighbours, 2))
                : 0;

        this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);

        this.state = { currentPage: 1, totalPages: this.totalPages, totalRecords: this.totalRecords };
    }

    componentDidMount() {
        this.gotoPage(1);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.totalRecords !== this.state.totalRecords){
            const totalPages = Math.ceil(nextProps.totalRecords / this.pageLimit);
            this.setState({ totalPages, totalRecords: nextProps.totalRecords }, () => this.gotoPage(1))
        }
    }
    

    gotoPage = (page) => {
        const { onPageChanged = f => f } = this.props;
        const currentPage = Math.max(0, Math.min(page, this.state.totalPages));
        if (currentPage !== this.state.currentPage && currentPage > 0){
            const paginationData = {
                currentPage,
                totalPages: this.state.totalPages,
                pageLimit: this.pageLimit,
                totalRecords: this.state.totalRecords
            };
            this.setState({ currentPage }, () => onPageChanged(paginationData));
        }
    };

    handleClick = (page, evt) => {
        evt.preventDefault();
        this.gotoPage(page);
    };
    
    handleMoveLeft = evt => {
        evt.preventDefault();
        this.gotoPage(this.state.currentPage - this.pageNeighbours * 2 - 1);
    };
    
    handleMoveRight = evt => {
        evt.preventDefault();
        this.gotoPage(this.state.currentPage + this.pageNeighbours * 2 + 1);
    };

    fetchPageNumbers = () => {
        const totalPages = this.state.totalPages;
        const currentPage = this.state.currentPage;
        const pageNeighbours = this.pageNeighbours;
        const totalNumbers = this.pageNeighbours * 2 + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            let pages = [];

            const leftBound = currentPage - pageNeighbours;
            const rightBound = currentPage + pageNeighbours;
            const beforeLastPage = totalPages - 1;

            const startPage = leftBound > 2 ? leftBound : 2;
            const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

            pages = range(startPage, endPage);

            const pagesCount = pages.length;
            const singleSpillOffset = totalNumbers - pagesCount - 1;

            const leftSpill = startPage > 2;
            const rightSpill = endPage < beforeLastPage;

            const leftSpillPage = LEFT_PAGE;
            const rightSpillPage = RIGHT_PAGE;

            if (leftSpill && !rightSpill) {
                const extraPages = range(startPage - singleSpillOffset, startPage - 1);
                pages = [leftSpillPage, ...extraPages, ...pages];
            } else if (!leftSpill && rightSpill) {
                const extraPages = range(endPage + 1, endPage + singleSpillOffset);
                pages = [...pages, ...extraPages, rightSpillPage];
            } else if (leftSpill && rightSpill) {
                pages = [leftSpillPage, ...pages, rightSpillPage];
            }

            return [1, ...pages, totalPages];
        }

        return range(1, totalPages);
    };

    render() {
        if (!this.state.totalRecords) return null;

        if (this.state.totalPages === 1) return null;

        const { currentPage } = this.state;
        const pages = this.fetchPageNumbers();

        return (
            <nav className="pagination is-pulled-right" role="navigation" aria-label="pagination">
                <ul className="pagination-list">
                    {pages.map((page, index) => {
                        if (page === LEFT_PAGE)
                            return (
                                <li key={index}>
                                    <a
                                        className="pagination-link"
                                        aria-label="Anterior"
                                        href="#"
                                        onClick={this.handleMoveLeft}>
                                            <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                            );
                        if (page === RIGHT_PAGE)
                        return (
                            <li key={index}>
                                <a
                                    className="pagination-link"
                                    aria-label="Siguiente"
                                    href="#"
                                    onClick={this.handleMoveRight}>
                                        <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        );

                        return (
                            <li key={index}>
                                <a
                                    className={`pagination-link ${currentPage === page ? " is-current" : ""}`}
                                    aria-label={`Ir a pagina ${page}`}
                                    href="#"
                                    onClick={e => this.handleClick(page, e)}
                                    aria-current="page">
                                        { page }
                                </a>
                            </li>
                        )
                    })}
                </ul>
                <style jsx>{`
                    .is-current {
                        background-color: #209cee;
                        border-color: transparent;
                    }
                    .pagination {
                        margin-bottom: 1rem;
                    }
                `}</style>
            </nav>
        )
    }
}

Paginacion.propTypes = {
    totalRecords: PropTypes.number.isRequired,
    pageLimit: PropTypes.number,
    pageNeighbours: PropTypes.number,
    onPageChanged: PropTypes.func
};

export default Paginacion;