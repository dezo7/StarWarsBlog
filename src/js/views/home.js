import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	useEffect(() => {
		console.log('[Home useEffect] Trigger loadDataAll');
		actions.loadDataAll();
	}, []);

	const renderCards = (data, category) => {
		console.log(`Rendering cards for ${category}`, data);
		if (store.isLoading) return <p>Loading {category}...</p>;
		if (store.isError) return <p>Error: {store.errorMessage}</p>;

		return data.map((item, index) => (
			<div key={index} className="col-md-4 mb-4">
				<div className="card m-4">
					<img
						src={`https://starwars-visualguide.com/assets/img/${category === 'people' ? 'characters' : category}/${item.uid}.jpg`}
						className="card-img-top img-fluid w-100"
						alt={item.name}
						style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
					/>
					<div className="card-body d-flex justify-content-between align-items-center">
						<div>
							<h5 className="card-title">{item.name}</h5>
							<p>Breve descripción.</p>
							<Link to={`/details/${category}/${item.uid}`} className="btn btn-primary">Learn more</Link>
						</div>
						<button className={`btn ${isItemInFavorites(category, item.uid) ? "btn-outline-danger" : "btn-outline-primary"}`} onClick={() => {
							if (isItemInFavorites(category, item.uid)) {
								actions.removeFromFavorites(`/details/${category}/${item.uid}`);
							} else {
								actions.addToFavorites({ ...item, category });
							}
						}}>
							<i className={`fa${isItemInFavorites(category, item.uid) ? "s" : "r"} fa-heart`}></i>
						</button>
					</div>
				</div>
			</div>
		));
	};

	const isItemInFavorites = (category, uid) => {
		const link = `/details/${category}/${uid}`;
		const isInFavorites = store.favorites.some(fav => fav.link === link);
		return isInFavorites;
	};

	return (
		<div className="container mt-5">
			<h1 className="text-center">Star Wars</h1>
			<div className="section mb-4">
				<h2>Characters</h2>
				<div className="d-flex flex-nowrap overflow-auto">{renderCards(store.people, 'people')}</div>
			</div>
			<div className="section mb-4">
				<h2>Vehicles</h2>
				<div className="d-flex flex-nowrap overflow-auto">{renderCards(store.vehicles, 'vehicles')}</div>
			</div>
			<div className="section">
				<h2>Planets</h2>
				<div className="d-flex flex-nowrap overflow-auto">{renderCards(store.planets, 'planets')}</div>
			</div>
		</div>
	);
};

export default Home;