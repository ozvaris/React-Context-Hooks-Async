import React, { useReducer, useEffect } from "react";

import useCombinedReducers from "use-combined-reducers";
import ArticleList from "./components/ArticleList";
import { articleReducer, articleStatusReducer } from "./store/articleReducer";
import { FETCHING_ARTICLES } from "./store/actionTypes";
import { createContext } from "react";

import axios from "axios";
import apiURL from "../src/config/APIUrls";

const App = () => {
  const DispatchContext = createContext(null);

  const [state, dispatch] = useCombinedReducers({
    articles: useReducer(articleReducer, []),
    articlesStatus: useReducer(articleStatusReducer, FETCHING_ARTICLES),
  });

  const { articles, articlesStatus } = state;

  const fetchAllArticles = async () => {
    return await axios.get(apiURL.rss_abc_news_feed)
      .then((data) => {
        console.log("Recieved data from NEWS API.......Yay!!!!!!!");
        return data.data.items;
      })
      .catch((error) => {
        console.log("error 1->", error);
      });
  };

  useEffect(() => {
    dispatch({ type: "FETCHING_ARTICLES" });

    fetchAllArticles()
      .then((data) => {
        dispatch({ type: "ADD_ARTICLES", data });
        dispatch({ type: "FETCHED_ARTICLES" });
      })
      .catch((error) => {
        console.log("error ->", error);
      });
  }, []); //This line is IMPORTANT since the [] makes sure it is also called only once !!!!

  return (
    <DispatchContext.Provider value={dispatch}>
      <ArticleList articles={articles} articlesStatus={articlesStatus} />
    </DispatchContext.Provider>
  );
};

export default App;
