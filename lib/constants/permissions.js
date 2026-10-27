export const PERMISSIONS = {
  USERS_VIEW: 'users.view',
  USERS_EDIT: 'users.edit',
  CONTENT_EDIT: 'content.edit',
  SETTINGS_EDIT: 'settings.edit'
}

export const ROLE_PERMISSIONS = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.SETTINGS_EDIT
  ],
  editor: [PERMISSIONS.CONTENT_EDIT],
  viewer: [PERMISSIONS.USERS_VIEW]
}
