import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUserLanguage } from "../services/utils/selectors";

import { TMDB_API_KEY } from "./config";

/**
 * Get list items from filmography data
 *
 * @param {*} data
 * @param {*} type
 * @returns
 */

const getFilmographyElements = (data, type) => {
    let baseArray = [];
    if (type === "acting" && data.cast) baseArray = data.cast;
    else if (type === "directing" && data.crew) baseArray = data.crew;

    const movies =
        baseArray &&
        baseArray
            .filter(
                (movie) =>
                    movie.release_date &&
                    (type === "acting"
                        ? movie.adult === false
                        : movie.adult === false && movie.job === "Director") &&
                    !movie.genre_ids.includes(99 || 10770) &&
                    movie.genre_ids.length > 0
            )
            .sort(
                (a, b) =>
                    parseInt(a.release_date.slice(0, 4)) -
                    parseInt(b.release_date.slice(0, 4))
            )
            .map((movie) => (
                <li key={movie.id}>
                    <Link to={`/movies/${movie.id}`}>{movie.title} </Link>
                    {movie.title !== movie.original_title && (
                        <span>
                            (<em>{movie.original_title}</em>)
                        </span>
                    )}{" "}
                    {movie.release_date && (
                        <span>({movie.release_date.slice(0, 4)})</span>
                    )}{" "}
                    {type === "acting" && movie.character && (
                        <span>: {movie.character}</span>
                    )}
                </li>
            ));
    return movies;
};

/**
 * Get a person's main data
 *
 * @param {Number} personId
 * @returns { Object }
 */

const getPersonMainData = async (personId, language) => {
    if (personId) {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}&language=${language}`
            );
            const person = response.json();
            return person;
        } catch (error) {
            console.log(error);
        }
    }
};

/**
 * Get a person's filmography
 *
 * @param { Number } personId
 * @returns { Object }
 */

const getFilmography = async (personId, language) => {
    if (personId) {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}&language=${language}&with_original_language=en`
            );
            const data = await response.json();
            const actingMovies = getFilmographyElements(data, "acting");
            const directingMovies = getFilmographyElements(data, "directing");
            const filmography = { actingMovies, directingMovies };
            return filmography;
        } catch (error) {
            console.log(error);
        }
    }
};

/**
 * Get a person's photo from Wikipedia API
 * API documentation : https://en.wikipedia.org/w/api.php
 *
 * @param {Number} personId
 * @returns
 */

const getPersonPhotoFromWikipedia = async (personId) => {
    const person = await getPersonMainData(personId);
    const personFormatedName = person.name.replace(" ", "_");

    if (personFormatedName) {
        // To avoid CORS blocking, include "origin=*" in fetch url
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=300&origin=*&titles=${personFormatedName}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        const firstPart = data.query.pages;
        const imgUrl = Object.keys(firstPart).reduce(
            (acc, key) =>
                firstPart[key].thumbnail && firstPart[key].thumbnail.source,
            ""
        );
        return imgUrl;
    }
};

/**
 * get a person's complete data
 *
 * @param {Number} personId
 * @returns
 */

export const getPersonFullData = async (personId, language) => {
    const mainData = await getPersonMainData(personId, language);
    const imgUrl = await getPersonPhotoFromWikipedia(personId);
    const filmography = await getFilmography(personId, language);
    return {
        mainData,
        imgUrl,
        filmography,
    };
};