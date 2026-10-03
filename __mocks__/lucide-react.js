const LucideReact = new Proxy(
    {},
    {
        get: (target, prop) => () => 'LucideIcon',
    }
);

module.exports = LucideReact;
