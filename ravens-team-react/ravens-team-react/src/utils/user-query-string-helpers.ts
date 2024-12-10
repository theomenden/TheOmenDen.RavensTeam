export const createUsernameQueryString = (usernames: string[]): string => {
    return usernames.map(username => `login=${username}`).join('&');
};

export const createUserLoginQueryString = (userLogins: string[]): string => {
    return userLogins.map(userLogin => `user_login=${userLogin}`).join('&');
};

export const createUserIdQueryString = (userIds: string[]): string => {
    return userIds.map(userId => `user_id=${userId}`).join('&');
};

export const chunkUsernamesIntoBatchesOf = (usernames: string[], batchSize: number = 100): string[][] => {
    const batches: Array<Array<string>> = [];
    for (let i = 0; i < usernames.length; i += batchSize) {
        batches.push(usernames.slice(i, i + batchSize));
    }
    return batches;
}

export const chunkUserIdsIntoBatchesOf = (userIds: string[], batchSize: number = 100): string[][] => {
    const batches: Array<Array<string>> = [];
    for (let i = 0; i < userIds.length; i += batchSize) {
        batches.push(userIds.slice(i, i + batchSize));
    }
    return batches;
}