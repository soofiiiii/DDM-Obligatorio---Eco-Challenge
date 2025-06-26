export const geocodeAddress = async (address) => {
    // URL base de Nominatim
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url, {
            headers: {
                // Agregar una cabecera User-Agent única para la app 
                // Esto es requerido por la política de uso de Nominatim
                'User-Agent': 'EcoChallengeApp/1.0 (sopperochena@gmail.com)' 
            }
        });

        // Verifica si la respuesta HTTP fue exitosa (código 2xx)
        if (!response.ok) {
            const errorText = await response.text(); // Lee el contenido no-JSON para depuración
            console.error(`Error HTTP ${response.status}: ${errorText}`);
            // ver si lanzar un error o devolver null aquí
            return null; 
        }

        const data = await response.json(); // Intenta parsear el JSON

        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
            };
        }
        
        // Si no hay datos o la longitud es 0, no se encontraron resultados
        console.warn('No se encontraron resultados para la dirección:', address);
        return null;
    } catch (error) {
        console.error('Error en geocodificación (Nominatim):', error);
        // Si el error es un SyntaxError, probablemente la respuesta no era JSON.
        // Si es un error de red, también se capturará aquí.
        return null;
    }
};