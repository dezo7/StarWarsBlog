import React, { useState, useEffect, useRef } from "react";
import getState from "./flux.js";

export const Context = React.createContext(null);

const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		const storeRef = useRef();
		const [state, setState] = useState(() => {
			const initialState = {
				people: [],
				vehicles: [],
				planets: [],
				favorites: [],
				isLoading: false,
				isError: false,
				errorMessage: ""
			};

			return getState({
				getStore: () => storeRef.current.store,
				setStore: updatedStore => {
					setState(prevState => {
						console.log("Previous state:", prevState);
						console.log("Updates to apply:", updatedStore);
						const newState = {
							...prevState,
							store: {
								...prevState.store,
								...updatedStore,
							}
						};
						console.log("New state after update:", newState);
						return newState;
					});
				}
			});
		});

		storeRef.current = state;

		useEffect(() => {
			console.log('[AppContext useEffect] Trigger loadDataAll');
			state.actions.loadDataAll();  // Utilizando la nueva función que carga todas las categorías a la vez
		}, []);

		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};

	return StoreWrapper;
};

export default injectContext;
