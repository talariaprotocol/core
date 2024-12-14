import {chequesRechazados} from "~~/repository/bcra/bcra.integration";
import {deudas} from "~~/repository/bcra/bcra.integration";

/**
 * Method to calculate a score based on the user's debts and financial situation
 * @param identificacion - CUIT/CUIL/CDI, should have a length of 11 characters.
 * @returns A score between 0 and 100
 */
export async function calculateScore(identificacion: number): Promise<number> {
    try {
        const deudasData = await deudas(identificacion);
        const chequesData = await chequesRechazados(identificacion);

        // If no data is found for the user, they are in good financial standing
        if (deudasData.status === 404 || chequesData.status === 404) {
            return 100; // User has no financial problems
        }

        let score = 100; // Start with the highest score

        // Check if the user has active debts or overdue debts
        if (deudasData && deudasData.results && deudasData.results.periodos) {
            // Iterate over each period
            deudasData.results.periodos.forEach((period: any) => {
                // Iterate over each entity in the period
                period.entidades.forEach((entidad: any) => {
                    // If the debt is active (situacion = 1), deduct points
                    if (entidad.situacion === 1) {
                        score -= 50; // Deduct points for active debts
                    }

                    // If the debt has overdue days (diasAtrasoPago > 0), deduct points
                    if (entidad.diasAtrasoPago > 0) {
                        score -= 30; // Deduct points for overdue debts
                    }
                });
            });
        }

        // Check if there are rejected cheques
        if (chequesData && chequesData.length > 0) {
            score -= 20; // Deduct points for rejected cheques
        }
        // Ensure the score doesn't go below 0
        score = Math.max(score, 0);
        return score;
    } catch (error) {
        console.error('Error calculating score:', error);
        return 0; // If there is an error, return 0 as a fallback score
    }
}