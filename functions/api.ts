import { Operator, OperatorsResponse } from "../types/operator";
import { getSelectedValue } from "../types/operator";

//hier wird der Operator für den Picker geholt

const apiPath = "https://api.ladefuchs.app";
const authHeader = {
	headers: {
		Authorization: `Bearer ${process.env.API_TOKEN}`,
	},
};

export async function fetchOperators({ standard = true }): Promise<Operator[]> {
	try {
		const response = await fetch(
			`${apiPath}/v3/operators?standard=${standard}`,
			authHeader
		);
		if (!response.ok) {
			console.error(response);
			throw new Error(
				`Failed to fetch operators: status: ${response.status}`
			);
		}
		const data = (await response.json()) as OperatorsResponse;

		return data.operators;
	} catch (error) {
		console.error(error);
		return [];
	}
}

//Tarifinfos für den Operator der Ladesäule
// Abrufen des ausgewählten Operator
const selectedValue = getSelectedValue();

fetch('https://api.ladefuchs.app/v3/conditions', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  },
  body: JSON.stringify({
    operatorIds: [
//		'4957023c-87f7-4d88-836e-5d7513bec7b4'	//zum testen verwendet
 selectedValue	// string aus types/operator
    ],
    tariffsIds: [],
    chargingModes: [
      "ac",
      "dc"
    ]
  }),
})
.then(response => response.json())
.then(data => {
  // Zeige die empfangenen Daten in der Konsole an
  console.log('Empfangene Daten:', data);

  // Zugriff auf das Array
  const tariffConditions = data.tariffConditions;
  if (tariffConditions && tariffConditions.length > 0) {
    // Iteration über die Tarifbedingungen
    tariffConditions.forEach(tariff => {
      console.log('Operator ID:', tariff.operatorId);
      // Iteration über die Ladebedingungen
      tariff.chargingConditions.forEach(condition => {
        console.log('Tariff ID:', condition.tariffId);
        console.log('Tariff Name:', condition.tariffName);
        console.log('Charging Mode:', condition.chargingMode);
        console.log('Price per kWh:', condition.pricePerKwh);
        console.log('Blocking Fee:', condition.blockingFee);
        console.log('Blocking Fee Start:', condition.blockingFeeStart);
      });
    });
  } else {
    console.log('Keine Tarifbedingungen gefunden.');
  }
})
.catch(error => {
  console.error('Error:', error);
});

// Erstellen des JSON-Objekts mit dem ausgewählten Wert als Teil des operatorIds-Arrays
const requestBody = JSON.stringify({
	operatorIds: [
	  selectedValue // Hier wird der ausgewählte Wert als Teil des Arrays übergeben
	],
	tariffsIds: [],
	chargingModes: ["ac", "dc"]
  });

console.log("Request Body for api:", requestBody);
