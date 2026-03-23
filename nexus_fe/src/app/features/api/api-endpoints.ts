import { ApiEndpointGroupDefinition, EndpointFieldDefinition } from '../../core/models/api.models';

const roleFieldOptions: EndpointFieldDefinition['options'] = [
  { label: 'Owner', value: 1 },
  { label: 'Manager', value: 2 },
  { label: 'Worker', value: 3 }
];

export const endpointGroups: readonly ApiEndpointGroupDefinition[] = [
  {
    id: 'auth',
    title: 'Auth',
    icon: 'login',
    description: 'Login, token refresh, logout and current user session methods.',
    endpoints: [
      {
        id: 'auth-login',
        title: 'Login',
        group: 'auth',
        method: 'POST',
        path: '/api/auth/login',
        description: 'Create access and refresh tokens by email and password.',
        authRequired: false,
        accessLevel: 'Public',
        bodyFields: [
          { key: 'email', label: 'Email', kind: 'email', required: true, placeholder: 'owner@nexus.dev' },
          { key: 'password', label: 'Password', kind: 'password', required: true, placeholder: '••••••••' }
        ]
      },
      {
        id: 'auth-refresh',
        title: 'Refresh Token',
        group: 'auth',
        method: 'POST',
        path: '/api/auth/refresh',
        description: 'Exchange the refresh token for a fresh access token pair.',
        authRequired: false,
        accessLevel: 'Public',
        bodyFields: [
          {
            key: 'refreshToken',
            label: 'Refresh Token',
            kind: 'text',
            required: true,
            defaultFrom: 'refreshToken',
            placeholder: 'Paste refresh token'
          }
        ]
      },
      {
        id: 'auth-logout',
        title: 'Logout',
        group: 'auth',
        method: 'POST',
        path: '/api/auth/logout',
        description: 'Invalidate the current refresh token on the server.',
        authRequired: true,
        accessLevel: 'Any authenticated user',
        bodyFields: [
          {
            key: 'refreshToken',
            label: 'Refresh Token',
            kind: 'text',
            required: true,
            defaultFrom: 'refreshToken',
            placeholder: 'Current refresh token'
          }
        ]
      },
      {
        id: 'auth-me',
        title: 'Current User',
        group: 'auth',
        method: 'GET',
        path: '/api/auth/me',
        description: 'Return the authenticated user profile from the token context.',
        authRequired: true,
        accessLevel: 'Any authenticated user'
      }
    ]
  },
  {
    id: 'users',
    title: 'Users',
    icon: 'users',
    description: 'Role lookup, profile updates, user administration and password operations.',
    endpoints: [
      {
        id: 'users-roles',
        title: 'List Roles',
        group: 'users',
        method: 'GET',
        path: '/api/users/roles',
        description: 'Get the enum values available for user roles.',
        authRequired: true,
        accessLevel: 'Manager or owner'
      },
      {
        id: 'users-list',
        title: 'List Accessible Users',
        group: 'users',
        method: 'GET',
        path: '/api/users',
        description: 'Get all users visible to the signed-in manager or owner.',
        authRequired: true,
        accessLevel: 'Manager or owner'
      },
      {
        id: 'users-managers',
        title: 'List Managers',
        group: 'users',
        method: 'GET',
        path: '/api/users/managers',
        description: 'Get manager users only.',
        authRequired: true,
        accessLevel: 'Manager or owner'
      },
      {
        id: 'users-workers',
        title: 'List Workers',
        group: 'users',
        method: 'GET',
        path: '/api/users/workers',
        description: 'Get worker users only.',
        authRequired: true,
        accessLevel: 'Manager or owner'
      },
      {
        id: 'users-get-by-id',
        title: 'Get User By Id',
        group: 'users',
        method: 'GET',
        path: '/api/users/{userId}',
        description: 'Load one accessible user by guid.',
        authRequired: true,
        accessLevel: 'Any authenticated user with access',
        pathFields: [{ key: 'userId', label: 'User Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }]
      },
      {
        id: 'users-update-me',
        title: 'Update My Profile',
        group: 'users',
        method: 'PUT',
        path: '/api/users/me',
        description: 'Update the current user profile fields.',
        authRequired: true,
        accessLevel: 'Any authenticated user',
        bodyFields: [
          { key: 'email', label: 'Email', kind: 'email', required: true, placeholder: 'owner@nexus.dev' },
          { key: 'firstName', label: 'First Name', kind: 'text', required: true, placeholder: 'Olena' },
          { key: 'lastName', label: 'Last Name', kind: 'text', required: true, placeholder: 'Koval' }
        ]
      },
      {
        id: 'users-create',
        title: 'Create User',
        group: 'users',
        method: 'POST',
        path: '/api/users',
        description: 'Create a new user account with a role and optional manager.',
        authRequired: true,
        accessLevel: 'Owner only',
        bodyFields: [
          { key: 'email', label: 'Email', kind: 'email', required: true, placeholder: 'manager@nexus.dev' },
          { key: 'firstName', label: 'First Name', kind: 'text', required: true, placeholder: 'Iryna' },
          { key: 'lastName', label: 'Last Name', kind: 'text', required: true, placeholder: 'Karpova' },
          { key: 'password', label: 'Password', kind: 'password', required: true, placeholder: 'Min 8 chars' },
          { key: 'role', label: 'Role', kind: 'select', required: true, options: roleFieldOptions, defaultValue: 2 },
          { key: 'managerId', label: 'Manager Id', kind: 'uuid', placeholder: 'Leave empty for no manager', emptyBehavior: 'null' }
        ]
      },
      {
        id: 'users-update',
        title: 'Update User',
        group: 'users',
        method: 'PUT',
        path: '/api/users/{userId}',
        description: 'Update basic profile fields for a user.',
        authRequired: true,
        accessLevel: 'Owner only',
        pathFields: [{ key: 'userId', label: 'User Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }],
        bodyFields: [
          { key: 'email', label: 'Email', kind: 'email', required: true, placeholder: 'user@nexus.dev' },
          { key: 'firstName', label: 'First Name', kind: 'text', required: true, placeholder: 'Andrii' },
          { key: 'lastName', label: 'Last Name', kind: 'text', required: true, placeholder: 'Sydorenko' }
        ]
      },
      {
        id: 'users-update-role',
        title: 'Update User Role',
        group: 'users',
        method: 'PATCH',
        path: '/api/users/{userId}/role',
        description: 'Change the user role and optionally set the manager.',
        authRequired: true,
        accessLevel: 'Owner only',
        pathFields: [{ key: 'userId', label: 'User Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }],
        bodyFields: [
          { key: 'role', label: 'Role', kind: 'select', required: true, options: roleFieldOptions, defaultValue: 3 },
          { key: 'managerId', label: 'Manager Id', kind: 'uuid', placeholder: 'Leave empty to clear manager', emptyBehavior: 'null' }
        ]
      },
      {
        id: 'users-update-manager',
        title: 'Update User Manager',
        group: 'users',
        method: 'PATCH',
        path: '/api/users/{userId}/manager',
        description: 'Assign or clear the manager for a user.',
        authRequired: true,
        accessLevel: 'Owner only',
        pathFields: [{ key: 'userId', label: 'User Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }],
        bodyFields: [
          { key: 'managerId', label: 'Manager Id', kind: 'uuid', placeholder: 'Leave empty to remove manager', emptyBehavior: 'null' }
        ]
      },
      {
        id: 'users-update-status',
        title: 'Update User Status',
        group: 'users',
        method: 'PATCH',
        path: '/api/users/{userId}/status',
        description: 'Enable or disable a user account.',
        authRequired: true,
        accessLevel: 'Owner only',
        pathFields: [{ key: 'userId', label: 'User Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }],
        bodyFields: [{ key: 'isActive', label: 'Active User', kind: 'boolean', defaultValue: true }]
      },
      {
        id: 'users-change-password',
        title: 'Change My Password',
        group: 'users',
        method: 'POST',
        path: '/api/users/me/change-password',
        description: 'Change the current user password.',
        authRequired: true,
        accessLevel: 'Any authenticated user',
        bodyFields: [
          { key: 'currentPassword', label: 'Current Password', kind: 'password', required: true, placeholder: 'Current password' },
          { key: 'newPassword', label: 'New Password', kind: 'password', required: true, placeholder: 'New password' }
        ]
      },
      {
        id: 'users-reset-password',
        title: 'Reset User Password',
        group: 'users',
        method: 'POST',
        path: '/api/users/{userId}/reset-password',
        description: 'Force set a new password for the selected user.',
        authRequired: true,
        accessLevel: 'Owner only',
        pathFields: [{ key: 'userId', label: 'User Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }],
        bodyFields: [{ key: 'newPassword', label: 'New Password', kind: 'password', required: true, placeholder: 'Min 8 chars' }]
      }
    ]
  },
  {
    id: 'stores',
    title: 'Stores',
    icon: 'store',
    description: 'Store lookup, creation, manager assignment and worker mapping endpoints.',
    endpoints: [
      {
        id: 'stores-list',
        title: 'List Accessible Stores',
        group: 'stores',
        method: 'GET',
        path: '/api/stores',
        description: 'Return all stores visible to the signed-in user.',
        authRequired: true,
        accessLevel: 'Any authenticated user'
      },
      {
        id: 'stores-get-by-id',
        title: 'Get Store By Id',
        group: 'stores',
        method: 'GET',
        path: '/api/stores/{storeId}',
        description: 'Load a single accessible store.',
        authRequired: true,
        accessLevel: 'Any authenticated user',
        pathFields: [{ key: 'storeId', label: 'Store Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }]
      },
      {
        id: 'stores-create',
        title: 'Create Store',
        group: 'stores',
        method: 'POST',
        path: '/api/stores',
        description: 'Create a store and optionally assign a manager.',
        authRequired: true,
        accessLevel: 'Owner only',
        bodyFields: [
          { key: 'name', label: 'Store Name', kind: 'text', required: true, placeholder: 'Nexus Baltic Shop' },
          { key: 'marketplace', label: 'Marketplace', kind: 'text', required: true, placeholder: 'Amazon' },
          { key: 'sellerAccountId', label: 'Seller Account Id', kind: 'text', required: true, placeholder: 'A1BC23XYZ' },
          { key: 'managerId', label: 'Manager Id', kind: 'uuid', placeholder: 'Leave empty to skip', emptyBehavior: 'null' }
        ]
      },
      {
        id: 'stores-update',
        title: 'Update Store',
        group: 'stores',
        method: 'PUT',
        path: '/api/stores/{storeId}',
        description: 'Update store profile fields.',
        authRequired: true,
        accessLevel: 'Owner only',
        pathFields: [{ key: 'storeId', label: 'Store Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }],
        bodyFields: [
          { key: 'name', label: 'Store Name', kind: 'text', required: true, placeholder: 'Nexus Baltic Shop' },
          { key: 'marketplace', label: 'Marketplace', kind: 'text', required: true, placeholder: 'Amazon' },
          { key: 'sellerAccountId', label: 'Seller Account Id', kind: 'text', required: true, placeholder: 'A1BC23XYZ' }
        ]
      },
      {
        id: 'stores-update-manager',
        title: 'Update Store Manager',
        group: 'stores',
        method: 'PATCH',
        path: '/api/stores/{storeId}/manager',
        description: 'Assign or clear the store manager.',
        authRequired: true,
        accessLevel: 'Owner only',
        pathFields: [{ key: 'storeId', label: 'Store Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }],
        bodyFields: [{ key: 'managerId', label: 'Manager Id', kind: 'uuid', placeholder: 'Leave empty to clear', emptyBehavior: 'null' }]
      },
      {
        id: 'stores-update-status',
        title: 'Update Store Status',
        group: 'stores',
        method: 'PATCH',
        path: '/api/stores/{storeId}/status',
        description: 'Enable or disable a store.',
        authRequired: true,
        accessLevel: 'Owner only',
        pathFields: [{ key: 'storeId', label: 'Store Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }],
        bodyFields: [{ key: 'isActive', label: 'Store Active', kind: 'boolean', defaultValue: true }]
      },
      {
        id: 'stores-assign-worker',
        title: 'Assign Worker To Store',
        group: 'stores',
        method: 'POST',
        path: '/api/stores/{storeId}/workers',
        description: 'Attach a worker account to a store.',
        authRequired: true,
        accessLevel: 'Owner only',
        pathFields: [{ key: 'storeId', label: 'Store Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }],
        bodyFields: [{ key: 'workerId', label: 'Worker Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }]
      },
      {
        id: 'stores-remove-worker',
        title: 'Remove Worker From Store',
        group: 'stores',
        method: 'DELETE',
        path: '/api/stores/{storeId}/workers/{workerId}',
        description: 'Detach a worker from a store.',
        authRequired: true,
        accessLevel: 'Owner only',
        pathFields: [
          { key: 'storeId', label: 'Store Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' },
          { key: 'workerId', label: 'Worker Id', kind: 'uuid', required: true, placeholder: '00000000-0000-0000-0000-000000000000' }
        ]
      }
    ]
  }
];

export const allEndpoints = endpointGroups.flatMap((group) => group.endpoints);
