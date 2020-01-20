import React from 'react';
import Search from './Search'
import {
	ReactiveList,
	ResultCard,
} from '@appbaseio/reactivesearch';

import './index.css';

class Results extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			showFooter: false
		}
	}

	showFooter = ({data}) => {
		console.log(data)
		if(!data || !data.length) {
			return this.setState({ showFooter: false})
		}
		this.setState({showFooter: true})
	}

	render() {
		return (
			<div className="row">
				<div className="col">
					<Search id="Movie" />

					<ReactiveList
						componentId="ResultList"
						dataField={["original_title", "original_title.search"]}
						size={8}
						className="result-list-container"
						pagination
						react={{ and: ["Movie"] }}
						onData={this.showFooter}
						render={({ data }) => {
							return (
								<>
									<ReactiveList.ResultCardsWrapper>
										{data.map(item => (
											<ResultCard key={item.id}>
												<ResultCard.Image src={
													"https://image.tmdb.org/t/p/w500" +
													item.poster_path
												} />
												<ResultCard.Title>
													<div
														className="movie-title"
														dangerouslySetInnerHTML={{
															__html: item.original_title,
														}}
													/>
												</ResultCard.Title>

												<ResultCard.Description>
													<div className="flex column justify-space-between">
														<div>
															<div>
																<span className="authors-list">
																	{item.tagline}
																</span>
															</div>
															<div className="ratings-list flex align-center">
																<span className="stars">
																	{Array(Math.floor((item.vote_average == null ? 0 : item.vote_average) / 2))
																		.fill('x')
																		.map((item, index) => (
																			<i
																				className="fas fa-star"
																				key={index}
																			/>
																		)) // eslint-disable-line
																	}
																</span>
																<span className="avg-rating">
																	({item.vote_count} avg)
																</span>
															</div>
														</div>
														<span className="pub-year">
															Release: {item.release_year}
														</span>
													</div>
												</ResultCard.Description>
											</ResultCard>

										))}
									</ReactiveList.ResultCardsWrapper>
								</>
							)
						}}
					/>
					{
						this.state.showFooter ?
							<div>
								Source Code on <a class="newanchor" href="https://github.com/appbaseio-apps/query-suggestions-demo">GitHub</a> - Powered by <a class="newanchor" href="https://appbase.io/">Appbase.io</a>
							</div> : null
					}

				</div>

			</div>

		);
	}

}

export default Results;
