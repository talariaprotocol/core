export function getDni(dni: string): string {
    dni = dni.replace('.', '');
    if (dni.length === 7) {
        dni = '0' + dni;
    } else if (dni.length !== 8) {
        throw new Error("Invalid DNI length");
    }
    return dni;
}

export function getSexo(sexo: string): string {
    if (sexo.toLowerCase().startsWith('f')) {
        return 'f';
    } else if (sexo.toLowerCase().startsWith('m')) {
        return 'm';
    } else {
        throw new Error("Invalid sexo value");
    }
}

export function getCuil(dni: string, sexo: string): string {
    let cuil = '';
    if (sexo === 'f') {
        cuil += '27';
    } else {
        cuil += '20';
    }

    cuil += '-';
    cuil += dni;

    // Calculate the checksum digit
    const sumDigits = String(
        11 - (
            parseInt(cuil[0]) * 5 +
            parseInt(cuil[1]) * 4 +
            parseInt(cuil[3]) * 3 +
            parseInt(cuil[4]) * 2 +
            parseInt(cuil[5]) * 7 +
            parseInt(cuil[6]) * 6 +
            parseInt(cuil[7]) * 5 +
            parseInt(cuil[8]) * 4 +
            parseInt(cuil[9]) * 3 +
            parseInt(cuil[10]) * 2
        ) % 11
    );

    let checksum = sumDigits;

    if (checksum === '11') {
        checksum = '0';
    } else if (checksum === '10') {
        if (sexo === 'f') {
            cuil = '23' + cuil.slice(2);
            checksum = '4';
        } else {
            cuil = '23' + cuil.slice(2);
            checksum = '9';
        }
    }

    cuil += '-';
    cuil += checksum;

    return cuil;
}

export function getFirstTwoNumbers(cuil: string): string {
    return cuil.slice(0, 2);
}

export function getDniNumber(cuil: string): string {
    return cuil.slice(3, -2);
}

export function getLastDigit(cuil: string): string {
    return cuil.slice(-1);
}

export function getCuilFromDni(dni: string, sexo: string): [string, string, string, string] {
    const dniProcessed = getDni(dni);
    const sexoProcessed = getSexo(sexo);
    const cuilGenerated = getCuil(dniProcessed, sexoProcessed);

    return [
        cuilGenerated,
        getFirstTwoNumbers(cuilGenerated),
        getDniNumber(cuilGenerated),
        getLastDigit(cuilGenerated)
    ];
}
