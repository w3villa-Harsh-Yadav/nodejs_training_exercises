const checkInCache = async(cache,key) => {
    const cachedResponse = await cache.get(key);

    console.log(cachedResponse);

    if (cachedResponse) {
        // If the response is cached, return it
        console.log(`Serving from cache: ${key}`);
        return cachedResponse;
    }

    return null;

}

module.exports = {
    checkInCache
};
