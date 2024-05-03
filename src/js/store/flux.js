const getState = ({ getStore, setStore }) => {
	// Intentar cargar los favoritos desde localStorage al inicializar
	const initialFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

	const initialState = {
		people: [],
		vehicles: [],
		planets: [],
		favorites: initialFavorites,
		isLoading: false,
		isError: false,
		errorMessage: ""
	};

	return {
		store: initialState,
		actions: {
			loadData: async (category) => {
				const store = getStore();
				if (store[category].length === 0) {
					setStore({ isLoading: true });
					try {
						const response = await fetch(`https://www.swapi.tech/api/${category}`);
						if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
						const data = await response.json();

						setStore({ [category]: data.results, isLoading: false });
					} catch (error) {
						setStore({ isError: true, errorMessage: error.message, isLoading: false });
					}
				}
			},
			loadDataAll: async () => {
				const categories = ['people', 'vehicles', 'planets'];
				const store = getStore();
				const localData = localStorage.getItem('swapiData');

				if (localData) {
					const storedData = JSON.parse(localData);
					setStore({ ...store, ...storedData, isLoading: false });
					return;
				}

				setStore({ isLoading: true });
				try {
					const dataPromises = categories.map(category =>
						fetch(`https://www.swapi.tech/api/${category}`)
							.then(response => {
								if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
								return response.json();
							})
							.then(data => ({ [category]: data.results }))
							.catch(error => {
								throw new Error(`Error loading data for ${category}: ${error.message}`);
							})
					);

					const results = await Promise.all(dataPromises);
					const updatedStore = results.reduce((acc, result) => ({ ...acc, ...result }), {});

					localStorage.setItem('swapiData', JSON.stringify(updatedStore)); // Save to localStorage

					setStore({ ...store, ...updatedStore, isLoading: false });
				} catch (error) {
					console.error(error);
					setStore({ isError: true, errorMessage: error.message, isLoading: false });
				}
			},
			addToFavorites: (item) => {
				const store = getStore();
				const link = `/details/${item.category}/${item.uid}`;
				const newFavorite = { name: item.name, link: link };
				const updatedFavorites = [...store.favorites, newFavorite];

				// Actualizar localStorage con los favoritos actualizados
				localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

				setStore({ favorites: updatedFavorites });
			},
			removeFromFavorites: (link) => {
				const store = getStore();
				const updatedFavorites = store.favorites.filter(fav => fav.link !== link);

				// Actualizar localStorage con los favoritos actualizados
				localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

				setStore({ favorites: updatedFavorites });
			}
		}
	};
};

export default getState;
