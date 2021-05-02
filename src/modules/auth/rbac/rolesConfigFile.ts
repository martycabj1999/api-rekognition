const rolesConfigFile = [{
        name: 'admin',
        permissions: ['write', 'read']
    },
    {
        name: 'user',
        permissions: ['read']
    }
]


const roleConfigPromise = new Promise((resolve: any) => {
    resolve(rolesConfigFile)
});

export default roleConfigPromise;
