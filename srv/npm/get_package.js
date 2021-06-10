
module.exports = function make_get_package() {
  return async function get_package(msg) {
    return {x:22,y:msg.y}
  }
}
