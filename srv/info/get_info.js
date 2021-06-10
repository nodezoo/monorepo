
module.exports = function make_get_info() {
  return async function get_info(msg) {
    return {x:22,y:msg.y}
  }
}
