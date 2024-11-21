export const formatDate = (date: Date): string => {
    // Obtendo o dia, mês, ano, horas, minutos e segundos
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Retornando a data formatada no formato 'DD/MM/YYYY HH:MM:SS'
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};


// Função para remover tags HTML da descrição
export const removeHtmlTags = (description: string) => {
    return description.replace(/<\/?[^>]+(>|$)/g, '');
};