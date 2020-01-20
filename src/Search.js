import React from "react";
import { DataSearch } from "@appbaseio/reactivesearch";
import { withRouter } from "react-router-dom";
import logo from './resources/search_icon.png';

import "./styles.css";
import { getParamsValue } from "./utils";

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: getParamsValue(window.location.search)[props.id] || "",
      popular_searches: [],
      default_suggestions: []
    };
  }

  componentDidMount() {
    this.getDefaultSeuggestions();
  }

  getDefaultSeuggestions() {
    let arcClusterUrl = "https://arc-cluster-dc-test-2-b5c555.searchbase.io";
    var headers = new Headers();
    const data = {
      query: {
        match_all: {}
      },
      size: 20
    };

    headers.append(
      "Authorization",
      "Basic " +
      btoa("7CmMBPU4o" + ":" + "4ac08f4e-f8aa-4481-9257-bb5444964366")
    );
    headers.append("Content-Type", "application/json");

    fetch(arcClusterUrl + "/.suggestions/_search", {
      method: "POST",
      body: JSON.stringify(data),
      headers: headers
    })
      .then(res => res.json())
      .then(
        result => {
          console.log("result", result.hits.hits);
          var src = result.hits.hits;
          var arr = [];
          for (var i = 0; i < src.length; i++) {
            arr.push(src[i]["_source"]["key"]);
          }
          this.setState({
            default_suggestions: arr.map(i => ({ label: i, value: i }))
          });
        },
        error => {
          console.log("Error is", error);
        }
      );
  };


  getPopularSearches = value => {
    var headers = new Headers();
    const data = {
      query: {
        bool: {
          must: [
            {
              bool: {
                must: {
                  bool: {
                    should: [
                      {
                        multi_match: {
                          query: value,
                          fields: ["key"],
                          type: "best_fields",
                          operator: "or",
                          fuzziness: 0
                        }
                      },
                      {
                        multi_match: {
                          query: value,
                          fields: ["key"],
                          type: "phrase_prefix",
                          operator: "or"
                        }
                      }
                    ],
                    minimum_should_match: "1"
                  }
                }
              }
            }
          ]
        }
      },
      size: 3
    };

    let arcClusterUrl = "https://arc-cluster-dc-test-2-b5c555.searchbase.io";

    headers.append(
      "Authorization",
      "Basic " +
      btoa("7CmMBPU4o" + ":" + "4ac08f4e-f8aa-4481-9257-bb5444964366")
    );
    headers.append("Content-Type", "application/json");

    fetch(arcClusterUrl + "/.suggestions/_search", {
      method: "POST",
      body: JSON.stringify(data),
      headers: headers
    })
      .then(res => res.json())
      .then(
        result => {
          console.log("result", result.hits.hits);
          var src = result.hits.hits;
          var arr = [];
          for (var i = 0; i < src.length; i++) {
            arr.push(src[i]["_source"]["key"]);
          }
          this.setState({
            popular_searches: arr
          });
        },
        error => {
          console.log("Error is", error);
        }
      );
  };

  renderCustomSuggestions() {
    return ({
      loading,
      error,
      data,
      value,
      downshiftProps: { isOpen, getItemProps, highlightedIndex }
    }) => {
      if (loading) {
        return (
          <div className="custom-suggestions-box">
            <div className="custom-suggestions-container">
              Loading...
            </div>
          </div>
        );
      }
      if (error) {
        return (
          <div className="custom-suggestions-box">
            <div className="custom-suggestions-container">
              Something went wrong! Error details {JSON.stringify(error.message)}
            </div>
          </div>
        );
      }
      return isOpen && Boolean(value.length)
        ? [
          <div className="custom-suggestions-box">
            <div className="popular-searches-title">Movies</div>
            {data.slice(0, 4).map((suggestion, index) => (
              <div className="custom-suggestions-wrapper"
                style={{
                  background: highlightedIndex === index ? "#eee" : "white"
                }}
              >
                <div>
                  <img src={
                    "https://image.tmdb.org/t/p/w500" +
                    suggestion.source.poster_path
                  }
                    style={{ width: 45 }}
                  />
                </div>
                <div
                  className="custom-suggestions-container"
                  key={suggestion.value}

                  {...getItemProps({ item: suggestion })}
                >
                  {suggestion.value}
                </div>
              </div>
            ))}
            {Boolean(value.length) && (
              <div className="list-group">
                {this.state.popular_searches.length > 0 ? (
                  <div className="popular-searches-title">
                    {" "}
                    Popular Searches
                    </div>
                ) : null}
                {this.state.popular_searches.map((listitem, index) => (
                 
                      <li
                        className="list-group-item"
                        style={{
                          background:
                            highlightedIndex === data.slice(0, 4 ).length + index
                              ? "#eee"
                              : "white"
                        }}
                        {...getItemProps({
                          item: {
                            label: listitem,
                            value: listitem
                          }
                        })}
                      >
                        <img src={
                          logo
                        }
                          style={{ height:20, width: 20, marginRight:10}}
                        />
                        {listitem}
                      </li>

                ))}
              </div>
            )}
          </div>
        ]
        : null;
    };
  }

  changeSelectedValue = value => {
    this.setState({
      selected: value
    });
  };

  render() {
    const { id, history } = this.props;
    return (
        <div className="search-box">
        <DataSearch
          componentId="Movie"
          title="Movie Search Engine"
          dataField={["original_title", "original_title.search","tagline","tagline.search"]}
          fields ={[4,2,3,1]}
          autosuggest={true}
          placeholder="Search Movie"
          className="search-container"
          showIcon={true}
          render={this.renderCustomSuggestions()}
          iconPosition="right"
          react={{ and: ["ResultList"] }}
          onValueChange={value => {
            this.getPopularSearches(value);
          }}
          onValueSelected={value => history.push(`/search/?Movie="${value}"`)}
          innerClass={{
            input: "search-input",
            list: "search-list"
          }}
        />
      </div>
    );
  }
}

export default withRouter(Search);
