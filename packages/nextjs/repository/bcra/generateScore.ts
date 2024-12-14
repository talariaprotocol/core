import {chequesRechazados} from "~~/repository/bcra/bcra.integration";
import {deudas} from "~~/repository/bcra/bcra.integration";
/**
 * Method to calculate a score based on the user's debts and financial situation,
 * and return the maximum loan amount the user can request.
 * @param identificacion - CUIT/CUIL/CDI, should have a length of 11 characters.
 * @returns An object containing the score and the max loan amount the user can request.
 */
export async function calculateScoreAndMaxAmount(
    identificacion: number
): Promise<{ score: number; maxLoanAmount: number }> {
    // Hardcoded loan amount limits
    const minAmount = 1000;
    const maxAmount = 100000;

    try {
        const deudasData = await deudas(identificacion);
        const chequesData = await chequesRechazados(identificacion);

        // If no data is found for the user, they are in good financial standing
        let score = 100; // Start with the highest score
        if (deudasData.status === 404 || chequesData.status === 404) {
            return { score, maxLoanAmount: maxAmount };
        }

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

        // Calculate the max loan amount based on the score
        // Use a linear interpolation between minAmount and maxAmount based on the score
        const maxLoanAmount =
            ((score / 100) * (maxAmount - minAmount)) + minAmount;

        return { score, maxLoanAmount: Math.round(maxLoanAmount) };
    } catch (error) {
        console.error('Error calculating score:', error);
        return { score: 0, maxLoanAmount: minAmount }; // Return the minimum amount if there's an error
    }
}