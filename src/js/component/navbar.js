import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);

	const renderFavorites = () => {
		return (
			<div className="dropdown">
				<button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Favorites ({store.favorites.length})
				</button>
				<div className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
					{store.favorites.length > 0 ? (
						store.favorites.map((fav, index) => (
							<div key={index} className="d-flex align-items-center justify-content-between">
								<a className="dropdown-item" href={fav.link}>
									{fav.name}
								</a>
								<i className="fas fa-trash me-2" onClick={(e) => {
									e.stopPropagation(); // Prevent dropdown from closing
									actions.removeFromFavorites(fav.link);
								}}></i>
							</div>
						))
					) : (
						<span className="dropdown-item">No favorites added yet.</span>
					)}
				</div>
			</div>
		);
	};

	return (
		<nav className="navbar navbar-light bg-light mb-3">
			<span className="navbar-brand mb-0 h1 ms-3"><a className="navbar-brand mb-0 h1 ms-3" href="/">Proyecto Blog Star Wars</a></span>
			<div className="ml-auto">
				{renderFavorites()}
			</div>
		</nav>
	);
};
