import React, { useState, useEffect } from 'react';

function FoodWasteNews({ selectedState, onClose }) {
    const [topArticles, setTopArticles] = useState([]);

    const newsContainerPosition = selectedState && ['WA', 'NT', 'SA'].includes(selectedState) ? 'left' : 'right';

    useEffect(() => {
        if (selectedState) {
            const stateFullName = getStateFullName(selectedState);
            getTopArticles(stateFullName);
        }
    }, [selectedState]);

    const getStateFullName = (stateAbbreviation) => {
        const stateMapping = {
            WA: "Western Australia",
            QLD: "Queensland",
            NT: "Northern Territory",
            SA: "South Australia",
            VIC: "Victoria",
            NSW: "New South Wales",
            TAS: "Tasmania",
            ACT: "Australian Capital Territory",
        };
        return stateMapping[stateAbbreviation];
    };

    const getTopArticles = async (state) => {
        const api_key = "35a4a32e34fc42789cf618913f4ba0c0";

        try {
            const foodWasteNews = await getFoodWasteNews(api_key, state);
            if (foodWasteNews) {
                const articles = foodWasteNews.articles.slice(0, 4); // Get top 4 articles
                const filteredArticles = articles.filter(article => article.title !== "[Removed]");
                if (filteredArticles.length < 3) {
                    const remainingArticlesCount = 3 - filteredArticles.length;
                    const remainingArticles = (await getFoodWasteNews(api_key, "Australia")).articles.slice(0, remainingArticlesCount);
                    const filteredRemainingArticles = remainingArticles.filter(article => article.title !== "[Removed]");
                    setTopArticles([...filteredArticles, ...filteredRemainingArticles]);
                } else {
                    setTopArticles(filteredArticles);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getFoodWasteNews = async (apiKey, state) => {
        const url = `https://newsapi.org/v2/everything?q=food%20waste%20${encodeURIComponent(state)}%20Australia&apiKey=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };

    return (
        <div className={`news-container ${newsContainerPosition} ${selectedState ? 'show' : ''}`}>
            {selectedState && (
                <>
                    <h2 className="news-container-title">{selectedState}</h2>
                    <div className="close-button" onClick={onClose}>
                        &times;
                    </div>
                    {topArticles.map((article, index) => (
                        <div key={index} className="news-item">
                            <h3 className="news-title">{article.title}</h3>
                            {article.urlToImage && (
                                <img
                                    className="news-thumbnail"
                                    src={article.urlToImage}
                                    alt={`${article.title} thumbnail`}
                                />
                            )}
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-link"
                            >
                                Read More
                            </a>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default FoodWasteNews;