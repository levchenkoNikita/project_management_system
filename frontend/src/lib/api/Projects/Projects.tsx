import config from '@/lib/utils/config'

export async function getProjects() {
    const response = await fetch(`${config.api}/projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fff'
        }
    });

    if(!response.ok) throw new Error('Ошибка запроса. Неверный запрос!')
    if(response.status >= 300 && response.status <= 400) throw new Error('Ошибка запроса -> 3xx')
    if(response.status >= 400 && response.status <= 500) throw new Error('Ошибка запроса -> 4xx')
    if(response.status >= 500 && response.status <= 600) throw new Error('Ошибка запроса -> 5xx')

    const data = await response.json();
    return data;
}

export async function postProjects(request_body) {
    const json = JSON.stringify(request_body);
    const response = await fetch(`${config.api}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fff'
        },
        body: json
    });

    if(!response.ok) throw new Error('Ошибка запроса. Неверный запрос!')
    if(response.status >= 300 && response.status <= 400) throw new Error('Ошибка запроса -> 3xx')
    if(response.status >= 400 && response.status <= 500) throw new Error('Ошибка запроса -> 4xx')
    if(response.status >= 500 && response.status <= 600) throw new Error('Ошибка запроса -> 5xx')
        
    const data = await response.json();
    return data;
}