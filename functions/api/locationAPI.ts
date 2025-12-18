interface LocationData {
	latitude: number;
	longitude: number;
	street?: string | null;
	city?: string | null;
	timestamp?: number | string;
	source?: 'toggle' | 'mapview';
	stationId?: number;
	operator?: string;
	distance?: string;
}

export const sendLocationToAPI = async (locationData: LocationData): Promise<void> => {
	try {
		const apiUrl = 'https://api.maxxweb.net/location'; // Endpunkt anpassen falls nötig
		
		const payload = {
			latitude: locationData.latitude,
			longitude: locationData.longitude,
			street: locationData.street,
			city: locationData.city,
			timestamp: locationData.timestamp || new Date().toISOString(),
			source: locationData.source,
			...(locationData.stationId && { stationId: locationData.stationId }),
			...(locationData.operator && { operator: locationData.operator }),
			...(locationData.distance && { distance: locationData.distance }),
		};

		console.log('Sende Location an API:', apiUrl, payload);
		
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Falls Authentifizierung benötigt wird:
				// 'Authorization': 'Bearer YOUR_TOKEN',
			},
			body: JSON.stringify(payload),
		});

		console.log('API Response Status:', response.status, response.statusText);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('API Error Response:', errorText);
			throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
		}

		const data = await response.json();
		console.log('Location erfolgreich an API gesendet:', data);
	} catch (error) {
		console.error('Fehler beim Senden der Location an API:', error);
	}
};
