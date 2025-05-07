export type UserGroupConfig = Record<string, Record<string, number>>[];
/**
 *  Given the Cognito user groups associated to current user session
 *  and all the user group configurations defined by backend.
 *  This function returns the user group with the highest precedence.
 *  Reference: https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html#assigning-precedence-values-to-groups
 *
 * @param {UserGroupConfig} userGroupsFromConfig - User groups with their precedence values based on Amplify outputs.
 * @param {string[]} currentUserGroups - The list of current user's groups.
 * @returns {string | undefined} - The user group with the highest precedence (0), or undefined if no matching group is found.
 */
export declare const getHighestPrecedenceUserGroup: (userGroupsFromConfig?: UserGroupConfig, currentUserGroups?: string[]) => string | undefined;
