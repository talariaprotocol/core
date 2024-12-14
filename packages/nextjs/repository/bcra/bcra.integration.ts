import fetch from 'node-fetch';

const BASE_URL = 'https://api.bcra.gob.ar/centraldedeudores/v1.0';

/**
 * Helper function to call BCRA API
 * @param endpoint The API endpoint to call
 * @returns The data from the API response
 */
async function getFromBcra(endpoint: string): Promise<any> {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (response.status === 404) {
        // Handle the case when no data is found for the user
        const errorData = await response.json();
        // @ts-ignore
        if (errorData.errorMessages && errorData.errorMessages.includes("No se encontró datos para la identificación ingresada")) {
            return { status: 404, message: "No data found" }; // Indicate that no data was found for the user
        }
    }

    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Method to get credit status, debt amount, overdue days, and observations
 * for the last reported period by entities to the BCRA.
 * @param identificacion - CUIT/CUIL/CDI, should have a length of 11 characters.
 * @returns The data from the BCRA API
 */
export async function deudas(identificacion: number): Promise<any> {
    const endpoint = `/Deudas/${identificacion}`;
    return getFromBcra(endpoint);
}

/**
 * Method to get rejected checks and their corresponding causes.
 * @param identificacion - CUIT/CUIL/CDI, should have a length of 11 characters.
 * @returns The data from the BCRA API
 */
export async function chequesRechazados(identificacion: number): Promise<any> {
    const endpoint = `/Deudas/ChequesRechazados/${identificacion}`;
    return getFromBcra(endpoint);
}
