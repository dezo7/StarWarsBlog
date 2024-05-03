import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const Details = () => {
	const { category, id } = useParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`https://www.swapi.tech/api/${category}/${id}`);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const json = await response.json();
				setData(json.result);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [category, id]);

	// Construimos la URL de la imagen
	const imageUrl = `https://starwars-visualguide.com/assets/img/${category === 'people' ? 'characters' : category}/${id}.jpg`;

	const renderCategoryDetails = (data) => {
		const details = {
			people: [
				{ label: 'Height', value: data.properties.height },
				{ label: 'Mass', value: data.properties.mass },
				{ label: 'Hair Color', value: data.properties.hair_color },
				{ label: 'Skin Color', value: data.properties.skin_color },
				{ label: 'Eye Color', value: data.properties.eye_color },
				{ label: 'Birth Year', value: data.properties.birth_year },
				{ label: 'Gender', value: data.properties.gender }
			],
			vehicles: [
				{ label: 'Model', value: data.properties.model },
				{ label: 'Vehicle Class', value: data.properties.vehicle_class },
				{ label: 'Manufacturer', value: data.properties.manufacturer },
				{ label: 'Cost in Credits', value: data.properties.cost_in_credits },
				{ label: 'Length', value: data.properties.length },
				{ label: 'Crew', value: data.properties.crew },
				{ label: 'Passengers', value: data.properties.passengers }
			],
			planets: [
				{ label: 'Diameter', value: data.properties.diameter },
				{ label: 'Rotation Period', value: data.properties.rotation_period },
				{ label: 'Orbital Period', value: data.properties.orbital_period },
				{ label: 'Gravity', value: data.properties.gravity },
				{ label: 'Population', value: data.properties.population },
				{ label: 'Climate', value: data.properties.climate },
				{ label: 'Terrain', value: data.properties.terrain },
				{ label: 'Surface Water', value: data.properties.surface_water }
			]
		}[category];

		return (
			<>
				<div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
					{details.map(detail => (
						<div key={detail.label + '_label'} style={{ textAlign: 'center', flex: 1 }}>
							<strong>{detail.label}</strong>
						</div>
					))}
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
					{details.map(detail => (
						<div key={detail.label + '_value'} style={{ textAlign: 'center', flex: 1 }}>
							{detail.value}
						</div>
					))}
				</div>
			</>
		);
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!data) return <p>No data found</p>;

	return (
		<div className="container mt-5">
			<div className="text-center">
				<h1>{data?.properties.name}</h1>
				<img src={imageUrl} />
				<p>{data?.description}</p>
			</div>
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div style={{ flex: 1 }}>
					{data && renderCategoryDetails(data)}
				</div>
			</div>
		</div>
	);

};

export default Details;
