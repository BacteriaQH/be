export const getAgent = (req) => {
    //get user agent
    const agent = req.headers['user-agent'].toString();
    //console.log('agent', agent);
    let arr = agent.split(' (');
    arr = arr.map((i) => {
        return i.split(') ');
    });
    let agentObject = {};
    agentObject = {
        browser: {
            name: arr[2][1].split(' ')[0].toString().split('/')[0],
            version: arr[2][1].split(' ')[0].toString().split('/')[1],
        },
        os: {
            name: arr[1][0].split(' ')[0],
            version: arr[1][0].split(' ')[2],
        },
    };
    return agentObject;
};
