const requestOptions = {
    method: 'GET'
}

export const classifyServiceByItemName = (itemName) => {
    console.info("Classify the service by its name")
    return fetch(`${process.env.REACT_APP_SERVICE_CLASSIFICATION_ENDPOINT}/api/service/classify?itemName=${itemName}`, requestOptions)
        .then(response => response.json())
        .then(data=>data.service)
}