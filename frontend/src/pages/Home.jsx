import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import MovieCard from "../components/MovieCard";
import YearFilter from "../components/filters/YearFilter";
import GenresFilter from "../components/filters/GenresFilter";
import SearchFilter from "../components/filters/SearchFilter";
import Pagination from "../components/Pagination";
import ErrorMessage from "../components/ErrorMessage";
import Language from "../components/Language";

import { Box, Typography } from "@mui/material";

import { setUserInfo } from "../utils/requests";

import { selectFiltersAll } from "../services/utils/selectors";

import styled from "styled-components";

const StyledResultsGrid = styled.div`
    background-color: black;
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 1rem;
`;

const Home = () => {
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        setUserInfo(token);
        // to add : handle request error
    }, []);

    const filters = useSelector(selectFiltersAll());

    const [numberOfPages, setNumberOfPages] = useState(1);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [movies, setMovies] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const queryFilters = filters
            .filter((filter) => filter.value !== "")
            .map((filter) => filter.param + filter.value)
            .join("");

        fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=2d0a75daa1b16703efb5d87960c9e67e${queryFilters}`,
            {
                method: "GET",
            }
        )
            .then((response) => response.json())
            .then((data) => {
                setNumberOfPages(
                    data.total_pages > 500 ? 500 : data.total_pages
                );
                setNumberOfResults(data.total_results);
                const results = data.results.map((movie) => {
                    const movieData = {
                        id: movie.id,
                        imdbId: movie.imdb_id,
                        title: movie.title,
                        originalTitle: movie.original_title,
                        tagline: movie.tagline,
                        genres: movie.genres,
                        overview: movie.overview,
                        backdropPath: movie.backdrop_path,
                        posterPath: movie.poster_path,
                        releaseDate: movie.release_date,
                        voteAverage: movie.vote_average,
                        budget: movie.budget,
                        revenue: movie.revenue,
                    };
                    return <MovieCard key={movie.id} movieData={movieData} />;
                });
                setMovies(results);
            })
            .catch((error) => {
                setErrorMessage("Impossible d'afficher les films.");
                console.error(error);
            });
    }, [filters]);

    return (
        <Box component="main">
            <h1>Explore</h1>
            <section>
                <Box
                    sx={{
                        border: "1px solid black",
                        margin: "2rem",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}>
                    <SearchFilter />
                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "2rem",
                        }}>
                        <YearFilter setCurrentPage={setCurrentPage} />
                        <GenresFilter />
                    </Box>
                </Box>
                <Box
                    sx={{
                        border: "1px solid black",
                        margin: "2rem",
                        padding: "1rem",
                    }}>
                    <Typography>
                        Number of results: {numberOfResults}{" "}
                        {numberOfResults > 10000 && (
                            <span>(10 000 max. available)</span>
                        )}
                    </Typography>
                </Box>
                <Language />
                <Pagination
                    numberOfPages={numberOfPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
                <StyledResultsGrid>{movies}</StyledResultsGrid>

                <ErrorMessage errorMessage={errorMessage} />
            </section>
        </Box>
    );
};

export default Home;
