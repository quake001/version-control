const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userData: state => state.user.userData,
  permission_routes: state => state.permission.routes,
  userId: state => state.user.userId
}
export default getters
