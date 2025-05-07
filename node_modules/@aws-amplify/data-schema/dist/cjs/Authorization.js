'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.accessSchemaData = exports.accessData = exports.allowForConversations = exports.allowForCustomOperations = exports.allow = exports.ResourceOperations = exports.Operations = exports.Strategies = exports.CustomProviders = exports.GroupProviders = exports.OwnerProviders = exports.PrivateProviders = exports.PublicProviders = exports.Providers = void 0;
const __data = Symbol('data');
/**
 * All possible providers.
 *
 * This list should not be used if you need to restrict available providers
 * according to an auth strategcy. E.g., `public` auth can only be facilitated
 * by `apiKey` and `identityPool` providers.
 */
exports.Providers = [
    'apiKey',
    'identityPool',
    'userPools',
    'oidc',
    'function',
];
/**
 * The subset of auth providers that can facilitate `public` auth.
 */
exports.PublicProviders = ['apiKey', 'identityPool'];
/**
 * The subset of auth providers that can facilitate `private` auth.
 */
exports.PrivateProviders = ['userPools', 'oidc', 'identityPool'];
/**
 * The subset of auth providers that can facilitate `owner` auth.
 */
exports.OwnerProviders = ['userPools', 'oidc'];
/**
 * The subset of auth providers that can facilitate `group` auth.
 */
exports.GroupProviders = ['userPools', 'oidc'];
/**
 * The subset of auth providers that can facilitate `custom` auth.
 */
exports.CustomProviders = ['function'];
exports.Strategies = [
    'public',
    'private',
    'owner',
    'groups',
    'custom',
];
/**
 * The operations that can be performed against an API.
 */
exports.Operations = [
    'create',
    'update',
    'delete',
    'read',
    'get',
    'list',
    'sync',
    'listen',
    'search',
];
/**
 * The operations that can be performed against an API by a Lambda function.
 */
exports.ResourceOperations = ['query', 'mutate', 'listen'];
/**
 * Creates a shallow copy of an object with an individual field pruned away.
 *
 * @param original The original object to prune.
 * @param without The field to prune.
 * @returns The pruned object.
 */
function omit(original, without) {
    const pruned = { ...original };
    delete pruned[without];
    return pruned;
}
function to(operations) {
    this[__data].operations = operations;
    return omit(this, 'to');
}
/**
 * Specifies a property of the identity JWT to use in place of `sub::username`
 * as the value to match against the owner field for authorization.
 *
 * @param this Authorization object to operate against.
 * @param property A property of identity JWT.
 * @returns A copy of the Authorization object with the claim attached.
 */
function identityClaim(property) {
    this[__data].identityClaim = property;
    return omit(this, 'identityClaim');
}
function withClaimIn(property) {
    this[__data].groupClaim = property;
    return omit(this, 'withClaimIn');
}
function validateProvider(needle, haystack) {
    if (needle && !haystack.includes(needle)) {
        throw new Error(`Invalid provider (${needle}) given!`);
    }
}
function authData(defaults, builderMethods) {
    return {
        [__data]: {
            strategy: 'public',
            provider: undefined,
            operations: undefined,
            groupOrOwnerField: undefined,
            multiOwner: false,
            identityClaim: undefined,
            groups: undefined,
            ...defaults,
        },
        ...builderMethods,
    };
}
/**
 * Defines an authorization rule for your data models and fields. First choose an authorization strategy (`public`,
 * `private`, `owner`, `group`, or `custom`), then choose an auth provider (`apiKey`, `identitypool`, `userPools`, `oidc`, or `function`)
 * and optionally use `.to(...)` to specify the operations that can be performed against your data models and fields.
 */
exports.allow = {
    /**
     * Authorize unauthenticated users by using API key based authorization.
     * @returns an authorization rule for unauthenticated users
     */
    publicApiKey() {
        return authData({
            strategy: 'public',
            provider: 'apiKey',
        }, {
            to,
        });
    },
    /**
     * Authorize unauthenticated users by using IDENTITYPOOL based authorization.
     * @returns an authorization rule for unauthenticated users
     */
    guest() {
        return authData({
            strategy: 'public',
            provider: 'identityPool',
        }, {
            to,
        });
    },
    /**
     * Authorize authenticated users. By default, `.authenticated()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.authenticated("identityPool")` or `.authenticated("oidc")` to use identityPool or OIDC based authorization for authenticated users.
     * @param provider the authentication provider - supports "userPools", "identityPool", or "oidc"
     * @returns an authorization rule for authenticated users
     */
    authenticated(provider) {
        validateProvider(provider, exports.PrivateProviders);
        return authData({
            strategy: 'private',
            provider,
        }, {
            to,
        });
    },
    /**
     * Authorize access on a per-user (owner) basis. By setting owner-based authorization, a new `owner: a.string()`
     * field will be added to the model to store which user "owns" the item. Upon item creation, the "owner field" is
     * auto-populated with the authenticated user's information. If you want to specify which field should be used as
     * the owner field, you can use the `ownerDefinedIn` builder function instead.
     *
     * By default, `.owner()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.owner("oidc")` to use OIDC based authentication to designate the owner.
     *
     * To change the specific claim that should be used as the user identifier within the owner field, chain the
     * `.identityClaim(...)` method.
     *
     * @param provider the authentication provider - supports "userPools", "identityPool", or "oidc"
     * @returns an authorization rule for authenticated users
     */
    owner(provider) {
        validateProvider(provider, exports.OwnerProviders);
        return authData({
            strategy: 'owner',
            provider,
            groupOrOwnerField: 'owner',
        }, {
            to,
            identityClaim,
        });
    },
    /**
     * Authorize access on a per-user (owner) basis with specifying which field should be used as the owner field.
     *
     * By default, `.owner()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.ownerDefinedIn("owner", "oidc")` to use OIDC based authentication to designate the owner.
     *
     * To change the specific claim that should be used as the user identifier within the owner field, chain the
     * `.identityClaim(...)` method.
     *
     * @param ownerField the field that contains the owner information
     * @param provider the authentication provider - supports "userPools", "identityPool", or "oidc"
     * @returns an authorization rule for authenticated users
     */
    ownerDefinedIn(ownerField, provider) {
        validateProvider(provider, exports.OwnerProviders);
        return authData({
            strategy: 'owner',
            provider,
            groupOrOwnerField: ownerField,
        }, {
            to,
            identityClaim,
        });
    },
    /**
     * Authorize access for multi-user / multi-owner access. By setting multi-owner-based authorization, a new `owners: a.string().array()`
     * field will be added to the model to store which users "own" the item. Upon item creation, the "owners field" is
     * auto-populated with the authenticated user's information. To grant other users access to the item, append their user identifier into the `owners` array.
     *
     * You can specify which field should be used as the owners field by passing the `ownersField` parameter.
     *
     * By default, `.ownersDefinedIn()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.ownersDefinedIn("owners", "oidc")` to use OIDC based authentication to designate the owner.
     *
     * To change the specific claim that should be used as the user identifier within the owners field, chain the
     * `.identityClaim(...)` method.
     *
     * @param ownersField the field that contains the owners information
     * @param provider the authentication provider - supports "userPools", "identityPool", or "oidc"
     * @returns an authorization rule for authenticated users
     */
    ownersDefinedIn(ownersField, provider) {
        validateProvider(provider, exports.OwnerProviders);
        return authData({
            strategy: 'owner',
            provider,
            groupOrOwnerField: ownersField,
            multiOwner: true,
        }, {
            to,
            identityClaim,
        });
    },
    /**
     * Authorize a specific user group. Provide the name of the specific user group to have access.
     *
     * By default, `.group()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.group("group-name", "oidc")` to use OIDC based authentication to designate the user group.
     *
     * To change the specific claim that should be used as the user group identifier, chain the
     * `.withClaimIn(...)` method.
     * @param group the name of the group to authorize
     * @param provider the authentication provider - supports "userPools" or "oidc"
     * @returns an authorization rule to grant access by a specific group
     */
    group(group, provider) {
        return authData({
            strategy: 'groups',
            provider,
            groups: [group],
        }, {
            to,
            withClaimIn,
        });
    },
    /**
     * Authorize multiple specific user groups. Provide the names of the specific user groups to have access.
     *
     * By default, `.groups()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.groups(["group-a", "group-b"], "oidc")` to use OIDC based authentication to designate the user group.
     *
     * To change the specific claim that should be used as the user group identifier, chain the
     * `.withClaimIn(...)` method.
     * @param groups the names of the group to authorize defined as an array
     * @param provider the authentication provider - supports "userPools" or "oidc"
     * @returns an authorization rule to grant access by a specific group
     */
    groups(groups, provider) {
        return authData({
            strategy: 'groups',
            provider,
            groups,
        }, {
            to,
            withClaimIn,
        });
    },
    /**
     * Authorize if a user is part of a group defined in a data model field.
     *
     * By default, `.groupDefinedIn()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.groupDefinedIn("field-name", "oidc")` to use OIDC based authentication to designate the user group.
     *
     * To change the specific claim that should be used as the user group identifier within the groups field, chain the
     * `.withClaimIn(...)` method.
     * @param groupsField the field that should store the authorized user group information
     * @param provider the authentication provider - supports "userPools" or "oidc"
     * @returns an authorization rule to grant access by a specific group
     */
    groupDefinedIn(groupsField, provider) {
        return authData({
            strategy: 'groups',
            provider,
            groupOrOwnerField: groupsField,
        }, {
            to,
            withClaimIn,
        });
    },
    /**
     * Authorize if a user is part of a one of the groups defined in a data model field.
     *
     * By default, `.groupsDefinedIn()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.groupsDefinedIn("field-name", "oidc")` to use OIDC based authentication to designate the user group.
     *
     * To change the specific claim that should be used as the user group identifier within the groups field, chain the
     * `.withClaimIn(...)` method.
     * @param groupsField the field that should store the list of authorized user groups
     * @param provider the authentication provider - supports "userPools" or "oidc"
     * @returns an authorization rule to grant access by a specific group
     */
    groupsDefinedIn(groupsField, provider) {
        return authData({
            strategy: 'groups',
            provider,
            groupOrOwnerField: groupsField,
            multiOwner: true,
        }, {
            to,
            withClaimIn,
        });
    },
    custom(provider) {
        return authData({
            strategy: 'custom',
            provider,
        }, {
            to,
        });
    },
    resource(fn) {
        return resourceAuthData(fn, {
            to: resourceTo,
        });
    },
};
/**
 * This is a copy of the {@link allow} defined above, with modifications for custom operations.
 *
 * Removed builder methods:
 *
 * * `owner`
 * * `ownerDefinedIn`
 * * `ownersDefinedIn`
 * * `groupDefinedIn`
 * * `groupsDefinedIn`
 * * `resource`
 * * `.to()` builder method from each available rule builder
 */
exports.allowForCustomOperations = {
    /**
     * Authorize unauthenticated users by using API key based authorization.
     * @returns an authorization rule for unauthenticated users
     */
    publicApiKey() {
        return authData({
            strategy: 'public',
            provider: 'apiKey',
        }, {});
    },
    /**
     * Authorize unauthenticated users by using identityPool based authorization.
     * @returns an authorization rule for unauthenticated users
     */
    guest() {
        return authData({
            strategy: 'public',
            provider: 'identityPool',
        }, {});
    },
    /**
     * Authorize authenticated users. By default, `.private()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.authenticated("identityPool")` or `.authenticated("oidc")` to use Identity Pool or OIDC based authorization for authenticated users.
     * @param provider the authentication provider - supports "userPools", "identityPool", or "oidc"
     * @returns an authorization rule for authenticated users
     */
    authenticated(provider) {
        validateProvider(provider, exports.PrivateProviders);
        return authData({
            strategy: 'private',
            provider,
        }, {});
    },
    /**
     * Authorize a specific user group. Provide the name of the specific user group to have access.
     *
     * By default, `.group()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.group("group-name", "oidc")` to use OIDC based authentication to designate the user group.
     *
     * @param group the name of the group to authorize
     * @param provider the authentication provider - supports "userPools" or "oidc"
     * @returns an authorization rule to grant access by a specific group
     */
    group(group, provider) {
        return authData({
            strategy: 'groups',
            provider,
            groups: [group],
        }, {});
    },
    /**
     * Authorize multiple specific user groups. Provide the names of the specific user groups to have access.
     *
     * By default, `.groups()` uses an Amazon Cognito user pool based authorization. You can additionally
     * use `.groups(["group-a", "group-b"], "oidc")` to use OIDC based authentication to designate the user group.
     *
     * @param groups the names of the group to authorize defined as an array
     * @param provider the authentication provider - supports "userPools" or "oidc"
     * @returns an authorization rule to grant access by a specific group
     */
    groups(groups, provider) {
        return authData({
            strategy: 'groups',
            provider,
            groups,
        }, {});
    },
    custom(provider) {
        return authData({
            strategy: 'custom',
            provider,
        }, {});
    },
};
exports.allowForConversations = {
    owner() {
        return authData({
            strategy: 'owner',
            provider: 'userPools',
        }, {
            to,
            identityClaim,
        });
    },
};
function resourceTo(operations) {
    this[__data].operations = operations;
    return omit(this, 'to');
}
function resourceAuthData(resource, builderMethods) {
    return {
        [__data]: {
            strategy: 'resource',
            resource,
        },
        ...builderMethods,
    };
}
const accessData = (authorization) => authorization[__data];
exports.accessData = accessData;
// TODO: delete when we make resource auth available at each level in the schema (model, field)
const accessSchemaData = (authorization) => authorization[__data];
exports.accessSchemaData = accessSchemaData;
//# sourceMappingURL=Authorization.js.map
