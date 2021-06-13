
module.exports = function insert_package_query() {
  return async function insert_package(msg) {
    return {x:22,y:msg.y}
  }
}
