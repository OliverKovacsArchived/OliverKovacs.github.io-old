
export default (async () => {
    let response = await fetch(`https://api.github.com/users/OliverKovacs/orgs`);
    let json = await response.json();
    return json.map(({ login, avatar_url }) => {
        return {
            title: login,
            image: avatar_url,
            url: `https://github.com/${login}`,
        };
    });
})();
